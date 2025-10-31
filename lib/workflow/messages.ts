import type { BaseMessage, MessageRole } from "./types";

/**
 * Chat message - standard conversation message
 */
export interface ChatMessage extends BaseMessage {
  type: "chat";
  role: MessageRole;
  content: string | ChatContent[];
}

/**
 * Chat content items (can be text, images, etc.)
 */
export type ChatContent = {
  type: "text" | "image" | "file";
  value: string;
  metadata?: Record<string, unknown>;
};

/**
 * Request info message - base for request/response pattern
 */
export interface RequestInfoMessage extends BaseMessage {
  type: "request-info";
  requestType: string;
  requestData: unknown;
  correlationId?: string;
}

/**
 * Request response - correlates with original request
 */
export interface RequestResponse<T = unknown> {
  correlationId: string;
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  timestamp: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Magentic request message - for Magentic One workflows
 */
export interface MagenticRequestMessage extends BaseMessage {
  type: "magentic-request";
  action: string;
  parameters: Record<string, unknown>;
  workflowId?: string;
}

/**
 * Magentic response message - response in Magentic workflows
 */
export interface MagenticResponseMessage extends BaseMessage {
  type: "magentic-response";
  result: unknown;
  workflowId?: string;
  correlationId?: string;
}

/**
 * Magentic start message - initiates a Magentic workflow
 */
export interface MagenticStartMessage extends BaseMessage {
  type: "magentic-start";
  workflowType: string;
  initialData: unknown;
  parameters?: Record<string, unknown>;
}

/**
 * Union type of all message types
 */
export type WorkflowMessage =
  | ChatMessage
  | RequestInfoMessage
  | MagenticRequestMessage
  | MagenticResponseMessage
  | MagenticStartMessage
  | BaseMessage;

/**
 * Type guard for chat messages
 */
export function isChatMessage(message: BaseMessage): message is ChatMessage {
  return message.type === "chat";
}

/**
 * Type guard for request info messages
 */
export function isRequestInfoMessage(
  message: BaseMessage
): message is RequestInfoMessage {
  return message.type === "request-info";
}

/**
 * Type guard for Magentic messages
 */
export function isMagenticMessage(
  message: BaseMessage
): message is MagenticRequestMessage | MagenticResponseMessage | MagenticStartMessage {
  return (
    message.type === "magentic-request" ||
    message.type === "magentic-response" ||
    message.type === "magentic-start"
  );
}

