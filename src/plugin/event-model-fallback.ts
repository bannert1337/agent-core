import type { CreatedHooks } from "../create-hooks";
import {
  getMainSessionID,
  getSessionAgent,
  subagentSessions,
  syncSubagentSessions,
} from "../features/claude-code-session-state";
import { setPendingModelFallback } from "../hooks/model-fallback/hook";
import { log } from "../shared/logger";
import { shouldRetryError } from "../shared/model-error-classifier";
import { setSessionModel } from "../shared/session-model-state";
import {
  extractErrorName,
  extractErrorMessage,
  extractProviderModelFromErrorMessage,
  normalizeFallbackModelID,
  isCompactionAgent,
} from "./event-error-extraction";

type EventInput = Parameters<NonNullable<NonNullable<CreatedHooks["writeExistingFileGuard"]>["event"]>>[0];

interface PluginClientContext {
  directory: string;
  client: {
    session: {
      abort: (input: { path: { id: string } }) => Promise<unknown>;
      prompt: (input: {
        path: { id: string };
        body: { parts: Array<{ type: "text"; text: string }> };
        query: { directory: string };
      }) => Promise<unknown>;
    };
  };
}

function shouldAutoRetrySession(sessionID: string): boolean {
  if (syncSubagentSessions.has(sessionID)) return true;
  const mainSessionID = getMainSessionID();
  if (mainSessionID) return sessionID === mainSessionID;
  return !subagentSessions.has(sessionID);
}

function resolveAgentName(sessionID: string, errorMessage: string): string | undefined {
  let agentName = getSessionAgent(sessionID);
  if (!agentName && sessionID === getMainSessionID()) {
    if (errorMessage.includes("claude-opus") || errorMessage.includes("opus")) {
      agentName = "sisyphus";
    } else if (errorMessage.includes("gpt-5")) {
      agentName = "hephaestus";
    } else {
      agentName = "sisyphus";
    }
  }
  return agentName;
}

async function triggerContinuePrompt(
  pluginContext: PluginClientContext,
  sessionID: string,
): Promise<void> {
  await pluginContext.client.session.abort({ path: { id: sessionID } }).catch(() => {});
  await pluginContext.client.session
    .prompt({
      path: { id: sessionID },
      body: { parts: [{ type: "text", text: "continue" }] },
      query: { directory: pluginContext.directory },
    })
    .catch(() => {});
}

export async function handleMessageUpdatedModelFallback(
  event: { type: string; properties?: Record<string, unknown> },
  hooks: CreatedHooks,
  pluginContext: PluginClientContext,
  isRuntimeFallbackEnabled: boolean,
  isModelFallbackEnabled: boolean,
  lastHandledModelErrorMessageID: Map<string, string>,
  lastKnownModelBySession: Map<string, { providerID: string; modelID: string }>,
): Promise<void> {
  if (!isModelFallbackEnabled || isRuntimeFallbackEnabled) return;

  const info = event.properties?.info as Record<string, unknown> | undefined;
  const sessionID = info?.sessionID as string | undefined;
  const role = info?.role as string | undefined;

  if (!sessionID || role !== "assistant") return;

  try {
    const assistantMessageID = info?.id as string | undefined;
    const assistantError = info?.error;
    const agent = info?.agent as string | undefined;

    if (!assistantMessageID || !assistantError) return;

    const lastHandled = lastHandledModelErrorMessageID.get(sessionID);
    if (lastHandled === assistantMessageID) return;

    const errorName = extractErrorName(assistantError);
    const errorMessage = extractErrorMessage(assistantError);
    const errorInfo = { name: errorName, message: errorMessage };

    if (!shouldRetryError(errorInfo)) return;

    const agentName = resolveAgentName(sessionID, errorMessage) ?? agent;

    if (agentName && !isCompactionAgent(agentName)) {
      const currentProvider = (info?.providerID as string | undefined) ?? "opencode";
      const rawModel = (info?.modelID as string | undefined) ?? "claude-opus-4-6";
      const currentModel = normalizeFallbackModelID(rawModel);

      const setFallback = setPendingModelFallback(sessionID, agentName, currentProvider, currentModel);

      if (
        setFallback &&
        shouldAutoRetrySession(sessionID) &&
        !hooks.stopContinuationGuard?.isStopped(sessionID)
      ) {
        lastHandledModelErrorMessageID.set(sessionID, assistantMessageID);
        await triggerContinuePrompt(pluginContext, sessionID);
      }
    }

    const providerID = info?.providerID as string | undefined;
    const modelID = info?.modelID as string | undefined;
    if (providerID && modelID) {
      lastKnownModelBySession.set(sessionID, { providerID, modelID });
      setSessionModel(sessionID, { providerID, modelID });
    }
  } catch (err) {
    log("[event] model-fallback error in message.updated:", { sessionID, error: err });
  }
}

export async function handleSessionStatusModelFallback(
  event: { type: string; properties?: Record<string, unknown> },
  hooks: CreatedHooks,
  pluginContext: PluginClientContext,
  isModelFallbackEnabled: boolean,
  lastHandledRetryStatusKey: Map<string, string>,
  lastKnownModelBySession: Map<string, { providerID: string; modelID: string }>,
): Promise<void> {
  if (!isModelFallbackEnabled) return;

  const sessionID = event.properties?.sessionID as string | undefined;
  const status = event.properties?.status as { type?: string; attempt?: number; message?: string; next?: number } | undefined;

  if (!sessionID || status?.type !== "retry") return;

  try {
    const retryMessage = typeof status.message === "string" ? status.message : "";
    const retryKey = `${status.attempt ?? "?"}:${status.next ?? "?"}:${retryMessage}`;
    if (lastHandledRetryStatusKey.get(sessionID) === retryKey) return;
    lastHandledRetryStatusKey.set(sessionID, retryKey);

    const errorInfo = { name: undefined as string | undefined, message: retryMessage };
    if (!shouldRetryError(errorInfo)) return;

    const agentName = resolveAgentName(sessionID, retryMessage);
    if (!agentName) return;

    const parsed = extractProviderModelFromErrorMessage(retryMessage);
    const lastKnown = lastKnownModelBySession.get(sessionID);
    const currentProvider = parsed.providerID ?? lastKnown?.providerID ?? "opencode";
    let currentModel = parsed.modelID ?? lastKnown?.modelID ?? "claude-opus-4-6";
    currentModel = normalizeFallbackModelID(currentModel);

    const setFallback = setPendingModelFallback(sessionID, agentName, currentProvider, currentModel);

    if (
      setFallback &&
      shouldAutoRetrySession(sessionID) &&
      !hooks.stopContinuationGuard?.isStopped(sessionID)
    ) {
      await triggerContinuePrompt(pluginContext, sessionID);
    }
  } catch (err) {
    log("[event] model-fallback error in session.status:", { sessionID, error: err });
  }
}
