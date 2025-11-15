import type {
  BaseExecutor,
  ExecutorId,
  WorkflowContext,
  BaseMessage,
  Acl,
  StatusFlag,
} from "./types";
import type { EdgeGroup } from "./edges";

/**
 * Base executor handler function type
 */
export type ExecutorHandler<TMessage extends BaseMessage = BaseMessage> = (
  context: WorkflowContext<TMessage>
) => Promise<TMessage[] | void> | TMessage[] | void;

/**
 * Core Executor - base class for all workflow executors
 */
export interface Executor<TMessage extends BaseMessage = BaseMessage>
  extends BaseExecutor {
  type: "executor";
  handler?: ExecutorHandler<TMessage>;
}

/**
 * Function Executor - wraps user-defined functions (sync/async) to use as workflow nodes
 */
export interface FunctionExecutor<TMessage extends BaseMessage = BaseMessage>
  extends BaseExecutor {
  type: "function-executor";
  functionName: string;
  functionCode?: string; // For code-based functions
  functionId?: string; // For registered functions
  parameters?: Record<string, unknown>;
  handler?: ExecutorHandler<TMessage>;
}

/**
 * Workflow Executor - wraps a workflow as a single executor, enabling hierarchical nested workflows
 */
export interface WorkflowExecutor extends BaseExecutor {
  type: "workflow-executor";
  workflowId: string;
  workflowDefinition?: WorkflowDefinition;
  inputMapping?: Record<string, string>;
  outputMapping?: Record<string, string>;
}

/**
 * Workflow definition structure
 */
export interface WorkflowDefinition {
  id: string;
  name?: string;
  executors: BaseExecutor[];
  edges: EdgeDefinition[];
  metadata?: Record<string, unknown>;
  edgeGroups?: EdgeGroup[];
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  acl?: Acl;
  status?: StatusFlag;
}

/**
 * Edge definition in workflow
 */
export interface EdgeDefinition {
  id: string;
  source: ExecutorId;
  target: ExecutorId;
  condition?: EdgeConditionDefinition;
}

/**
 * Edge condition definition
 */
export interface EdgeConditionDefinition {
  type: "predicate" | "case";
  expression?: string;
  caseValue?: string;
}

/**
 * Agent Executor - built-in executor that wraps an agent for handling messages in workflows
 */
export interface AgentExecutor extends BaseExecutor {
  type: "agent-executor";
  agentId: string;
  agentType?: "chat" | "workflow" | "magentic";
  systemPrompt?: string;
  tools?: ToolReference[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  toolMode?: "auto" | "required" | "none";
}

/**
 * Tool reference in executor
 */
export interface ToolReference {
  toolId: string;
  enabled?: boolean;
  parameters?: Record<string, unknown>;
}

/**
 * Request Info Executor - gateway for external information requests
 */
export interface RequestInfoExecutor extends BaseExecutor {
  type: "request-info-executor";
  requestType: string;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  responseHandler?: string;
}

/**
 * Retry policy configuration
 */
export interface RetryPolicy {
  maxRetries: number;
  backoffMs?: number;
  exponentialBackoff?: boolean;
}

/**
 * Magentic Agent Executor - Magentic agent executor for participation in multi-agent workflows
 */
export interface MagenticAgentExecutor extends BaseExecutor {
  type: "magentic-agent-executor";
  agentRole: string;
  capabilities?: string[];
  systemPrompt?: string;
  tools?: ToolReference[];
}

/**
 * Magentic Orchestrator Executor - handles orchestration logic for Magentic One workflows
 */
export interface MagenticOrchestratorExecutor extends BaseExecutor {
  type: "magentic-orchestrator-executor";
  planningStrategy?: "sequential" | "parallel" | "adaptive";
  progressTracking?: boolean;
  humanInTheLoop?: boolean;
}

/**
 * Union type of all executor types
 */
export type WorkflowExecutorType =
  | Executor
  | FunctionExecutor
  | WorkflowExecutor
  | AgentExecutor
  | RequestInfoExecutor
  | MagenticAgentExecutor
  | MagenticOrchestratorExecutor;

/**
 * Executor type discriminator
 */
export type ExecutorType =
  | "executor"
  | "function-executor"
  | "workflow-executor"
  | "agent-executor"
  | "request-info-executor"
  | "magentic-agent-executor"
  | "magentic-orchestrator-executor";

/**
 * Type guard helpers
 */
export function isFunctionExecutor(
  executor: BaseExecutor
): executor is FunctionExecutor {
  return executor.type === "function-executor";
}

export function isWorkflowExecutor(
  executor: BaseExecutor
): executor is WorkflowExecutor {
  return executor.type === "workflow-executor";
}

export function isAgentExecutor(
  executor: BaseExecutor
): executor is AgentExecutor {
  return executor.type === "agent-executor";
}

export function isRequestInfoExecutor(
  executor: BaseExecutor
): executor is RequestInfoExecutor {
  return executor.type === "request-info-executor";
}

export function isMagenticAgentExecutor(
  executor: BaseExecutor
): executor is MagenticAgentExecutor {
  return executor.type === "magentic-agent-executor";
}

export function isMagenticOrchestratorExecutor(
  executor: BaseExecutor
): executor is MagenticOrchestratorExecutor {
  return executor.type === "magentic-orchestrator-executor";
}

/**
 * Get executor type label for UI
 */
export function getExecutorTypeLabel(type: ExecutorType): string {
  const labels: Record<ExecutorType, string> = {
    executor: "Executor",
    "function-executor": "Function",
    "workflow-executor": "Nested Workflow",
    "agent-executor": "Agent",
    "request-info-executor": "Request Info",
    "magentic-agent-executor": "Magentic Agent",
    "magentic-orchestrator-executor": "Magentic Orchestrator",
  };
  return labels[type] || type;
}

/**
 * Get executor type description for UI
 */
export function getExecutorTypeDescription(type: ExecutorType): string {
  const descriptions: Record<ExecutorType, string> = {
    executor: "Base executor for processing messages",
    "function-executor": "Execute a function as a workflow node",
    "workflow-executor": "Nest another workflow as an executor",
    "agent-executor": "Use an AI agent to process messages",
    "request-info-executor": "Gateway for external information requests",
    "magentic-agent-executor": "Magentic agent for multi-agent workflows",
    "magentic-orchestrator-executor": "Orchestrator for Magentic One workflows",
  };
  return descriptions[type] || "";
}
