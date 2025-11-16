'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AgentConfig } from '@/lib/config/agent-config';
import { getAgentConfig, setAgentConfig, getAllAgentConfigs } from '@/lib/config/agent-config';

type Ctx = {
  configs: Record<string, AgentConfig>;
  get: (id: string) => AgentConfig | undefined;
  set: (id: string, cfg: Partial<AgentConfig>) => AgentConfig;
};

const ConfigCtx = createContext<Ctx | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, AgentConfig>>(() => getAllAgentConfigs());

  const get = useCallback((id: string) => getAgentConfig(id), []);
  const set = useCallback((id: string, cfg: Partial<AgentConfig>) => {
    const next = setAgentConfig(id, cfg);
    setConfigs((prev) => ({ ...prev, [id]: next }));
    return next;
  }, []);

  const value = useMemo(() => ({ configs, get, set }), [configs, get, set]);
  return <ConfigCtx.Provider value={value}>{children}</ConfigCtx.Provider>;
}

export function useAgentConfigStore() {
  const ctx = useContext(ConfigCtx);
  if (ctx) return ctx;
  return {
    configs: getAllAgentConfigs(),
    get: (id: string) => getAgentConfig(id),
    set: (id: string, cfg: Partial<AgentConfig>) => setAgentConfig(id, cfg),
  };
}
