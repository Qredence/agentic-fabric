import type { ComponentType } from 'react';
import type { BaseExecutor } from './types';

export type EditorLoader = () => Promise<{ default: ComponentType<any> }>;
export type SchemaLoader = () => Promise<{ default: any }>;

type Entry = {
  editor: EditorLoader;
  schema?: SchemaLoader;
};

const entries: Record<string, Entry> = {
  'function-executor': {
    editor: () =>
      import('@/components/workflow-builder/executor-editors/function-executor-editor').then(
        (m) => ({ default: m.FunctionExecutorEditor as any }),
      ),
  },
  'agent-executor': {
    editor: () =>
      import('@/components/workflow-builder/executor-editors/agent-executor-editor').then((m) => ({
        default: m.AgentExecutorEditor as any,
      })),
  },
  'workflow-executor': {
    editor: () =>
      import('@/components/workflow-builder/executor-editors/workflow-executor-editor').then(
        (m) => ({ default: m.WorkflowExecutorEditor as any }),
      ),
  },
  'request-info-executor': {
    editor: () =>
      import('@/components/workflow-builder/executor-editors/request-info-executor-editor').then(
        (m) => ({ default: m.RequestInfoExecutorEditor as any }),
      ),
  },
  'magentic-agent-executor': {
    editor: () =>
      import('@/components/workflow-builder/executor-editors/magentic-agent-executor-editor').then(
        (m) => ({ default: m.MagenticAgentExecutorEditor as any }),
      ),
  },
  'magentic-orchestrator-executor': {
    editor: () =>
      import(
        '@/components/workflow-builder/executor-editors/magentic-orchestrator-executor-editor'
      ).then((m) => ({ default: m.MagenticOrchestratorExecutorEditor as any })),
  },
};

export const getEditorEntry = (type: string): Entry | undefined => entries[type];
