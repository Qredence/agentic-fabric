import type { Workflow } from "../workflow";
import type {
  WorkflowValidationResult,
  WorkflowValidationError,
  WorkflowValidationWarning,
} from "../workflow";
import { validateWorkflow as validateWorkflowStructure } from "../workflow";
import type { BaseExecutor } from "../types";
import type { ExecutorType } from "../executors";

/**
 * Extended validation result with additional checks
 */
export interface ExtendedValidationResult extends WorkflowValidationResult {
  typeErrors: TypeValidationError[];
  connectivityWarnings: ConnectivityWarning[];
}

/**
 * Type validation error
 */
export interface TypeValidationError {
  code: string;
  message: string;
  executorId?: string;
  edgeId?: string;
  expectedType?: string;
  actualType?: string;
}

/**
 * Connectivity warning
 */
export interface ConnectivityWarning {
  code: string;
  message: string;
  executorId?: string;
  connectedExecutors?: string[];
}

/**
 * Validate workflow with extended checks
 */
export function validateWorkflowExtended(
  workflow: Workflow
): ExtendedValidationResult {
  const baseValidation = validateWorkflowStructure(workflow);
  const typeErrors: TypeValidationError[] = [];
  const connectivityWarnings: ConnectivityWarning[] = [];

  // Validate executor types
  for (const executor of workflow.executors) {
    const typeError = validateExecutorType(executor);
    if (typeError) {
      typeErrors.push(typeError);
    }
  }

  // Validate edge type compatibility
  for (const edge of workflow.edges) {
    const sourceExecutor = workflow.executors.find((e) => e.id === edge.source);
    const targetExecutor = workflow.executors.find((e) => e.id === edge.target);

    if (sourceExecutor && targetExecutor) {
      const compatibilityError = validateEdgeCompatibility(
        sourceExecutor,
        targetExecutor,
        edge
      );
      if (compatibilityError) {
        typeErrors.push(compatibilityError);
      }
    }
  }

  // Check connectivity
  for (const executor of workflow.executors) {
    const connected = getConnectedExecutors(workflow, executor.id);
    if (connected.incoming.length === 0 && connected.outgoing.length === 0) {
      connectivityWarnings.push({
        code: "isolated-executor",
        message: `Executor ${executor.id} is isolated (no connections)`,
        executorId: executor.id,
      });
    } else if (connected.incoming.length === 0) {
      connectivityWarnings.push({
        code: "no-incoming-edges",
        message: `Executor ${executor.id} has no incoming edges`,
        executorId: executor.id,
        connectedExecutors: connected.outgoing,
      });
    } else if (connected.outgoing.length === 0) {
      connectivityWarnings.push({
        code: "no-outgoing-edges",
        message: `Executor ${executor.id} has no outgoing edges`,
        executorId: executor.id,
        connectedExecutors: connected.incoming,
      });
    }
  }

  return {
    ...baseValidation,
    typeErrors,
    connectivityWarnings,
  };
}

/**
 * Validate executor type
 */
function validateExecutorType(
  executor: BaseExecutor
): TypeValidationError | null {
  const validTypes: ExecutorType[] = [
    "executor",
    "function-executor",
    "workflow-executor",
    "agent-executor",
    "request-info-executor",
    "magentic-agent-executor",
    "magentic-orchestrator-executor",
  ];

  if (!validTypes.includes(executor.type as ExecutorType)) {
    return {
      code: "invalid-executor-type",
      message: `Invalid executor type: ${executor.type}`,
      executorId: executor.id,
      expectedType: validTypes.join(" | "),
      actualType: executor.type,
    };
  }

  return null;
}

/**
 * Validate edge compatibility between executors
 */
function validateEdgeCompatibility(
  source: BaseExecutor,
  target: BaseExecutor,
  edge: { id: string }
): TypeValidationError | null {
  // Basic compatibility checks
  // In a full implementation, this would check message type compatibility
  // For now, we just ensure both executors exist and are valid

  // Check if source executor can produce messages
  // Check if target executor can consume messages from source
  // This is a simplified check - actual implementation would need
  // to validate message type compatibility

  return null;
}

/**
 * Get connected executors for a given executor
 */
function getConnectedExecutors(
  workflow: Workflow,
  executorId: string
): {
  incoming: string[];
  outgoing: string[];
} {
  const incoming = workflow.edges
    .filter((e) => e.target === executorId)
    .map((e) => e.source);
  const outgoing = workflow.edges
    .filter((e) => e.source === executorId)
    .map((e) => e.target);

  return { incoming, outgoing };
}

/**
 * Validate workflow schema against expected structure
 */
export function validateWorkflowSchema(workflow: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!workflow || typeof workflow !== "object") {
    errors.push("Workflow must be an object");
    return { valid: false, errors };
  }

  const wf = workflow as Record<string, unknown>;

  if (!wf.id || typeof wf.id !== "string") {
    errors.push("Workflow must have a string 'id' property");
  }

  if (wf.executors) {
    if (!Array.isArray(wf.executors)) {
      errors.push("Workflow 'executors' must be an array");
    } else {
      wf.executors.forEach((executor, idx) => {
        if (!executor || typeof executor !== "object") {
          errors.push(`Executor at index ${idx} must be an object`);
        } else {
          const exec = executor as Record<string, unknown>;
          if (!exec.id || typeof exec.id !== "string") {
            errors.push(`Executor at index ${idx} must have a string 'id' property`);
          }
          if (!exec.type || typeof exec.type !== "string") {
            errors.push(`Executor at index ${idx} must have a string 'type' property`);
          }
        }
      });
    }
  }

  if (wf.edges) {
    if (!Array.isArray(wf.edges)) {
      errors.push("Workflow 'edges' must be an array");
    } else {
      wf.edges.forEach((edge, idx) => {
        if (!edge || typeof edge !== "object") {
          errors.push(`Edge at index ${idx} must be an object`);
        } else {
          const e = edge as Record<string, unknown>;
          if (!e.id || typeof e.id !== "string") {
            errors.push(`Edge at index ${idx} must have a string 'id' property`);
          }
          if (!e.source || typeof e.source !== "string") {
            errors.push(`Edge at index ${idx} must have a string 'source' property`);
          }
          if (!e.target || typeof e.target !== "string") {
            errors.push(`Edge at index ${idx} must have a string 'target' property`);
          }
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
