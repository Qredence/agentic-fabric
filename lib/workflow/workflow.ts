import type {
  BaseExecutor,
  BaseEdge,
  ExecutorId,
  EdgeId,
  WorkflowContext,
  BaseMessage,
  SharedState,
} from "./types";
import type {
  WorkflowDefinition,
  EdgeDefinition,
  WorkflowExecutorType,
} from "./executors";
import type { EdgeGroup } from "./edges";
import type { WorkflowEvent } from "./events";

/**
 * Workflow - graph-based execution engine that orchestrates connected executors
 */
export interface Workflow {
  id: string;
  name?: string;
  version?: string;
  description?: string;
  executors: BaseExecutor[];
  edges: BaseEdge[];
  edgeGroups?: EdgeGroup[];
  metadata?: WorkflowMetadata;
  state?: WorkflowState;
}

/**
 * Workflow metadata
 */
export interface WorkflowMetadata {
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  custom?: Record<string, unknown>;
}

/**
 * Workflow state during execution
 */
export interface WorkflowState {
  runId: string;
  status: WorkflowStatus;
  sharedState: SharedState;
  checkpoints?: WorkflowCheckpoint[];
  events: WorkflowEvent[];
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: WorkflowError;
}

/**
 * Workflow status
 */
export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

/**
 * Workflow error
 */
export interface WorkflowError {
  code: string;
  message: string;
  details?: unknown;
  executorId?: ExecutorId;
  timestamp: string;
}

/**
 * Workflow checkpoint - complete checkpoint of workflow state
 */
export interface WorkflowCheckpoint {
  id: string;
  timestamp: string;
  state: WorkflowState;
  executorStates?: Record<ExecutorId, ExecutorState>;
}

/**
 * Executor state
 */
export interface ExecutorState {
  executorId: ExecutorId;
  status: "pending" | "running" | "completed" | "failed";
  messages?: BaseMessage[];
  error?: WorkflowError;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Workflow Builder - primary builder for constructing custom workflows
 */
export interface WorkflowBuilder {
  workflow: Workflow;

  /**
   * Add an executor to the workflow
   */
  addExecutor(executor: BaseExecutor): WorkflowBuilder;

  /**
   * Add multiple executors
   */
  addExecutors(executors: BaseExecutor[]): WorkflowBuilder;

  /**
   * Add an edge between executors
   */
  addEdge(
    source: ExecutorId,
    target: ExecutorId,
    condition?: EdgeCondition
  ): WorkflowBuilder;

  /**
   * Add multiple edges
   */
  addEdges(edges: BaseEdge[]): WorkflowBuilder;

  /**
   * Add an edge group
   */
  addEdgeGroup(group: EdgeGroup): WorkflowBuilder;

  /**
   * Set workflow metadata
   */
  setMetadata(metadata: WorkflowMetadata): WorkflowBuilder;

  /**
   * Build the workflow
   */
  build(): Workflow;
}

/**
 * Edge condition for builder
 */
export interface EdgeCondition {
  type: "predicate" | "case" | "always";
  expression?: string;
  caseValue?: string;
}

/**
 * Workflow Runner - runs workflows in Pregel supersteps
 */
export interface WorkflowRunner {
  run(workflow: Workflow, input?: unknown[]): Promise<WorkflowRunResult>;
  stream?(
    workflow: Workflow,
    input?: unknown[]
  ): AsyncIterable<WorkflowRunResult>;
}

/**
 * Workflow Run Result - container for events from workflow execution
 */
export interface WorkflowRunResult {
  workflowId: string;
  runId: string;
  status: WorkflowStatus;
  events: WorkflowEvent[];
  output?: unknown;
  error?: WorkflowError;
  duration?: number;
}

/**
 * Runner Context - protocol for execution context
 */
export interface RunnerContext {
  sendMessage: (target: ExecutorId, message: BaseMessage) => void;
  yieldOutput: (output: unknown) => void;
  emitEvent: (event: WorkflowEvent) => void;
  checkpoint?: () => Promise<void>;
}

/**
 * In-Process Runner Context - in-process execution context with optional checkpointing
 */
export interface InProcRunnerContext extends RunnerContext {
  workflowId: string;
  runId: string;
  sharedState: SharedState;
  checkpoints: WorkflowCheckpoint[];
  enableCheckpointing: boolean;
}

/**
 * Create a new workflow builder
 */
export function createWorkflowBuilder(id: string, name?: string): WorkflowBuilder {
  const workflow: Workflow = {
    id,
    name,
    executors: [],
    edges: [],
    edgeGroups: [],
    metadata: {},
  };

  return {
    workflow,

    addExecutor(executor: BaseExecutor) {
      this.workflow.executors.push(executor);
      return this;
    },

    addExecutors(executors: BaseExecutor[]) {
      this.workflow.executors.push(...executors);
      return this;
    },

    addEdge(source: ExecutorId, target: ExecutorId, condition?: EdgeCondition) {
      const edge: BaseEdge = {
        id: `edge-${this.workflow.edges.length + 1}`,
        source,
        target,
        condition: condition
          ? {
              type: condition.type,
              expression: condition.expression,
              caseValue: condition.caseValue,
            }
          : undefined,
      };
      this.workflow.edges.push(edge);
      return this;
    },

    addEdges(edges: BaseEdge[]) {
      this.workflow.edges.push(...edges);
      return this;
    },

    addEdgeGroup(group: EdgeGroup) {
      if (!this.workflow.edgeGroups) {
        this.workflow.edgeGroups = [];
      }
      this.workflow.edgeGroups.push(group);
      return this;
    },

    setMetadata(metadata: WorkflowMetadata) {
      this.workflow.metadata = { ...this.workflow.metadata, ...metadata };
      return this;
    },

    build() {
      return { ...this.workflow };
    },
  };
}

/**
 * Validate workflow structure
 */
export interface WorkflowValidationResult {
  valid: boolean;
  errors: WorkflowValidationError[];
  warnings: WorkflowValidationWarning[];
}

/**
 * Workflow validation error
 */
export interface WorkflowValidationError {
  code: string;
  message: string;
  executorId?: ExecutorId;
  edgeId?: EdgeId;
}

/**
 * Workflow validation warning
 */
export interface WorkflowValidationWarning {
  code: string;
  message: string;
  executorId?: ExecutorId;
  edgeId?: EdgeId;
}

/**
 * Validate workflow
 */
export function validateWorkflow(
  workflow: Workflow
): WorkflowValidationResult {
  const errors: WorkflowValidationError[] = [];
  const warnings: WorkflowValidationWarning[] = [];

  // Check for duplicate executor IDs
  const executorIds = new Set<ExecutorId>();
  for (const executor of workflow.executors) {
    if (executorIds.has(executor.id)) {
      errors.push({
        code: "duplicate-executor-id",
        message: `Duplicate executor ID: ${executor.id}`,
        executorId: executor.id,
      });
    }
    executorIds.add(executor.id);
  }

  // Check for duplicate edge IDs
  const edgeIds = new Set<EdgeId>();
  for (const edge of workflow.edges) {
    if (edgeIds.has(edge.id)) {
      errors.push({
        code: "duplicate-edge-id",
        message: `Duplicate edge ID: ${edge.id}`,
        edgeId: edge.id,
      });
    }
    edgeIds.add(edge.id);

    // Check that source and target executors exist
    if (!executorIds.has(edge.source)) {
      errors.push({
        code: "invalid-edge-source",
        message: `Edge source executor not found: ${edge.source}`,
        edgeId: edge.id,
        executorId: edge.source,
      });
    }
    if (!executorIds.has(edge.target)) {
      errors.push({
        code: "invalid-edge-target",
        message: `Edge target executor not found: ${edge.target}`,
        edgeId: edge.id,
        executorId: edge.target,
      });
    }
  }

  // Check for orphaned executors (no incoming or outgoing edges)
  for (const executor of workflow.executors) {
    const hasIncoming = workflow.edges.some((e) => e.target === executor.id);
    const hasOutgoing = workflow.edges.some((e) => e.source === executor.id);
    if (!hasIncoming && !hasOutgoing) {
      warnings.push({
        code: "orphaned-executor",
        message: `Executor has no connections: ${executor.id}`,
        executorId: executor.id,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Convert workflow definition to workflow
 */
export function workflowDefinitionToWorkflow(
  definition: WorkflowDefinition
): Workflow {
  return {
    id: definition.id,
    name: definition.name,
    executors: definition.executors,
    edges: definition.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      condition: edge.condition
        ? {
            type: edge.condition.type,
            expression: edge.condition.expression,
            caseValue: edge.condition.caseValue,
          }
        : undefined,
    })),
    metadata: definition.metadata,
  };
}
