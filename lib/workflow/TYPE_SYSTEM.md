# Microsoft Agent Framework - Complete Type System

This document provides a comprehensive overview of the complete type system for the Microsoft Agent Framework workflows implementation, aligned with the [official Agent Framework documentation](https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/core-concepts/overview).

## Overview

The Agent Framework consists of four core layers:

1. **Executors** - Workflow execution units
2. **Edges** - Connections and routing between executors
3. **Workflows** - Orchestration of executors and edges
4. **Events** - Observability and lifecycle tracking

Additionally, the framework includes:
- **Messages** - Data flowing through workflows
- **Content** - Rich content types in messages
- **Agents** - AI agents that can be used in executors
- **Tools** - Callable functions and services

---

## 1. Base Types (`lib/workflow/types.ts`)

### Core Identifiers
\`\`\`typescript
type ExecutorId = string;
type EdgeId = string;
\`\`\`

### Base Executor
\`\`\`typescript
interface BaseExecutor {
  id: ExecutorId;
  type: string;
  label?: string;
  description?: string;
}
\`\`\`

### Base Edge
\`\`\`typescript
interface BaseEdge {
  id: EdgeId;
  source: ExecutorId;
  target: ExecutorId;
  condition?: EdgeCondition;
  metadata?: Record<string, unknown>;
}

type EdgeCondition = {
  type: "predicate" | "case";
  expression?: string;
  caseValue?: string;
};
\`\`\`

### Base Message
\`\`\`typescript
interface BaseMessage {
  id: string;
  type: string;
  role?: MessageRole;
  content?: unknown;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

type MessageRole = "system" | "user" | "assistant" | "tool";
\`\`\`

### Workflow Context
\`\`\`typescript
interface WorkflowContext<T extends BaseMessage = BaseMessage> {
  executorId: ExecutorId;
  messages: T[];
  sharedState?: SharedState;
  sendMessage: (target: ExecutorId, message: T) => void;
  yieldOutput: (output: unknown) => void;
  getState: <K extends keyof SharedState>(key: K) => SharedState[K] | undefined;
  setState: <K extends keyof SharedState>(key: K, value: SharedState[K]) => void;
}
\`\`\`

### Edge Groups
\`\`\`typescript
interface BaseEdgeGroup {
  id: string;
  type: EdgeGroupType;
  edges: BaseEdge[];
}

type EdgeGroupType = "single" | "fan-in" | "fan-out" | "switch-case";
\`\`\`

---

## 2. Executors (`lib/workflow/executors.ts`)

### Executor Types
\`\`\`typescript
// Base executor type
type Executor = BaseExecutor;

// Function executor - executes a function
interface FunctionExecutor extends BaseExecutor {
  type: "function-executor";
  functionName: string;
  parameters?: Record<string, unknown>;
  code?: string;
}

// Workflow executor - nests another workflow
interface WorkflowExecutor extends BaseExecutor {
  type: "workflow-executor";
  workflowId: string;
  inputMapping?: Record<string, unknown>;
  outputMapping?: Record<string, unknown>;
}

// Agent executor - wraps an agent
interface AgentExecutor extends BaseExecutor {
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

// Request info executor - gateway for external information
interface RequestInfoExecutor extends BaseExecutor {
  type: "request-info-executor";
  requestType: "user-input" | "system-prompt" | "external-api";
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

// Magentic agent executor
interface MagenticAgentExecutor extends BaseExecutor {
  type: "magentic-agent-executor";
  agentRole: string;
  capabilities?: string[];
  systemPrompt?: string;
  tools?: ToolReference[];
}

// Magentic orchestrator executor
interface MagenticOrchestratorExecutor extends BaseExecutor {
  type: "magentic-orchestrator-executor";
  workflowType: string;
}
\`\`\`

### Executor Union Type
\`\`\`typescript
type ExecutorType =
  | "executor"
  | "function-executor"
  | "workflow-executor"
  | "agent-executor"
  | "request-info-executor"
  | "magentic-agent-executor"
  | "magentic-orchestrator-executor";
\`\`\`

---

## 3. Edge Groups (`lib/workflow/edges.ts`)

### Single Edge Group
\`\`\`typescript
interface SingleEdgeGroup extends BaseEdgeGroup {
  type: "single";
  edge: BaseEdge;
}
\`\`\`

### Fan-In Edge Group
\`\`\`typescript
interface FanInEdgeGroup extends BaseEdgeGroup {
  type: "fan-in";
  sources: ExecutorId[];
  target: ExecutorId;
  edges: BaseEdge[];
  aggregationStrategy: "merge" | "concat" | "first" | "last";
  customAggregator?: string;
}
\`\`\`

### Fan-Out Edge Group
\`\`\`typescript
interface FanOutEdgeGroup extends BaseEdgeGroup {
  type: "fan-out";
  source: ExecutorId;
  targets: ExecutorId[];
  edges: BaseEdge[];
  broadcastMode: "parallel" | "sequential";
}
\`\`\`

### Switch-Case Edge Group
\`\`\`typescript
interface SwitchCaseEdgeGroup extends BaseEdgeGroup {
  type: "switch-case";
  source: ExecutorId;
  switchExpression: string;
  cases: Case[];
  default?: Default;
}

interface Case {
  id: string;
  value: string | number | boolean;
  target: ExecutorId;
  edge: BaseEdge;
}

interface Default {
  target: ExecutorId;
  edge: BaseEdge;
}
\`\`\`

### Edge Group Union
\`\`\`typescript
type EdgeGroup =
  | SingleEdgeGroup
  | FanInEdgeGroup
  | FanOutEdgeGroup
  | SwitchCaseEdgeGroup;
\`\`\`

---

## 4. Messages (`lib/workflow/messages.ts`)

### Chat Message
\`\`\`typescript
interface ChatMessage extends BaseMessage {
  type: "chat";
  role: MessageRole;
  content: string | ChatContent[];
}

type ChatContent = {
  type: "text" | "image" | "file";
  value: string;
  metadata?: Record<string, unknown>;
};
\`\`\`

### Request Info Message
\`\`\`typescript
interface RequestInfoMessage extends BaseMessage {
  type: "request-info";
  requestType: string;
  requestData: unknown;
  correlationId?: string;
}

interface RequestResponse<T = unknown> {
  correlationId: string;
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  timestamp: string;
}
\`\`\`

### Magentic Messages
\`\`\`typescript
interface MagenticRequestMessage extends BaseMessage {
  type: "magentic-request";
  action: string;
  parameters: Record<string, unknown>;
  workflowId?: string;
}

interface MagenticResponseMessage extends BaseMessage {
  type: "magentic-response";
  result: unknown;
  workflowId?: string;
  correlationId?: string;
}

interface MagenticStartMessage extends BaseMessage {
  type: "magentic-start";
  workflowType: string;
  initialData: unknown;
  parameters?: Record<string, unknown>;
}
\`\`\`

### Message Union
\`\`\`typescript
type WorkflowMessage =
  | ChatMessage
  | RequestInfoMessage
  | MagenticRequestMessage
  | MagenticResponseMessage
  | MagenticStartMessage
  | BaseMessage;
\`\`\`

---

## 5. Content (`lib/workflow/content.ts`)

### Content Types
\`\`\`typescript
interface BaseContent {
  type: string;
  metadata?: Record<string, unknown>;
}

interface TextContent extends BaseContent {
  type: "text";
  text: string;
}

interface TextReasoningContent extends BaseContent {
  type: "text-reasoning";
  text: string;
}

interface DataContent extends BaseContent {
  type: "data";
  data: string;
  mimeType: string;
}

interface UriContent extends BaseContent {
  type: "uri";
  uri: string;
  mimeType?: string;
}

interface ErrorContent extends BaseContent {
  type: "error";
  code: string;
  message: string;
  details?: unknown;
}

interface FunctionCallContent extends BaseContent {
  type: "function-call";
  functionName: string;
  arguments: Record<string, unknown>;
  callId: string;
}

interface FunctionResultContent extends BaseContent {
  type: "function-result";
  callId: string;
  result: unknown;
  isError?: boolean;
}

interface FunctionApprovalRequestContent extends BaseContent {
  type: "function-approval-request";
  callId: string;
  functionName: string;
  arguments: Record<string, unknown>;
}

interface FunctionApprovalResponseContent extends BaseContent {
  type: "function-approval-response";
  callId: string;
  approved: boolean;
  reason?: string;
}

interface HostedFileContent extends BaseContent {
  type: "hosted-file";
  fileId: string;
  fileName: string;
  mimeType?: string;
}

interface HostedVectorStoreContent extends BaseContent {
  type: "hosted-vector-store";
  storeId: string;
  query?: string;
}

interface UsageContent extends BaseContent {
  type: "usage";
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}
\`\`\`

### Content Union
\`\`\`typescript
type WorkflowContent =
  | TextContent
  | TextReasoningContent
  | DataContent
  | UriContent
  | ErrorContent
  | FunctionCallContent
  | FunctionResultContent
  | FunctionApprovalRequestContent
  | FunctionApprovalResponseContent
  | HostedFileContent
  | HostedVectorStoreContent
  | UsageContent;
\`\`\`

---

## 6. Events (`lib/workflow/events.ts`)

### Base Event
\`\`\`typescript
interface BaseEvent {
  id: string;
  type: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
\`\`\`

### Workflow Events
\`\`\`typescript
interface WorkflowStartedEvent extends BaseEvent {
  type: "workflow-started";
  workflowId: string;
  runId: string;
}

interface WorkflowFailedEvent extends BaseEvent {
  type: "workflow-failed";
  workflowId: string;
  runId: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface WorkflowOutputEvent extends BaseEvent {
  type: "workflow-output";
  workflowId: string;
  runId: string;
  output: unknown;
}

interface RequestInfoEvent extends BaseEvent {
  type: "request-info";
  executorId: ExecutorId;
  requestType: string;
  requestData: unknown;
  correlationId: string;
}
\`\`\`

### Executor Events
\`\`\`typescript
interface BaseExecutorEvent extends BaseEvent {
  executorId: ExecutorId;
  workflowId: string;
  runId: string;
}

interface ExecutorInvokedEvent extends BaseExecutorEvent {
  type: "executor-invoked";
  inputMessages: unknown[];
}

interface ExecutorCompletedEvent extends BaseExecutorEvent {
  type: "executor-completed";
  outputMessages: unknown[];
  duration?: number;
}

interface ExecutorFailedEvent extends BaseExecutorEvent {
  type: "executor-failed";
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
\`\`\`

### Agent Events
\`\`\`typescript
interface AgentRunEvent extends BaseEvent {
  type: "agent-run";
  agentId: string;
  runId: string;
  messages: unknown[];
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

interface AgentRunUpdateEvent extends BaseEvent {
  type: "agent-run-update";
  agentId: string;
  runId: string;
  delta: unknown;
  finished: boolean;
}

interface MagenticAgentMessageEvent extends BaseEvent {
  type: "magentic-agent-message";
  agentId: string;
  workflowId: string;
  message: unknown;
}

interface MagenticAgentDeltaEvent extends BaseEvent {
  type: "magentic-agent-delta";
  agentId: string;
  workflowId: string;
  delta: unknown;
}

interface MagenticOrchestratorMessageEvent extends BaseEvent {
  type: "magentic-orchestrator-message";
  workflowId: string;
  message: unknown;
}

interface MagenticFinalResultEvent extends BaseEvent {
  type: "magentic-final-result";
  workflowId: string;
  result: unknown;
}
\`\`\`

### Event Union
\`\`\`typescript
type WorkflowEvent =
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
\`\`\`

---

## 7. Agents (`lib/workflow/agent.ts`)

### Agent Protocol
\`\`\`typescript
interface AgentProtocol {
  id: string;
  name: string;
  run: (messages: unknown[], options?: AgentRunOptions) => Promise<AgentRunResponse>;
  stream?: (
    messages: unknown[],
    options?: AgentRunOptions
  ) => AsyncIterable<AgentRunResponseUpdate>;
}

interface AgentRunOptions {
  systemPrompt?: string;
  tools?: (ToolProtocol | AIFunction)[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  toolMode?: "auto" | "required" | "none";
  stream?: boolean;
  metadata?: Record<string, unknown>;
}
\`\`\`

### Base Agent
\`\`\`typescript
interface BaseAgent extends AgentProtocol {
  type?: "base-agent";
  contextProviders?: ContextProvider[];
  middleware?: AgentMiddleware[];
  thread?: AgentThread;
}
\`\`\`

### Chat Agent
\`\`\`typescript
interface ChatAgent extends Omit<BaseAgent, "type"> {
  type: "chat-agent";
  chatClient: ChatClientProtocol;
  systemPrompt?: string;
  tools?: (ToolProtocol | AIFunction)[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  toolMode?: "auto" | "required" | "none";
}

interface ChatClientProtocol {
  chat: (
    messages: ChatMessage[],
    options?: ChatOptions
  ) => Promise<ChatResponse>;
  stream?: (
    messages: ChatMessage[],
    options?: ChatOptions
  ) => AsyncIterable<ChatResponseUpdate>;
}
\`\`\`

### Workflow Agent
\`\`\`typescript
interface WorkflowAgent extends Omit<BaseAgent, "type"> {
  type: "workflow-agent";
  workflow: WorkflowDefinition;
  inputAdapter?: (messages: unknown[]) => unknown[];
  outputAdapter?: (output: unknown[]) => unknown[];
}
\`\`\`

### Agent Union
\`\`\`typescript
type WorkflowAgentType = BaseAgent | ChatAgent | WorkflowAgent;
\`\`\`

---

## 8. Tools (`lib/workflow/tools.ts`)

### Tool Protocol
\`\`\`typescript
interface ToolProtocol {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute: (parameters: Record<string, unknown>) => Promise<unknown> | unknown;
}

interface ToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  required?: boolean;
  enum?: (string | number)[];
  default?: unknown;
}
\`\`\`

### AI Function
\`\`\`typescript
interface AIFunction<TArgs = Record<string, unknown>, TReturn = unknown> {
  id: string;
  name: string;
  description: string;
  schema: JSONSchema;
  execute: (args: TArgs) => Promise<TReturn> | TReturn;
}

interface JSONSchema {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
}
\`\`\`

### Hosted Tools
\`\`\`typescript
interface HostedCodeInterpreterTool {
  id: string;
  type: "hosted-code-interpreter";
  name: string;
  description: string;
  language?: string;
  runtime?: string;
  timeout?: number;
}

interface HostedFileSearchTool {
  id: string;
  type: "hosted-file-search";
  name: string;
  description: string;
  searchOptions?: {
    maxResults?: number;
    includeMetadata?: boolean;
  };
}

interface HostedWebSearchTool {
  id: string;
  type: "hosted-web-search";
  name: string;
  description: string;
  searchOptions?: {
    maxResults?: number;
    timeRange?: "day" | "week" | "month" | "year" | "all";
  };
}

interface HostedMCPTool {
  id: string;
  type: "hosted-mcp-tool";
  name: string;
  description: string;
  mcpServerId: string;
  toolName: string;
  parameters?: Record<string, unknown>;
}
\`\`\`

### MCP Tools
\`\`\`typescript
interface MCPStdioTool {
  id: string;
  type: "mcp-stdio";
  name: string;
  description: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  toolName: string;
}

interface MCPStreamableHTTPTool {
  id: string;
  type: "mcp-streamable-http";
  name: string;
  description: string;
  url: string;
  headers?: Record<string, string>;
  toolName: string;
  timeout?: number;
}

interface MCPWebsocketTool {
  id: string;
  type: "mcp-websocket";
  name: string;
  description: string;
  url: string;
  protocol?: string;
  toolName: string;
  reconnectInterval?: number;
}
\`\`\`

### Tool Union
\`\`\`typescript
type WorkflowTool =
  | ToolProtocol
  | AIFunction
  | HostedCodeInterpreterTool
  | HostedFileSearchTool
  | HostedWebSearchTool
  | HostedMCPTool
  | MCPStdioTool
  | MCPStreamableHTTPTool
  | MCPWebsocketTool;
\`\`\`

---

## 9. Workflows (`lib/workflow/workflow.ts`)

### Workflow Definition
\`\`\`typescript
interface Workflow {
  id: string;
  name: string;
  description?: string;
  executors: BaseExecutor[];
  edges: BaseEdge[];
  edgeGroups?: EdgeGroup[];
  metadata?: WorkflowMetadata;
  state?: WorkflowState;
}

interface WorkflowMetadata {
  author?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  nodePositions?: Record<string, { x: number; y: number }>;
  [key: string]: unknown;
}

interface WorkflowState {
  status: "idle" | "running" | "completed" | "failed" | "paused";
  currentExecutors?: ExecutorId[];
  sharedState?: SharedState;
}
\`\`\`

### Workflow Builder
\`\`\`typescript
class WorkflowBuilder {
  workflow: Workflow;
  
  addExecutor(executor: BaseExecutor): this;
  addExecutors(executors: BaseExecutor[]): this;
  addEdge(source: ExecutorId, target: ExecutorId, condition?: EdgeCondition): this;
  setMetadata(metadata: WorkflowMetadata): this;
  build(): Workflow;
}
\`\`\`

---

## Type System Features

### Discriminated Unions
All major types use discriminated unions based on the `type` field, enabling:
- Type-safe narrowing with type guards
- Exhaustive pattern matching
- Compile-time type checking

### Type Guards
Helper functions throughout the system:
- `isChatMessage()`, `isFunctionExecutor()`, `isAgentEvent()`, etc.
- Enable runtime type checking and narrowing

### Generic Types
- `WorkflowContext<T extends BaseMessage>` - Generic message types
- `AIFunction<TArgs, TReturn>` - Typed function arguments and returns

### Extensibility
- All base types use optional metadata fields
- Union types allow extending with new variants
- Type system supports both runtime and compile-time safety

---

## References

- [Microsoft Agent Framework Documentation](https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/core-concepts/overview)
- [Agent Framework GitHub Repository](https://github.com/microsoft/agent-framework)
