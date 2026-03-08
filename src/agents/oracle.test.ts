import { describe, test, expect } from "bun:test"
import { createOracleAgent, ORACLE_PROMPT_METADATA } from "./oracle"

describe("createOracleAgent", () => {
  describe("#given Claude model", () => {
    test("#then returns AgentConfig with required fields", () => {
      // given
      const model = "anthropic/claude-opus-4-6"

      // when
      const config = createOracleAgent(model)

      // then
      expect(config).toHaveProperty("description")
      expect(config).toHaveProperty("mode", "subagent")
      expect(config).toHaveProperty("model", model)
      expect(config).toHaveProperty("temperature", 0.1)
      expect(config).toHaveProperty("prompt")
      expect(config).toHaveProperty("thinking")
      expect(config.thinking).toEqual({ type: "enabled", budgetTokens: 32000 })
    })

    test("#then has tool restrictions applied", () => {
      // given
      const model = "anthropic/claude-opus-4-6"

      // when
      const config = createOracleAgent(model)

      // then
      expect(config.permission).toBeDefined()
      const permission = config.permission as Record<string, string>
      expect(permission.write).toBe("deny")
      expect(permission.edit).toBe("deny")
      expect(permission.task).toBe("deny")
    })

    test("#then prompt contains expected sections", () => {
      // given
      const model = "anthropic/claude-opus-4-6"

      // when
      const config = createOracleAgent(model)

      // then
      expect(config.prompt).toContain("<context>")
      expect(config.prompt).toContain("<expertise>")
      expect(config.prompt).toContain("<decision_framework>")
      expect(config.prompt).toContain("<tool_usage_rules>")
    })
  })

  describe("#given GPT model", () => {
    test("#then returns AgentConfig with reasoningEffort", () => {
      // given
      const model = "openai/gpt-5.4"

      // when
      const config = createOracleAgent(model)

      // then
      expect(config).toHaveProperty("reasoningEffort", "medium")
      expect(config).toHaveProperty("textVerbosity", "high")
      expect(config.thinking).toBeUndefined()
    })

    test("#then uses GPT-optimized prompt", () => {
      // given
      const model = "openai/gpt-5.4"

      // when
      const config = createOracleAgent(model)

      // then
      expect(config.prompt).toContain("strategic technical advisor")
      expect(config.prompt).toContain("<output_verbosity_spec>")
      expect(config.prompt).toContain("<scope_discipline>")
    })

    test("#then has same tool restrictions as Claude", () => {
      // given
      const model = "openai/gpt-5.4"

      // when
      const config = createOracleAgent(model)

      // then
      expect(config.permission).toBeDefined()
      const permission = config.permission as Record<string, string>
      expect(permission.write).toBe("deny")
      expect(permission.edit).toBe("deny")
    })
  })

  describe("#given GitHub Copilot GPT model", () => {
    test("#then applies GPT-specific configuration", () => {
      // given
      const model = "github-copilot/gpt-5.4"

      // when
      const config = createOracleAgent(model)

      // then
      expect(config.reasoningEffort).toBe("medium")
      expect(config.textVerbosity).toBe("high")
      expect(config.prompt).toContain("<context>")
    })
  })
})

describe("ORACLE_PROMPT_METADATA", () => {
  test("#then has correct category and cost", () => {
    // given / when / then
    expect(ORACLE_PROMPT_METADATA.category).toBe("advisor")
    expect(ORACLE_PROMPT_METADATA.cost).toBe("EXPENSIVE")
    expect(ORACLE_PROMPT_METADATA.promptAlias).toBe("Oracle")
  })

  test("#then has delegation triggers defined", () => {
    // given / when / then
    expect(ORACLE_PROMPT_METADATA.triggers).toBeDefined()
    expect(ORACLE_PROMPT_METADATA.triggers!.length).toBeGreaterThan(0)
    expect(ORACLE_PROMPT_METADATA.triggers!.some(t => t.domain.includes("Architecture"))).toBe(true)
  })

  test("#then has useWhen and avoidWhen guidance", () => {
    // given / when / then
    expect(ORACLE_PROMPT_METADATA.useWhen).toBeDefined()
    expect(ORACLE_PROMPT_METADATA.useWhen!.length).toBeGreaterThan(0)
    expect(ORACLE_PROMPT_METADATA.avoidWhen).toBeDefined()
    expect(ORACLE_PROMPT_METADATA.avoidWhen!.length).toBeGreaterThan(0)
  })
})

describe("createOracleAgent.mode", () => {
  test("#then is set to 'subagent'", () => {
    // given / when / then
    expect(createOracleAgent.mode).toBe("subagent")
  })
})
