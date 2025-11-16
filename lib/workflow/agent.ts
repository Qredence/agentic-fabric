import type { BaseExecutor, ExecutorId } from './types';
import type { WorkflowTool, ToolProtocol, AIFunction } from './tools';
import type { WorkflowDefinition } from './executors';

/**
 * Agent Protocol - protocol defining the interface all agents must implement
 */
export interface AgentProtocol {
  id: string;
  name: string;
  run: (messages: unknown[], options?: AgentRunOptions) => Promise<AgentRunResponse>;
  stream?: (
    messages: unknown[],
    options?: AgentRunOptions,
  ) => AsyncIterable<AgentRunResponseUpdate>;
}

/**
 * Agent run options
 */
export interface AgentRunOptions {
  systemPrompt?: string;
  tools?: (ToolProtocol | AIFunction)[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  toolMode?: 'auto' | 'required' | 'none';
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Agent run response
 */
export interface AgentRunResponse {
  messages: unknown[];
  usage?: UsageDetails;
  metadata?: Record<string, unknown>;
}

/**
 * Agent run response update (for streaming)
 */
export interface AgentRunResponseUpdate {
  delta: unknown;
  finished: boolean;
  usage?: UsageDetails;
}

/**
 * Usage details for agent requests/responses
 */
export interface UsageDetails {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

/**
 * Base Agent - base class providing core agent functionality
 */
export interface BaseAgent extends AgentProtocol {
  type?: 'base-agent';
  contextProviders?: ContextProvider[];
  middleware?: AgentMiddleware[];
  thread?: AgentThread;
}

/**
 * Context Provider - base class for components that enhance AI context management
 */
export interface ContextProvider {
  id: string;
  name: string;
  provide: (context: AgentContext) => Promise<Context> | Context;
}

/**
 * Agent Context - context for agent execution
 */
export interface AgentContext {
  messages: unknown[];
  metadata?: Record<string, unknown>;
}

/**
 * Context - contains additional context supplied by providers per invocation
 */
export interface Context {
  additionalContext?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Aggregate Context Provider - combines multiple context providers
 */
export interface AggregateContextProvider extends ContextProvider {
  providers: ContextProvider[];
}

/**
 * Agent Middleware - intercepts agent invocations before/after execution
 */
export interface AgentMiddleware {
  id: string;
  name: string;
  beforeRun?: (context: AgentRunContext) => Promise<AgentRunContext> | AgentRunContext;
  afterRun?: (
    context: AgentRunContext,
    response: AgentRunResponse,
  ) => Promise<AgentRunResponse> | AgentRunResponse;
}

/**
 * Agent Run Context - context for agent middleware pipeline
 */
export interface AgentRunContext {
  messages: unknown[];
  options?: AgentRunOptions;
  metadata?: Record<string, unknown>;
}

/**
 * Agent Thread - maintains conversation state and message history
 */
export interface AgentThread {
  id: string;
  messages: unknown[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chat Agent - primary agent implementation using chat clients for LLM interaction
 */
export interface ChatAgent extends Omit<BaseAgent, 'type'> {
  type: 'chat-agent';
  chatClient: ChatClientProtocol;
  systemPrompt?: string;
  tools?: (ToolProtocol | AIFunction)[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  toolMode?: 'auto' | 'required' | 'none';
}

/**
 * Chat Client Protocol - protocol for chat clients that generate responses
 */
export interface ChatClientProtocol {
  chat: (messages: ChatMessage[], options?: ChatOptions) => Promise<ChatResponse>;
  stream?: (messages: ChatMessage[], options?: ChatOptions) => AsyncIterable<ChatResponseUpdate>;
}

/**
 * Chat Message
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | ChatContent[];
  name?: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

/**
 * Chat Content
 */
export interface ChatContent {
  type: 'text' | 'image' | 'file';
  value: string;
}

/**
 * Tool Call
 */
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * Chat Response
 */
export interface ChatResponse {
  message: ChatMessage;
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  usage?: UsageDetails;
}

/**
 * Chat Response Update (for streaming)
 */
export interface ChatResponseUpdate {
  delta: string | ChatMessage;
  finished: boolean;
  usage?: UsageDetails;
}

/**
 * Chat Options - common request settings for AI services
 */
export interface ChatOptions {
  systemPrompt?: string;
  tools?: (ToolProtocol | AIFunction)[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  toolMode?: 'auto' | 'required' | 'none';
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Workflow Agent - wraps a workflow and exposes it as an agent
 */
export interface WorkflowAgent extends Omit<BaseAgent, 'type'> {
  type: 'workflow-agent';
  workflow: WorkflowDefinition;
  inputAdapter?: (messages: unknown[]) => unknown[];
  outputAdapter?: (output: unknown[]) => unknown[];
}

/**
 * Union type of all agent types
 */
export type WorkflowAgentType = BaseAgent | ChatAgent | WorkflowAgent;

/**
 * Type guard helpers
 */
export function isChatAgent(agent: AgentProtocol): agent is ChatAgent {
  return 'type' in agent && agent.type === 'chat-agent';
}

export function isWorkflowAgent(agent: AgentProtocol): agent is WorkflowAgent {
  return 'type' in agent && agent.type === 'workflow-agent';
}

export function isBaseAgent(agent: AgentProtocol): agent is BaseAgent {
  return 'type' in agent && agent.type === 'base-agent';
}

/**
 * Create executor from agent
 */
export function agentToExecutor(agent: AgentProtocol, executorId: string): BaseExecutor {
  return {
    id: executorId,
    type: 'agent-executor',
    label: 'name' in agent ? agent.name : executorId,
    description: `Agent executor: ${'name' in agent ? agent.name : executorId}`,
  };
}
