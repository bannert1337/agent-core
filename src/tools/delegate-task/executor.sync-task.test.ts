import { describe, it, expect, mock, beforeEach } from "bun:test"
import { executeSyncTask } from "./executor"
import { __setTimingConfig, __resetTimingConfig } from "./timing"
import type { DelegateTaskArgs, ToolContextWithMetadata } from "./types"
import type { ExecutorContext, ParentContext } from "./executor"

function createMockClient(overrides: {
  sessionCreateResult?: { data: { id: string }; error?: string }
  promptAsyncFn?: () => Promise<void>
  statusFn?: () => Promise<{ data: Record<string, { type: string }> }>
  messagesFn?: () => Promise<{ data: Array<{ info?: { role?: string; time?: { created?: number } }; parts?: Array<{ type?: string; text?: string }> }> }>
  configGetFn?: () => Promise<{ data?: { model?: string } }>
  sessionGetFn?: () => Promise<{ data?: { directory?: string } }>
} = {}) {
  return {
    session: {
      create: mock(() =>
        Promise.resolve(
          overrides.sessionCreateResult ?? {
            data: { id: "ses_test123" },
          }
        )
      ),
      prompt: mock(() => Promise.resolve()),
      promptAsync: mock(overrides.promptAsyncFn ?? (() => Promise.resolve())),
      status: mock(
        overrides.statusFn ??
          (() =>
            Promise.resolve({
              data: { ses_test123: { type: "idle" } },
            }))
      ),
      messages: mock(
        overrides.messagesFn ??
          (() =>
            Promise.resolve({
              data: [
                {
                  info: { role: "assistant", time: { created: 1000 } },
                  parts: [{ type: "text", text: "Oracle response content" }],
                },
              ],
            }))
      ),
      get: mock(
        overrides.sessionGetFn ??
          (() => Promise.resolve({ data: { directory: "/test" } }))
      ),
    },
    config: {
      get: mock(
        overrides.configGetFn ??
          (() => Promise.resolve({ data: { model: "anthropic/claude-sonnet-4" } }))
      ),
    },
    app: {
      agents: mock(() => Promise.resolve({ data: [] })),
    },
  }
}

function createMockCtx(overrides: Partial<ToolContextWithMetadata> = {}): ToolContextWithMetadata {
  return {
    sessionID: "ses_parent",
    messageID: "msg_parent",
    agent: "sisyphus",
    abort: new AbortController().signal,
    metadata: mock(() => Promise.resolve()),
    ...overrides,
  }
}

function createMockExecutorCtx(client: ReturnType<typeof createMockClient>): ExecutorContext {
  return {
    manager: {
      launch: mock(() => Promise.resolve({ id: "task_1", sessionID: "ses_test123", description: "test", agent: "oracle", status: "running" })),
      getTask: mock(() => ({ id: "task_1", sessionID: "ses_test123" })),
      resume: mock(() => Promise.resolve()),
    } as unknown as ExecutorContext["manager"],
    client: client as unknown as ExecutorContext["client"],
    directory: "/test",
  }
}

function createDefaultArgs(overrides: Partial<DelegateTaskArgs> = {}): DelegateTaskArgs {
  return {
    description: "Consult Oracle",
    prompt: "Review this architecture",
    run_in_background: false,
    load_skills: [],
    subagent_type: "oracle",
    ...overrides,
  }
}

function createDefaultParentContext(): ParentContext {
  return {
    sessionID: "ses_parent",
    messageID: "msg_parent",
    agent: "sisyphus",
  }
}

describe("executeSyncTask", () => {
  beforeEach(() => {
    __resetTimingConfig()
    __setTimingConfig({
      POLL_INTERVAL_MS: 10,
      MIN_STABILITY_TIME_MS: 0,
      STABILITY_POLLS_REQUIRED: 1,
      MAX_POLL_TIME_MS: 5000,
    })
  })

  describe("async prompt + polling pattern", () => {
    it("should use promptAsync instead of blocking prompt", async () => {
      //#given a mock client with both prompt and promptAsync
      const client = createMockClient()
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called
      await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then it should use promptAsync (fire-and-forget), NOT blocking prompt
      expect(client.session.promptAsync).toHaveBeenCalledTimes(1)
      expect(client.session.prompt).toHaveBeenCalledTimes(0)
    })

    it("should poll session status until idle and messages stabilize", async () => {
      //#given a client that transitions from busy to idle
      let callCount = 0
      const client = createMockClient({
        statusFn: () => {
          callCount++
          if (callCount <= 2) {
            return Promise.resolve({ data: { ses_test123: { type: "busy" } } })
          }
          return Promise.resolve({ data: { ses_test123: { type: "idle" } } })
        },
      })
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called
      const result = await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then it should have polled status multiple times
      expect(client.session.status.mock.calls.length).toBeGreaterThanOrEqual(3)

      //#then the result should contain the assistant response
      expect(result).toContain("Oracle response content")
    })

    it("should return result after message count stabilizes", async () => {
      //#given a client where messages stabilize immediately
      const client = createMockClient()
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called
      const result = await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then the result should contain the assistant response text
      expect(result).toContain("Oracle response content")
      expect(result).toContain("Task completed")
      expect(result).toContain("ses_test123")
    })
  })

  describe("session creation", () => {
    it("should create a session before sending prompt", async () => {
      //#given a mock client
      const client = createMockClient()
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called
      await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then session.create should have been called
      expect(client.session.create).toHaveBeenCalledTimes(1)
    })

    it("should return error when session creation fails", async () => {
      //#given a client that fails to create session
      const client = createMockClient({
        sessionCreateResult: { data: { id: "" }, error: "Failed to create" },
      })
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called
      const result = await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then it should return an error message
      expect(result).toContain("Failed to create")
    })
  })

  describe("abort handling", () => {
    it("should abort polling when abort signal fires", async () => {
      //#given a client that stays busy and an abort controller
      const abortController = new AbortController()
      const client = createMockClient({
        statusFn: () => {
          // Abort after first poll
          abortController.abort()
          return Promise.resolve({ data: { ses_test123: { type: "busy" } } })
        },
      })
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx({ abort: abortController.signal })
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called with an aborting signal
      const result = await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then it should indicate the task was aborted
      expect(result).toContain("aborted")
    })
  })

  describe("model passthrough", () => {
    it("should pass categoryModel to promptAsync body", async () => {
      //#given a category model
      const categoryModel = { providerID: "openai", modelID: "gpt-5.2" }
      const client = createMockClient()
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called with a category model
      await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", categoryModel, undefined)

      //#then promptAsync should include the model in the body
      const promptCall = client.session.promptAsync.mock.calls[0][0] as { body: { model?: { providerID: string; modelID: string } } }
      expect(promptCall.body.model).toEqual({ providerID: "openai", modelID: "gpt-5.2" })
    })

    it("should pass variant when categoryModel has variant", async () => {
      //#given a category model with variant
      const categoryModel = { providerID: "openai", modelID: "gpt-5.2", variant: "high" }
      const client = createMockClient()
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called with a model+variant
      await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", categoryModel, undefined)

      //#then promptAsync should include the variant
      const promptCall = client.session.promptAsync.mock.calls[0][0] as { body: { variant?: string } }
      expect(promptCall.body.variant).toBe("high")
    })
  })

  describe("error handling", () => {
    it("should handle promptAsync failure gracefully", async () => {
      //#given a client where promptAsync throws
      const client = createMockClient({
        promptAsyncFn: () => Promise.reject(new Error("Network error")),
      })
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called
      const result = await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then it should return an error message
      expect(result).toContain("Network error")
    })

    it("should return no-response message when no assistant messages exist", async () => {
      //#given a client that returns empty messages
      const client = createMockClient({
        messagesFn: () => Promise.resolve({ data: [] }),
      })
      const executorCtx = createMockExecutorCtx(client)
      const args = createDefaultArgs()
      const ctx = createMockCtx()
      const parentContext = createDefaultParentContext()

      //#when executeSyncTask is called
      const result = await executeSyncTask(args, ctx, executorCtx, parentContext, "oracle", undefined, undefined)

      //#then it should indicate no response
      expect(result).toContain("No assistant response")
    })
  })
})
