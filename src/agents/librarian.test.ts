import { describe, test, expect } from "bun:test"
import { createLibrarianAgent, LIBRARIAN_PROMPT_METADATA } from "./librarian"

describe("createLibrarianAgent", () => {
  describe("#given any model", () => {
    test("#then returns AgentConfig with required fields", () => {
      // given
      const model = "google/gemini-3-flash"

      // when
      const config = createLibrarianAgent(model)

      // then
      expect(config).toHaveProperty("description")
      expect(config).toHaveProperty("mode", "subagent")
      expect(config).toHaveProperty("model", model)
      expect(config).toHaveProperty("temperature", 0.1)
      expect(config).toHaveProperty("prompt")
    })

    test("#then has write/edit/task/call_omo_agent restrictions", () => {
      // given
      const model = "google/gemini-3-flash"

      // when
      const config = createLibrarianAgent(model)

      // then
      expect(config.permission).toBeDefined()
      const permission = config.permission as Record<string, string>
      expect(permission.write).toBe("deny")
      expect(permission.edit).toBe("deny")
      expect(permission.task).toBe("deny")
      expect(permission.call_omo_agent).toBe("deny")
    })

    test("#then prompt contains PHASE 0 classification section", () => {
      // given
      const model = "google/gemini-3-flash"

      // when
      const config = createLibrarianAgent(model)

      // then
      expect(config.prompt).toContain("PHASE 0: REQUEST CLASSIFICATION")
      expect(config.prompt).toContain("TYPE A: CONCEPTUAL")
      expect(config.prompt).toContain("TYPE B: IMPLEMENTATION")
    })
  })

  describe("#given OpenAI model", () => {
    test("#then prompt includes date awareness section", () => {
      // given
      const model = "openai/gpt-4o"

      // when
      const config = createLibrarianAgent(model)

      // then
      expect(config.prompt).toContain("CRITICAL: DATE AWARENESS")
      expect(config.prompt).toContain("CURRENT YEAR CHECK")
    })

    test("#then prompt includes documentation discovery phase", () => {
      // given
      const model = "openai/gpt-4o"

      // when
      const config = createLibrarianAgent(model)

      // then
      expect(config.prompt).toContain("PHASE 0.5: DOCUMENTATION DISCOVERY")
      expect(config.prompt).toContain("websearch")
      expect(config.prompt).toContain("sitemap")
    })
  })

  describe("#given Gemini model", () => {
    test("#then prompt includes tool reference section", () => {
      // given
      const model = "google/gemini-3-flash"

      // when
      const config = createLibrarianAgent(model)

      // then
      expect(config.prompt).toContain("TOOL REFERENCE")
      expect(config.prompt).toContain("context7")
      expect(config.prompt).toContain("grep_app")
    })

    test("#then prompt includes parallel execution requirements", () => {
      // given
      const model = "google/gemini-3-flash"

      // when
      const config = createLibrarianAgent(model)

      // then
      expect(config.prompt).toContain("PARALLEL EXECUTION REQUIREMENTS")
      expect(config.prompt).toContain("Minimum Parallel Calls")
    })
  })
})

describe("LIBRARIAN_PROMPT_METADATA", () => {
  test("#then has correct category and cost", () => {
    expect(LIBRARY_PROMPT_METADATA.category).toBe("exploration")
    expect(LIBRARY_PROMPT_METADATA.cost).toBe("CHEAP")
    expect(LIBRARY_PROMPT_METADATA.promptAlias).toBe("Librarian")
  })

  test("#then has keyTrigger for external library detection", () => {
    expect(LIBRARY_PROMPT_METADATA.keyTrigger).toBeDefined()
    expect(LIBRARY_PROMPT_METADATA.keyTrigger).toContain("External library")
    expect(LIBRARY_PROMPT_METADATA.keyTrigger).toContain("librarian")
  })

  test("#then has triggers for codebase exploration", () => {
    expect(LIBRARY_PROMPT_METADATA.triggers).toBeDefined()
    expect(LIBRARY_PROMPT_METADATA.triggers!.length).toBeGreaterThan(0)
    expect(LIBRARY_PROMPT_METADATA.triggers!.some(t => t.domain === "Librarian")).toBe(true)
  })

  test("#then has useWhen guidance for library questions", () => {
    expect(LIBRARY_PROMPT_METADATA.useWhen).toBeDefined()
    expect(LIBRARY_PROMPT_METADATA.useWhen!.length).toBeGreaterThan(0)
    expect(LIBRARY_PROMPT_METADATA.useWhen!.some(u => u.includes("library"))).toBe(true)
  })
})

describe("createLibrarianAgent.mode", () => {
  test("#then is set to 'subagent'", () => {
    expect(createLibrarianAgent.mode).toBe("subagent")
  })
})
