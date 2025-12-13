import { Node, Edge } from '@xyflow/react';

// ============================================================================
// Node Data Interfaces
// ============================================================================

export interface PhaseNodeData extends Record<string, unknown> {
  name: 'Analysis' | 'Routing' | 'Execution' | 'Progress' | 'Quality';
  executor: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  metrics?: {
    duration_ms: number;
    tokens_used: number;
  };
}

export interface AgentNodeData extends Record<string, unknown> {
  name: string;
  role: string;
  model: string;
  tools: string[];
  systemPrompt: string;
  status: 'idle' | 'active' | 'waiting';
  currentTask?: string;
}

export interface ToolNodeData extends Record<string, unknown> {
  name: string;
  category: 'search' | 'browser' | 'mcp' | 'code' | 'file';
  requiresApiKey: boolean;
  apiKeyEnvVar?: string;
  description: string;
}

export interface StrategyNodeData extends Record<string, unknown> {
  name: 'delegated' | 'sequential' | 'parallel' | 'handoff' | 'discussion';
  description: string;
  maxConcurrency?: number;
  participants?: string[];
}

export interface DSPyNodeData extends Record<string, unknown> {
  name: string;
  signatureFile: string;
  compiled: boolean;
  cachePath?: string;
  inputFields: string[];
  outputFields: string[];
}

export interface ConfigNodeData extends Record<string, unknown> {
  path: string;
  sections: string[];
}

export interface TaskNodeData extends Record<string, unknown> {
  content: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  assignedAgent?: string;
  phase: string;
  priority: 'low' | 'medium' | 'high';
}

// ============================================================================
// Node Types
// ============================================================================

export interface PhaseNode extends Node {
  id: string;
  type: 'phase';
  data: PhaseNodeData;
  position: { x: number; y: number };
}

export interface AgentNode extends Node {
  id: string;
  type: 'agent';
  data: AgentNodeData;
  position: { x: number; y: number };
}

export interface ToolNode extends Node {
  id: string;
  type: 'tool';
  data: ToolNodeData;
  position: { x: number; y: number };
}

export interface StrategyNode extends Node {
  id: string;
  type: 'strategy';
  data: StrategyNodeData;
  position: { x: number; y: number };
}

export interface DSPyNode extends Node {
  id: string;
  type: 'dspy_module';
  data: DSPyNodeData;
  position: { x: number; y: number };
}

export interface ConfigNode extends Node {
  id: string;
  type: 'config';
  data: ConfigNodeData;
  position: { x: number; y: number };
}

export interface TaskNode extends Node {
  id: string;
  type: 'task';
  data: TaskNodeData;
  position: { x: number; y: number };
}

export type AgenticFleetNode =
  | PhaseNode
  | AgentNode
  | ToolNode
  | StrategyNode
  | DSPyNode
  | ConfigNode
  | TaskNode;

// ============================================================================
// Edge Types
// ============================================================================

export interface FlowEdgeData extends Record<string, unknown> {
  messageCount?: number;
  latency_ms?: number;
}

export interface FlowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type: 'phase_flow' | 'agent_tool' | 'delegation' | 'data_flow' | 'config_link';
  animated?: boolean;
  label?: string;
  data?: FlowEdgeData;
}

export type AgenticFleetEdge = FlowEdge;
