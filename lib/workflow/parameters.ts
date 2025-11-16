import type { Workflow } from '@/lib/workflow/workflow';
import type { BaseExecutor } from '@/lib/workflow/types';

export type NodeParamSection = {
  id: string;
  type: string;
  label?: string;
  params: Record<string, unknown>;
  children: NodeParamSection[];
};

function isPrimitive(v: unknown) {
  return v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
}

function summarize(value: unknown): unknown {
  if (isPrimitive(value)) return value;
  if (Array.isArray(value)) {
    const simple = value.every(isPrimitive);
    return simple ? value : value.length;
  }
  return undefined;
}

function extractParams(executor: BaseExecutor): Record<string, unknown> {
  const keys = Object.keys(executor);
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (k === 'id' || k === 'type' || k === 'metadata') continue;
    const v = (executor as any)[k];
    const s = summarize(v);
    if (s !== undefined) out[k] = s;
  }
  return out;
}

export function extractWorkflowParameters(workflow: Workflow): NodeParamSection[] {
  const sections: NodeParamSection[] = [];
  for (const ex of workflow.executors as BaseExecutor[]) {
    const section: NodeParamSection = {
      id: ex.id,
      type: ex.type,
      label: ex.label,
      params: extractParams(ex),
      children: [],
    };
    const nested = (ex as any).workflowDefinition as Workflow | undefined;
    if (nested && Array.isArray(nested.executors)) {
      section.children = extractWorkflowParameters({
        id: nested.id,
        name: nested.name,
        executors: nested.executors as any,
        edges: nested.edges as any,
        metadata: nested.metadata as any,
        edgeGroups: nested.edgeGroups as any,
      });
    }
    sections.push(section);
  }
  return sections;
}
