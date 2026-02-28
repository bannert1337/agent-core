import { getSessionAgent } from "../features/claude-code-session-state"
import { getAgentConfigKey } from "./agent-display-names"

export const ORCHESTRATOR_AGENTS = new Set([
  "sisyphus",
  "sisyphus-junior",
  "atlas",
  "hephaestus",
  "prometheus",
])

export function isOrchestratorAgent(sessionID: string, inputAgent?: string): boolean {
  const agent = getSessionAgent(sessionID) ?? inputAgent
  if (!agent) return true
  const agentKey = getAgentConfigKey(agent)
  return (
    ORCHESTRATOR_AGENTS.has(agentKey) ||
    agentKey.includes("sisyphus") ||
    agentKey.includes("atlas")
  )
}
