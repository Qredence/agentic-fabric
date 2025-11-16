/**
 * Tool protocol - interface all tools must implement
 */
export interface ToolProtocol {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute: (parameters: Record<string, unknown>) => Promise<unknown> | unknown;
}

/**
 * Tool parameter definition
 */
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  required?: boolean;
  enum?: (string | number)[];
  default?: unknown;
}

/**
 * AI Function - wraps Python/TypeScript functions for AI models with automatic parameter validation
 */
export interface AIFunction<TArgs = Record<string, unknown>, TReturn = unknown> {
  id: string;
  name: string;
  description: string;
  schema: JSONSchema;
  execute: (args: TArgs) => Promise<TReturn> | TReturn;
}

/**
 * JSON Schema for function parameters
 */
export interface JSONSchema {
  type: 'object';
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
}

/**
 * JSON Schema property
 */
export interface JSONSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  enum?: (string | number)[];
  items?: JSONSchemaProperty; // For array types
  properties?: Record<string, JSONSchemaProperty>; // For object types
  default?: unknown;
}

// ============================================================================
// Hosted/Service Tools
// ============================================================================

/**
 * Hosted Code Interpreter Tool - marker for services that can execute generated code
 */
export interface HostedCodeInterpreterTool {
  id: string;
  type: 'hosted-code-interpreter';
  name: string;
  description: string;
  language?: string;
  runtime?: string;
  timeout?: number;
}

/**
 * Hosted File Search Tool - enables file search capabilities
 */
export interface HostedFileSearchTool {
  id: string;
  type: 'hosted-file-search';
  name: string;
  description: string;
  searchOptions?: {
    maxResults?: number;
    includeMetadata?: boolean;
  };
}

/**
 * Hosted Web Search Tool - enables web search capabilities
 */
export interface HostedWebSearchTool {
  id: string;
  type: 'hosted-web-search';
  name: string;
  description: string;
  searchOptions?: {
    maxResults?: number;
    timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  };
}

/**
 * Hosted MCP Tool - MCP tool managed and executed by the service
 */
export interface HostedMCPTool {
  id: string;
  type: 'hosted-mcp-tool';
  name: string;
  description: string;
  mcpServerId: string;
  toolName: string;
  parameters?: Record<string, unknown>;
}

// ============================================================================
// MCP Tools (Client-Side)
// ============================================================================

/**
 * MCP Stdio Tool - connects to stdio-based MCP servers
 */
export interface MCPStdioTool {
  id: string;
  type: 'mcp-stdio';
  name: string;
  description: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  toolName: string;
}

/**
 * MCP Streamable HTTP Tool - connects to HTTP/SSE-based MCP servers
 */
export interface MCPStreamableHTTPTool {
  id: string;
  type: 'mcp-streamable-http';
  name: string;
  description: string;
  url: string;
  headers?: Record<string, string>;
  toolName: string;
  timeout?: number;
}

/**
 * MCP WebSocket Tool - connects to WebSocket-based MCP servers
 */
export interface MCPWebsocketTool {
  id: string;
  type: 'mcp-websocket';
  name: string;
  description: string;
  url: string;
  protocol?: string;
  toolName: string;
  reconnectInterval?: number;
}

/**
 * Union type of all tool types
 */
export type WorkflowTool =
  | ToolProtocol
  | AIFunction
  | HostedCodeInterpreterTool
  | HostedFileSearchTool
  | HostedWebSearchTool
  | HostedMCPTool
  | MCPStdioTool
  | MCPStreamableHTTPTool
  | MCPWebsocketTool;

/**
 * Tool type discriminator
 */
export type ToolType =
  | 'protocol'
  | 'ai-function'
  | 'hosted-code-interpreter'
  | 'hosted-file-search'
  | 'hosted-web-search'
  | 'hosted-mcp-tool'
  | 'mcp-stdio'
  | 'mcp-streamable-http'
  | 'mcp-websocket';

/**
 * Type guard helpers
 */
export function isAIFunction(tool: WorkflowTool): tool is AIFunction {
  return 'schema' in tool && 'execute' in tool;
}

export function isHostedTool(
  tool: WorkflowTool,
): tool is HostedCodeInterpreterTool | HostedFileSearchTool | HostedWebSearchTool | HostedMCPTool {
  return (
    'type' in tool &&
    (tool.type === 'hosted-code-interpreter' ||
      tool.type === 'hosted-file-search' ||
      tool.type === 'hosted-web-search' ||
      tool.type === 'hosted-mcp-tool')
  );
}

export function isMCPTool(
  tool: WorkflowTool,
): tool is MCPStdioTool | MCPStreamableHTTPTool | MCPWebsocketTool {
  return (
    'type' in tool &&
    (tool.type === 'mcp-stdio' ||
      tool.type === 'mcp-streamable-http' ||
      tool.type === 'mcp-websocket')
  );
}

/**
 * Get tool type label
 */
export function getToolTypeLabel(tool: WorkflowTool): string {
  if ('type' in tool) {
    const labels: Record<string, string> = {
      'hosted-code-interpreter': 'Code Interpreter',
      'hosted-file-search': 'File Search',
      'hosted-web-search': 'Web Search',
      'hosted-mcp-tool': 'MCP Tool (Hosted)',
      'mcp-stdio': 'MCP Tool (Stdio)',
      'mcp-streamable-http': 'MCP Tool (HTTP)',
      'mcp-websocket': 'MCP Tool (WebSocket)',
    };
    return labels[tool.type] || tool.type;
  }
  if (isAIFunction(tool)) {
    return 'AI Function';
  }
  return 'Tool Protocol';
}
