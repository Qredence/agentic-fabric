import * as yaml from "js-yaml";
import type { Workflow } from "../workflow";
import type { BaseExecutor } from "../types";
import type { BaseEdge } from "../types";
import type { EdgeGroup } from "../edges";

/**
 * Serialized workflow format for export
 */
export interface SerializedWorkflow {
  id: string;
  name?: string;
  version?: string;
  description?: string;
  executors: SerializedExecutor[];
  edges: SerializedEdge[];
  edgeGroups?: SerializedEdgeGroup[];
  metadata?: Record<string, unknown>;
}

/**
 * Serialized executor
 */
export interface SerializedExecutor {
  id: string;
  type: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Serialized edge
 */
export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  condition?: {
    type: string;
    expression?: string;
    caseValue?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Serialized edge group
 */
export interface SerializedEdgeGroup {
  id: string;
  type: string;
  [key: string]: unknown;
}

/**
 * Serialize workflow to JSON
 */
export function serializeToJSON(workflow: Workflow, pretty: boolean = true): string {
  const serialized = workflowToSerialized(workflow);
  return pretty
    ? JSON.stringify(serialized, null, 2)
    : JSON.stringify(serialized);
}

/**
 * Serialize workflow to YAML
 */
export function serializeToYAML(workflow: Workflow): string {
  const serialized = workflowToSerialized(workflow);
  return yaml.dump(serialized, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });
}

/**
 * Deserialize workflow from JSON
 */
export function deserializeFromJSON(json: string): Workflow {
  const parsed = JSON.parse(json) as SerializedWorkflow;
  return serializedToWorkflow(parsed);
}

/**
 * Deserialize workflow from YAML
 */
export function deserializeFromYAML(yamlString: string): Workflow {
  const parsed = yaml.load(yamlString) as SerializedWorkflow;
  return serializedToWorkflow(parsed);
}

/**
 * Convert workflow to serialized format
 */
function workflowToSerialized(workflow: Workflow): SerializedWorkflow {
  return {
    id: workflow.id,
    name: workflow.name,
    version: workflow.version,
    description: workflow.description,
    executors: workflow.executors.map(executorToSerialized),
    edges: workflow.edges.map(edgeToSerialized),
    edgeGroups: workflow.edgeGroups?.map(edgeGroupToSerialized),
    metadata: workflow.metadata as Record<string, unknown> | undefined,
  };
}

/**
 * Convert serialized format to workflow
 */
function serializedToWorkflow(serialized: SerializedWorkflow): Workflow {
  return {
    id: serialized.id,
    name: serialized.name,
    version: serialized.version,
    description: serialized.description,
    executors: serialized.executors.map(serializedToExecutor),
    edges: serialized.edges.map(serializedToEdge),
    edgeGroups: serialized.edgeGroups?.map(serializedToEdgeGroup),
    metadata: serialized.metadata,
  };
}

/**
 * Convert executor to serialized format
 */
function executorToSerialized(executor: BaseExecutor): SerializedExecutor {
  const serialized: SerializedExecutor = {
    id: executor.id,
    type: executor.type,
  };

  if (executor.label) {
    serialized.label = executor.label;
  }
  if (executor.description) {
    serialized.description = executor.description;
  }

  // Copy all other properties
  Object.keys(executor).forEach((key) => {
    if (!["id", "type", "label", "description"].includes(key)) {
      serialized[key] = (executor as unknown as Record<string, unknown>)[key];
    }
  });

  return serialized;
}

/**
 * Convert serialized executor to executor
 */
function serializedToExecutor(serialized: SerializedExecutor): BaseExecutor {
  const { id, type, ...rest } = serialized;
  const executor = {
    id,
    type,
    ...rest,
  } as BaseExecutor;

  if (serialized.label) {
    executor.label = serialized.label;
  }
  if (serialized.description) {
    executor.description = serialized.description;
  }

  return executor;
}

/**
 * Convert edge to serialized format
 */
function edgeToSerialized(edge: BaseEdge): SerializedEdge {
  const serialized: SerializedEdge = {
    id: edge.id,
    source: edge.source,
    target: edge.target,
  };

  if (edge.condition) {
    if (edge.condition.type === "predicate") {
      serialized.condition = {
        type: edge.condition.type,
        expression: edge.condition.expression,
      };
    } else if (edge.condition.type === "case") {
      serialized.condition = {
        type: edge.condition.type,
        caseValue: edge.condition.caseValue,
      };
    }
  }

  if (edge.metadata) {
    serialized.metadata = edge.metadata;
  }

  return serialized;
}

/**
 * Convert serialized edge to edge
 */
function serializedToEdge(serialized: SerializedEdge): BaseEdge {
  const edge: BaseEdge = {
    id: serialized.id,
    source: serialized.source,
    target: serialized.target,
  };

  if (serialized.condition && (serialized.condition.type === "predicate" || serialized.condition.type === "case")) {
    if (serialized.condition.type === "predicate") {
      edge.condition = {
        type: "predicate" as const,
        expression: serialized.condition.expression,
      };
    } else {
      edge.condition = {
        type: "case" as const,
        caseValue: serialized.condition.caseValue,
      };
    }
  }

  if (serialized.metadata) {
    edge.metadata = serialized.metadata;
  }

  return edge;
}

/**
 * Convert edge group to serialized format
 */
function edgeGroupToSerialized(group: EdgeGroup): SerializedEdgeGroup {
  const { id, type, ...rest } = group;
  const serialized: SerializedEdgeGroup = {
    id,
    type,
    ...rest,
  };
  return serialized;
}

/**
 * Convert serialized edge group to edge group
 */
function serializedToEdgeGroup(serialized: SerializedEdgeGroup): EdgeGroup {
  // This is a simplified conversion - actual implementation would need
  // to handle each edge group type specifically
  return serialized as unknown as EdgeGroup;
}

/**
 * Download workflow as file
 */
export function downloadWorkflow(
  workflow: Workflow,
  format: "json" | "yaml",
  filename?: string
): void {
  const content =
    format === "json"
      ? serializeToJSON(workflow, true)
      : serializeToYAML(workflow);

  const blob = new Blob([content], {
    type: format === "json" ? "application/json" : "text/yaml",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${workflow.id || "workflow"}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
