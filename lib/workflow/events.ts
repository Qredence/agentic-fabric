import type { ExecutorId } from './types';

/**
 * Base event interface - all workflow events extend this
 */
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Workflow Events
// ============================================================================

/**
 * Workflow started event - emitted when workflow run begins
 */
export interface WorkflowStartedEvent extends BaseEvent {
  type: 'workflow-started';
  workflowId: string;
  runId: string;
}

/**
 * Workflow failed event - emitted when workflow terminates with error
 */
export interface WorkflowFailedEvent extends BaseEvent {
  type: 'workflow-failed';
  workflowId: string;
  runId: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Workflow output event - emitted when workflow yields output
 */
export interface WorkflowOutputEvent extends BaseEvent {
  type: 'workflow-output';
  workflowId: string;
  runId: string;
  output: unknown;
}

/**
 * Request info event - emitted when executor requests external information
 */
export interface RequestInfoEvent extends BaseEvent {
  type: 'request-info';
  executorId: ExecutorId;
  requestType: string;
  requestData: unknown;
  correlationId: string;
}

// ============================================================================
// Executor Events
// ============================================================================

/**
 * Base executor event
 */
export interface BaseExecutorEvent extends BaseEvent {
  executorId: ExecutorId;
  workflowId: string;
  runId: string;
}

/**
 * Executor invoked event - emitted when executor handler is invoked
 */
export interface ExecutorInvokedEvent extends BaseExecutorEvent {
  type: 'executor-invoked';
  inputMessages: unknown[];
}

/**
 * Executor completed event - emitted when executor handler completes
 */
export interface ExecutorCompletedEvent extends BaseExecutorEvent {
  type: 'executor-completed';
  outputMessages: unknown[];
  duration?: number;
}

/**
 * Executor failed event - emitted when executor handler raises error
 */
export interface ExecutorFailedEvent extends BaseExecutorEvent {
  type: 'executor-failed';
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ============================================================================
// Agent Events
// ============================================================================

/**
 * Agent run event - emitted when agent run completes
 */
export interface AgentRunEvent extends BaseEvent {
  type: 'agent-run';
  agentId: string;
  runId: string;
  messages: unknown[];
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Agent run update event - emitted during agent streaming
 */
export interface AgentRunUpdateEvent extends BaseEvent {
  type: 'agent-run-update';
  agentId: string;
  runId: string;
  delta: unknown;
  finished: boolean;
}

/**
 * Magentic agent message event - message from Magentic agent
 */
export interface MagenticAgentMessageEvent extends BaseEvent {
  type: 'magentic-agent-message';
  agentId: string;
  workflowId: string;
  message: unknown;
}

/**
 * Magentic agent delta event - incremental agent output during streaming
 */
export interface MagenticAgentDeltaEvent extends BaseEvent {
  type: 'magentic-agent-delta';
  agentId: string;
  workflowId: string;
  delta: unknown;
}

/**
 * Magentic orchestrator message event - message from orchestrator
 */
export interface MagenticOrchestratorMessageEvent extends BaseEvent {
  type: 'magentic-orchestrator-message';
  workflowId: string;
  message: unknown;
}

/**
 * Magentic final result event - final result of Magentic workflow
 */
export interface MagenticFinalResultEvent extends BaseEvent {
  type: 'magentic-final-result';
  workflowId: string;
  result: unknown;
}

/**
 * Union type of all workflow events
 */
export type WorkflowEvent =
  | WorkflowStartedEvent
  | WorkflowFailedEvent
  | WorkflowOutputEvent
  | RequestInfoEvent
  | ExecutorInvokedEvent
  | ExecutorCompletedEvent
  | ExecutorFailedEvent
  | AgentRunEvent
  | AgentRunUpdateEvent
  | MagenticAgentMessageEvent
  | MagenticAgentDeltaEvent
  | MagenticOrchestratorMessageEvent
  | MagenticFinalResultEvent;

/**
 * Type guard helpers
 */
export function isWorkflowEvent(
  event: BaseEvent,
): event is WorkflowStartedEvent | WorkflowFailedEvent | WorkflowOutputEvent {
  return event.type.startsWith('workflow-');
}

export function isExecutorEvent(
  event: BaseEvent,
): event is ExecutorInvokedEvent | ExecutorCompletedEvent | ExecutorFailedEvent {
  return event.type.startsWith('executor-');
}

export function isAgentEvent(event: BaseEvent): event is AgentRunEvent | AgentRunUpdateEvent {
  return event.type.startsWith('agent-run');
}

export function isMagenticEvent(event: BaseEvent): boolean {
  return event.type.startsWith('magentic-');
}
