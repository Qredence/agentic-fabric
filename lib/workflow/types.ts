export type WorkflowNodeVariant = "workflow" | "textBlock" | "attribute";

export type WorkflowHandles = {
  target: boolean;
  source: boolean;
};

export type WorkflowStepNodeData = {
  variant: "workflow";
  handles: WorkflowHandles;
  label: string;
  description: string;
  content: string;
  footer: string;
};

export type TextBlockNodeData = {
  variant: "textBlock";
  handles: WorkflowHandles;
  title: string;
  model: string;
  placeholder: string;
  showSuggestions: boolean;
  collapsed: boolean;
};

export type AttributeType = "input" | "progress" | "checkbox" | "select" | "slider";

export type AttributeDefinition = {
  id: string;
  label: string;
  type: AttributeType;
  value?: unknown;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
};

export type AttributeNodeData = {
  variant: "attribute";
  handles: WorkflowHandles;
  title: string;
  model: string;
  attributes: AttributeDefinition[];
  collapsed: boolean;
};

export type WorkflowNodeData =
  | WorkflowStepNodeData
  | TextBlockNodeData
  | AttributeNodeData;

export const defaultHandles: WorkflowHandles = {
  target: true,
  source: true,
};

export const defaultWorkflowStepData = (
  overrides: Partial<Omit<WorkflowStepNodeData, "variant">> = {}
): WorkflowStepNodeData => ({
  variant: "workflow",
  handles: overrides.handles ?? defaultHandles,
  label: overrides.label ?? "New Step",
  description: overrides.description ?? "Customize this workflow step",
  content:
    overrides.content ??
    "Drag to reposition or connect to an existing node.",
  footer: overrides.footer ?? "Status: Draft",
});

export const defaultTextBlockData = (
  overrides: Partial<Omit<TextBlockNodeData, "variant">> = {}
): TextBlockNodeData => ({
  variant: "textBlock",
  handles: overrides.handles ?? defaultHandles,
  title: overrides.title ?? "Text",
  model: overrides.model ?? "GPT-5",
  placeholder:
    overrides.placeholder ??
    'Try "A script excerpt of a romantic meeting in Paris"',
  showSuggestions: overrides.showSuggestions ?? true,
  collapsed: overrides.collapsed ?? false,
});

export const defaultAttributeNodeData = (
  overrides: Partial<Omit<AttributeNodeData, "variant">> = {}
): AttributeNodeData => ({
  variant: "attribute",
  handles: overrides.handles ?? defaultHandles,
  title: overrides.title ?? "Attributes",
  model: overrides.model ?? "GPT-5",
  attributes: overrides.attributes ?? [],
  collapsed: overrides.collapsed ?? false,
});
