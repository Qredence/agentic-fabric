import type { Workflow } from "@/lib/workflow/workflow"
import type { BaseExecutor } from "@/lib/workflow/types"

export function serializeTopology(workflow: Workflow): Workflow {
  return {
    id: workflow.id,
    name: workflow.name,
    executors: workflow.executors.map((e) => ({ id: e.id, type: (e as BaseExecutor).type, label: e.label } as BaseExecutor)),
    edges: workflow.edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target })),
    metadata: workflow.metadata,
    edgeGroups: workflow.edgeGroups,
  }
}