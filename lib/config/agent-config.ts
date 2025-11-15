export type AgentPromptConfig = {
  system?: string
  userTemplate?: string
}

export type AgentToolsConfig = {
  tools: Array<{ id: string; enabled: boolean; params?: Record<string, unknown> }>
}

export type AgentModelConfig = {
  model?: string
  temperature?: number
  maxTokens?: number
}

export type AgentMemoryConfig = {
  contextWindow?: number
  retention?: "none" | "short" | "long"
}

export type AgentGuardrailsConfig = {
  inputField?: string
  pii?: boolean
  moderation?: boolean
  jailbreak?: boolean
  hallucination?: boolean
  continueOnError?: boolean
}

export type AgentConfig = {
  version: string
  prompt?: AgentPromptConfig
  tools?: AgentToolsConfig
  model?: AgentModelConfig
  memory?: AgentMemoryConfig
  guardrails?: AgentGuardrailsConfig
  updatedAt?: string
}

type ConfigMap = Record<string, AgentConfig>

const KEY = "agent-config-store"

function load(): ConfigMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ConfigMap
  } catch {
    return {}
  }
}

function save(map: ConfigMap) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map))
  } catch {}
}

let store: ConfigMap = {}

export function getAgentConfig(id: string): AgentConfig | undefined {
  if (!Object.keys(store).length) store = load()
  return store[id]
}

export function setAgentConfig(id: string, config: Partial<AgentConfig>): AgentConfig {
  if (!Object.keys(store).length) store = load()
  const base = store[id] || { version: "1.0" }
  const next: AgentConfig = {
    ...base,
    ...config,
    updatedAt: new Date().toISOString(),
  }
  store[id] = next
  save(store)
  return next
}

export function getAllAgentConfigs(): ConfigMap {
  if (!Object.keys(store).length) store = load()
  return { ...store }
}