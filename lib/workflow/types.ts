export type WorkflowNodeVariant = "workflow" | "textBlock" | "attribute";

// ============================================================================
// Agent Framework Base Types
// ============================================================================

/**
 * Unique identifier for an executor in a workflow
 */
export type ExecutorId = string;

/**
 * Unique identifier for an edge in a workflow
 */
export type EdgeId = string;

/**
 * Base executor interface - all workflow executors extend this
 */
export interface BaseExecutor {
  id: ExecutorId;
  type: string;
  label?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  acl?: Acl;
  status?: StatusFlag;
}

/**
 * Base edge interface - defines connections between executors
 */
export interface BaseEdge {
  id: EdgeId;
  source: ExecutorId;
  target: ExecutorId;
  condition?: EdgeCondition;
  metadata?: Record<string, unknown>;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  acl?: Acl;
  status?: StatusFlag;
}

/**
 * Edge condition for conditional routing
 */
export type EdgeCondition = {
  type: "predicate" | "case";
  expression?: string; // For predicate-based conditions
  caseValue?: string; // For switch-case conditions
};

/**
 * Base message type - messages flow between executors
 */
export interface BaseMessage {
  id: string;
  type: string;
  role?: MessageRole;
  content?: unknown;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Message role in conversation
 */
export type MessageRole = "system" | "user" | "assistant" | "tool";

/**
 * Workflow context - provides execution context for executors
 * Generic type T represents the message type flowing through the workflow
 */
export interface WorkflowContext<T extends BaseMessage = BaseMessage> {
  executorId: ExecutorId;
  messages: T[];
  sharedState?: SharedState;
  sendMessage: (target: ExecutorId, message: T) => void;
  yieldOutput: (output: unknown) => void;
  getState: <K extends keyof SharedState>(key: K) => SharedState[K] | undefined;
  setState: <K extends keyof SharedState>(key: K, value: SharedState[K]) => void;
}

/**
 * Shared state across workflow executors
 */
export type SharedState = Record<string, unknown>;

/**
 * Base edge group interface - groups of edges with routing logic
 */
export interface BaseEdgeGroup {
  id: string;
  type: EdgeGroupType;
  edges: BaseEdge[];
}

/**
 * Edge group types
 */
export type EdgeGroupType =
  | "single"
  | "fan-in"
  | "fan-out"
  | "switch-case";

export type StatusFlag = "draft" | "active" | "disabled" | "deprecated";

export interface Acl {
  owner: string;
  read?: string[];
  write?: string[];
  roles?: string[];
}

/**
 * Finish reason for chat responses
 */
export type FinishReason =
  | "stop"
  | "length"
  | "tool_calls"
  | "content_filter"
  | "function_call";

/**
 * Tool mode for agent execution
 */
export type ToolMode = "auto" | "required" | "none";

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
