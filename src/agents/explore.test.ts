import { describe, test, expect } from "bun:test"
import { createExploreAgent, EXPLORE_PROMPT_METADATA } from "./explore"

describe("createExploreAgent", () => {
  describe("#given any model", () => {
    test("#then returns AgentConfig with required fields", () => {
      const model = "anthropic/claude-sonnet-4-6"
      const config = createExploreAgent(model)
      expect(config).toHaveProperty("description")
      expect(config).toHaveProperty("mode", "subagent")
      expect(config).toHaveProperty("model", model)
      expect(config).toHaveProperty("temperature", 0.1)
      expect(config).toHaveProperty("prompt")
    })

    test("#then has write/edit/task/call_omo_agent restrictions", () => {
      const model = "anthropic/claude-sonnet-4-6"
      const config = createExploreAgent(model)
      expect(config.permission).toBeDefined()
      const permission = config.permission as Record<string, string>
      expect(permission.write).toBe("deny")
      expect(permission.edit).toBe("deny")
      expect(permission.task).toBe("deny")
      expect(permission.call_omo_agent).toBe("deny")
    })

    test("#then prompt contains Intent Analysis requirement", () => {
      const model = "anthropic/claude-sonnet-4-6"
      const config = createExploreAgent(model)
      expect(config.prompt).toContain("Intent Analysis")
      expect(config.prompt).toContain("<analysis>")
    })

    test("#then prompt requires Parallel Execution", () => {
      const model = "anthropic/claude-sonnet-4-6"
      const config = createExploreAgent(model)
      expect(config.prompt).toContain("Parallel Execution")
      expect(config.prompt).toContain("3+ tools simultaneously")
    })
  })

  describe("#given Gemini model", () => {
    test("#then prompt contains tool strategy section", () => {
      const model = "google/gemini-3-flash"
      const config = createExploreAgent(model)
      expect(config.prompt).toContain("Tool Strategy")
      expect(config.prompt).toContain("Semantic search")
      expect(config.prompt).toContain("Structural patterns")
    })

    test("#then prompt contains results structure", () => {
      const model = "google/gemini-3-flash"
      const config = createExploreAgent(model)
      expect(config.prompt).toContain("<results>")
      expect(config.prompt).toContain("<files>")
      expect(config.prompt).toContain("<answer>")
    })
  })

  describe("#given OpenAI model", () => {
    test("#then prompt has success criteria defined", () => {
      const model = "openai/gpt-4o"
      const config = createExploreAgent(model)
      expect(config.prompt).toContain("Success Criteria")
      expect(config.prompt).toContain("absolute")
      expect(config.prompt).toContain("Completeness")
    })

    test("#then prompt has failure conditions defined", () => {
      const model = "openai/gpt-4o"
      const config = createExploreAgent(model)
      expect(config.prompt).toContain("Failure Conditions")
      expect(config.prompt).toContain("relative")
      expect(config.prompt).toContain("FAILED")
    })
  })
})

describe("EXPLORE_PROMPT_METADATA", () => {
  test("#then has correct category and cost", () => {
    expect(EXPLORE_PROMPT_METADATA.category).toBe("exploration")
    expect(EXPLORE_PROMPT_METADATA.cost).toBe("FREE")
    expect(EXPLORE_PROMPT_METADATA.promptAlias).toBe("Explore")
  })

  test("#then has keyTrigger for multi-module detection", () => {
    expect(EXPLORE_PROMPT_METADATA.keyTrigger).toBeDefined()
    expect(EXPLORE_PROMPT_METADATA.keyTrigger).toContain("2+ modules")
    expect(EXPLORE_PROMPT_METADATA.keyTrigger).toContain("explore")
  })

  test("#then has triggers for codebase exploration", () => {
    expect(EXPLORE_PROMPT_METADATA.triggers).toBeDefined()
    expect(EXPLORE_PROMPT_METADATA.triggers!.length).toBeGreaterThan(0)
    expect(EXPLORE_PROMPT_METADATA.triggers!.some(t => t.domain === "Explore")).toBe(true)
  })

  test("#then has useWhen guidance", () => {
    expect(EXPLORE_PROMPT_METADATA.useWhen).toBeDefined()
    expect(EXPLORE_PROMPT_METADATA.useWhen!.length).toBeGreaterThan(0)
    expect(EXPLORE_PROMPT_METADATA.useWhen!.some(u => u.includes("search"))).toBe(true)
  })

  test("#then has avoidWhen guidance", () => {
    expect(EXPLORE_PROMPT_METADATA.avoidWhen).toBeDefined()
    expect(EXPLORE_PROMPT_METADATA.avoidWhen!.length).toBeGreaterThan(0)
  })
})

describe("createExploreAgent.mode", () => {
  test("#then is set to 'subagent'", () => {
    expect(createExploreAgent.mode).toBe("subagent")
  })
})
