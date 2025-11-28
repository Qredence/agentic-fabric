import type { BaseExecutor } from './types';
import type {
  FunctionExecutor,
  AgentExecutor,
  WorkflowExecutor,
  RequestInfoExecutor,
  MagenticAgentExecutor,
  MagenticOrchestratorExecutor,
  ToolReference,
} from './executors';
import { MAGENTIC_AGENT_PRESET_MAP } from './magentic-presets';
import type { MagenticAgentPresetKey } from './magentic-presets';

type Factory = (id: string, label?: string, options?: { presetKey?: string }) => BaseExecutor;

const factories: Record<string, Factory> = {
  'function-executor': (id, label) =>
    ({
      id,
      type: 'function-executor',
      label: label || 'Function Executor',
      description: 'Execute a function as a workflow node',
    }) as FunctionExecutor,
  'agent-executor': (id, label) =>
    ({
      id,
      type: 'agent-executor',
      label: label || 'Agent Executor',
      description: 'Use an AI agent to process messages',
    }) as AgentExecutor,
  'workflow-executor': (id, label) =>
    ({
      id,
      type: 'workflow-executor',
      label: label || 'Workflow Executor',
      description: 'Nest another workflow as an executor',
      workflowId: '',
    }) as WorkflowExecutor,
  'request-info-executor': (id, label) =>
    ({
      id,
      type: 'request-info-executor',
      label: label || 'Request Info Executor',
      description: 'Gateway for external information requests',
      requestType: '',
    }) as RequestInfoExecutor,
  'magentic-orchestrator-executor': (id, label) =>
    ({
      id,
      type: 'magentic-orchestrator-executor',
      label: label || 'Magentic Orchestrator',
      description: 'Coordinates Magentic agents, planning and routing messages',
      planningStrategy: 'adaptive',
      progressTracking: true,
      humanInTheLoop: false,
      metadata: {
        source: 'agent-framework',
        magentic: {
          presetKey: 'orchestrator',
          planningStrategy: 'adaptive',
          progressTracking: true,
          humanInTheLoop: false,
        },
      },
    }) as MagenticOrchestratorExecutor,
  'magentic-agent-executor': (id, label, options) => {
    const preset = options?.presetKey
      ? MAGENTIC_AGENT_PRESET_MAP[options.presetKey as MagenticAgentPresetKey]
      : undefined;
    return {
      id,
      type: 'magentic-agent-executor',
      label: label || preset?.label || 'Magentic Agent',
      description:
        preset?.description ||
        'Specialised Magentic agent that collaborates under the orchestrator',
      agentRole: preset?.agentRole || 'generalist',
      capabilities: preset?.capabilities,
      systemPrompt: preset?.systemPrompt,
      tools: preset?.toolIds?.map((toolId: string) => ({ toolId, enabled: true }) as ToolReference),
      metadata: {
        source: 'agent-framework',
        magentic: {
          presetKey: preset?.key ?? null,
          agentRole: preset?.agentRole || 'generalist',
          capabilities: preset?.capabilities ?? [],
          toolIds: preset?.toolIds ?? [],
        },
      },
    } as MagenticAgentExecutor;
  },
  executor: (id, label) => ({
    id,
    type: 'executor',
    label: label || 'Executor',
    description: 'Base executor for processing messages',
  }),
};

export const getExecutorFactory = (type: string): Factory | undefined => factories[type];
