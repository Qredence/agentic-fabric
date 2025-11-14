/**
 * Base content interface - all AI content types extend this
 */
export interface BaseContent {
  type: string;
  metadata?: Record<string, unknown>;
}

/**
 * Text content - plain text in chat
 */
export interface TextContent extends BaseContent {
  type: "text";
  text: string;
}

/**
 * Text reasoning content - distinct reasoning text
 */
export interface TextReasoningContent extends BaseContent {
  type: "text-reasoning";
  text: string;
}

/**
 * Data content - binary data with MIME type (data URIs)
 */
export interface DataContent extends BaseContent {
  type: "data";
  data: string; // Base64 or data URI
  mimeType: string;
}

/**
 * URI content - content identified by URI (images, files)
 */
export interface UriContent extends BaseContent {
  type: "uri";
  uri: string;
  mimeType?: string;
}

/**
 * Error content - error representations
 */
export interface ErrorContent extends BaseContent {
  type: "error";
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Function call content - function call requests
 */
export interface FunctionCallContent extends BaseContent {
  type: "function-call";
  functionName: string;
  arguments: Record<string, unknown>;
  callId: string;
}

/**
 * Function result content - function call results
 */
export interface FunctionResultContent extends BaseContent {
  type: "function-result";
  callId: string;
  result: unknown;
  isError?: boolean;
}

/**
 * Function approval request content - user approval request
 */
export interface FunctionApprovalRequestContent extends BaseContent {
  type: "function-approval-request";
  callId: string;
  functionName: string;
  arguments: Record<string, unknown>;
}

/**
 * Function approval response content - user approval response
 */
export interface FunctionApprovalResponseContent extends BaseContent {
  type: "function-approval-response";
  callId: string;
  approved: boolean;
  reason?: string;
}

/**
 * Hosted file content - hosted file references
 */
export interface HostedFileContent extends BaseContent {
  type: "hosted-file";
  fileId: string;
  fileName: string;
  mimeType?: string;
}

/**
 * Hosted vector store content - hosted vector store references
 */
export interface HostedVectorStoreContent extends BaseContent {
  type: "hosted-vector-store";
  storeId: string;
  query?: string;
}

/**
 * Usage content - usage information for requests/responses
 */
export interface UsageContent extends BaseContent {
  type: "usage";
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

/**
 * Union type of all content types
 */
export type WorkflowContent =
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

/**
 * Type guard helpers
 */
export function isTextContent(content: BaseContent): content is TextContent {
  return content.type === "text";
}

export function isFunctionCallContent(
  content: BaseContent
): content is FunctionCallContent {
  return content.type === "function-call";
}

export function isErrorContent(content: BaseContent): content is ErrorContent {
  return content.type === "error";
}
