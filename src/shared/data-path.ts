import * as path from "node:path"
import * as os from "node:os"
import { existsSync } from "node:fs"

/**
 * Returns the user-level data directory.
 * Matches OpenCode's behavior via xdg-basedir:
 * - All platforms: XDG_DATA_HOME or ~/.local/share
 *
 * Note: OpenCode uses xdg-basedir which returns ~/.local/share on ALL platforms
 * including Windows, so we match that behavior exactly.
 */
export function getDataDir(): string {
  return process.env.XDG_DATA_HOME ?? path.join(os.homedir(), ".local", "share")
}

/**
 * Returns the OpenCode storage directory path.
 * All platforms: ~/.local/share/opencode/storage
 */
export function getOpenCodeStorageDir(): string {
  return path.join(getDataDir(), "opencode", "storage")
}

/**
 * Returns the user-level cache directory.
 * Matches OpenCode's behavior via xdg-basedir:
 * - All platforms: XDG_CACHE_HOME or ~/.cache
 */
export function getCacheDir(): string {
  return process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache")
}

/**
 * Returns the agent-core cache directory.
 * All platforms: ~/.cache/agent-core
 */
export function getAgentCoreCacheDir(): string {
  return path.join(getCacheDir(), "agent-core")
}

/**
 * Returns the cache directory with backward-compatible fallback.
 * Prefers agent-core, falls back to oh-my-opencode if it exists.
 * All platforms: ~/.cache/agent-core (or ~/.cache/oh-my-opencode if legacy exists)
 */
export function getCacheDirWithFallback(): string {
  const agentCoreDir = getAgentCoreCacheDir()
  const legacyDir = path.join(getCacheDir(), "oh-my-opencode")
  
  // If legacy directory exists and new one doesn't, use legacy
  if (existsSync(legacyDir) && !existsSync(agentCoreDir)) {
    return legacyDir
  }
  
  return agentCoreDir
}

/**
 * Returns the OpenCode cache directory (for reading OpenCode's cache).
 * All platforms: ~/.cache/opencode
 */
export function getOpenCodeCacheDir(): string {
  return path.join(getCacheDir(), "opencode")
}

// Backward compatibility - keep old function name as alias
export { getCacheDirWithFallback as getOmoOpenCodeCacheDir }
