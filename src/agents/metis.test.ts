import { describe, test, expect } from "bun:test"
import { createMetisAgent, METIS_SYSTEM_PROMPT, metisPromptMetadata } from "./metis"

describe("createMetisAgent", () => {
  describe("#given any model", () => {
    test("#then returns AgentConfig with required fields", () => {
      const model = "anthropic/claude-opus-4-6"
      const config = createMetisAgent(model)
      expect(config).toHaveProperty("description")
      expect(config).toHaveProperty("mode", "subagent")
      expect(config).toHaveProperty("model", model)
      expect(config).toHaveProperty("temperature", 0.3)
      expect(config).toHaveProperty("prompt")
    })

    test("#then has write/edit/task restrictions", () => {
      const model = "anthropic/claude-opus-4-6"
      const config = createMetisAgent(model)
      expect(config.permission).toBeDefined()
      const permission = config.permission as Record<string, string>
      expect(permission.write).toBe("deny")
      expect(permission.edit).toBe("deny")
      expect(permission.task).toBe("deny")
    })

    test("#then prompt contains intent classification section", () => {
      const model = "anthropic/claude-opus-4-6"
      const config = createMetisAgent(model)
      expect(config.prompt).toContain("PHASE 0: INTENT CLASSIFICATION")
      expect(config.prompt).toContain("Refactoring")
      expect(config.prompt).toContain("Build from Scratch")
    })
  })

  describe("#given Claude model", () => {
    test("#then returns AgentConfig with thinking enabled", () => {
      const model = "anthropic/claude-opus-4-6"
      const config = createMetisAgent(model)
      expect(config.thinking).toBeDefined()
      expect(config.thinking).toEqual({ type: "enabled", budgetTokens: 32000 })
    })

    test("#then prompt includes AI-slop pattern detection", () => {
      const model = "anthropic/claude-opus-4-6"
      const config = createMetisAgent(model)
      expect(config.prompt).toContain("AI-Slop Patterns to Flag")
      expect(config.prompt).toContain("Scope inflation")
      expect(config.prompt).toContain("Premature abstraction")
    })
  })

  describe("#given various models", () => {
    test("#then prompt includes output format specification", () => {
      const model = "openai/gpt-5.4"
      const config = createMetisAgent(model)
      expect(config.prompt).toContain("OUTPUT FORMAT")
      expect(config.prompt).toContain("Intent Classification")
      expect(config.prompt).toContain("Directives for Prometheus")
    })

    test("#then prompt includes QA automation directives", () => {
      const model = "google/gemini-3-flash"
      const config = createMetisAgent(model)
      expect(config.prompt).toContain("ZERO USER INTERVENTION PRINCIPLE")
      expect(config.prompt).toContain("QA/Acceptance Criteria Directives")
    })
  })
})

describe("METIS_SYSTEM_PROMPT", () => {
  test("#then contains constraint about being read-only", () => {
    expect(METIS_SYSTEM_PROMPT).toContain("READ-ONLY")
    expect(METIS_SYSTEM_PROMPT).toContain("analyze, question, advise")
  })

  test("#then contains intent type definitions", () => {
    expect(METIS_SYSTEM_PROMPT).toContain("Refactoring")
    expect(METIS_SYSTEM_PROMPT).toContain("Build from Scratch")
    expect(METIS_SYSTEM_PROMPT).toContain("Mid-sized Task")
    expect(METIS_SYSTEM_PROMPT).toContain("Collaborative")
    expect(METIS_SYSTEM_PROMPT).toContain("Architecture")
    expect(METIS_SYSTEM_PROMPT).toContain("Research")
  })

  test("#then contains critical rules section", () => {
    expect(METIS_SYSTEM_PROMPT).toContain("CRITICAL RULES")
    expect(METIS_SYSTEM_PROMPT).toContain("NEVER")
    expect(METIS_SYSTEM_PROMPT).toContain("ALWAYS")
  })
})

describe("metisPromptMetadata", () => {
  test("#then has correct category and cost", () => {
    expect(metisPromptMetadata.category).toBe("advisor")
    expect(metisPromptMetadata.cost).toBe("EXPENSIVE")
    expect(metisPromptMetadata.promptAlias).toBe("Metis")
  })

  test("#then has triggers for pre-planning analysis", () => {
    expect(metisPromptMetadata.triggers).toBeDefined()
    expect(metisPromptMetadata.triggers!.length).toBeGreaterThan(0)
    expect(metisPromptMetadata.triggers!.some(t => t.domain.includes("Pre-planning"))).toBe(true)
  })

  test("#then has keyTrigger for complex requests", () => {
    expect(metisPromptMetadata.keyTrigger).toBeDefined()
    expect(metisPromptMetadata.keyTrigger).toContain("Metis")
    expect(metisPromptMetadata.keyTrigger).toContain("Prometheus")
  })

  test("#then has useWhen guidance for ambiguous requests", () => {
    expect(metisPromptMetadata.useWhen).toBeDefined()
    expect(metisPromptMetadata.useWhen!.some(u => u.includes("ambiguous"))).toBe(true)
  })

  test("#then has avoidWhen guidance", () => {
    expect(metisPromptMetadata.avoidWhen).toBeDefined()
    expect(metisPromptMetadata.avoidWhen!.length).toBeGreaterThan(0)
  })
})

describe("createMetisAgent.mode", () => {
  test("#then is set to 'subagent'", () => {
    expect(createMetisAgent.mode).toBe("subagent")
  })
})
