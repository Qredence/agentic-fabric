import type { BaseEdge, EdgeId, ExecutorId, EdgeGroupType } from "./types";

/**
 * Single Edge Group - convenience wrapper for a one-to-one edge connection
 */
export interface SingleEdgeGroup {
  id: string;
  type: "single";
  edge: BaseEdge;
}

/**
 * Fan-In Edge Group - converging edges where multiple sources feed into a single downstream executor
 */
export interface FanInEdgeGroup {
  id: string;
  type: "fan-in";
  sources: ExecutorId[];
  target: ExecutorId;
  edges: BaseEdge[];
  aggregationStrategy?: "merge" | "first" | "all" | "custom";
  customAggregator?: string;
}

/**
 * Fan-Out Edge Group - broadcast-style routing where one source sends to multiple targets
 */
export interface FanOutEdgeGroup {
  id: string;
  type: "fan-out";
  source: ExecutorId;
  targets: ExecutorId[];
  edges: BaseEdge[];
  broadcastMode?: "parallel" | "sequential" | "condition-based";
}

/**
 * Switch Case Edge Group - switch/case control flow routing for conditional message dispatch
 */
export interface SwitchCaseEdgeGroup {
  id: string;
  type: "switch-case";
  source: ExecutorId;
  cases: Case[];
  default?: DefaultCase;
  switchExpression: string; // Expression to evaluate for switching
}

/**
 * Case - runtime wrapper for switch-case predicates with routing targets
 */
export interface Case {
  id: string;
  value: string | number | boolean;
  target: ExecutorId;
  condition?: string; // Optional additional condition
  edge: BaseEdge;
}

/**
 * Default - default branch for switch-case groups when no cases match
 */
export interface DefaultCase {
  target: ExecutorId;
  edge: BaseEdge;
}

/**
 * Union type of all edge groups
 */
export type EdgeGroup = SingleEdgeGroup | FanInEdgeGroup | FanOutEdgeGroup | SwitchCaseEdgeGroup;

/**
 * Edge configuration with metadata
 */
export interface EdgeConfiguration {
  id: EdgeId;
  source: ExecutorId;
  target: ExecutorId;
  condition?: EdgeCondition;
  label?: string;
  style?: EdgeStyle;
  metadata?: Record<string, unknown>;
}

/**
 * Edge condition for conditional routing
 */
export interface EdgeCondition {
  type: "predicate" | "case" | "always";
  expression?: string; // For predicate-based conditions (e.g., "message.type === 'error'")
  caseValue?: string; // For switch-case conditions
  operator?: "equals" | "not-equals" | "contains" | "greater-than" | "less-than";
  value?: unknown;
}

/**
 * Edge visual style
 */
export interface EdgeStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  animated?: boolean;
  labelStyle?: {
    fill?: string;
    fontSize?: number;
    fontWeight?: string;
  };
}

/**
 * Type guard helpers
 */
export function isSingleEdgeGroup(group: EdgeGroup): group is SingleEdgeGroup {
  return group.type === "single";
}

export function isFanInEdgeGroup(group: EdgeGroup): group is FanInEdgeGroup {
  return group.type === "fan-in";
}

export function isFanOutEdgeGroup(group: EdgeGroup): group is FanOutEdgeGroup {
  return group.type === "fan-out";
}

export function isSwitchCaseEdgeGroup(
  group: EdgeGroup
): group is SwitchCaseEdgeGroup {
  return group.type === "switch-case";
}

/**
 * Get edge group type label
 */
export function getEdgeGroupTypeLabel(type: EdgeGroupType): string {
  const labels: Record<EdgeGroupType, string> = {
    single: "Single Edge",
    "fan-in": "Fan-In (Multiple Sources)",
    "fan-out": "Fan-Out (Multiple Targets)",
    "switch-case": "Switch/Case Routing",
  };
  return labels[type] || type;
}

/**
 * Get edge group type description
 */
export function getEdgeGroupTypeDescription(type: EdgeGroupType): string {
  const descriptions: Record<EdgeGroupType, string> = {
    single: "One-to-one connection between executors",
    "fan-in": "Multiple sources converge into one target",
    "fan-out": "One source broadcasts to multiple targets",
    "switch-case": "Conditional routing based on expression value",
  };
  return descriptions[type] || "";
}

/**
 * Create a single edge group from a base edge
 */
export function createSingleEdgeGroup(edge: BaseEdge): SingleEdgeGroup {
  return {
    id: `edge-group-${edge.id}`,
    type: "single",
    edge,
  };
}

/**
 * Create a fan-in edge group
 */
export function createFanInEdgeGroup(
  sources: ExecutorId[],
  target: ExecutorId,
  edges: BaseEdge[],
  aggregationStrategy: "merge" | "first" | "all" = "merge"
): FanInEdgeGroup {
  return {
    id: `fan-in-${Date.now()}`,
    type: "fan-in",
    sources,
    target,
    edges,
    aggregationStrategy,
  };
}

/**
 * Create a fan-out edge group
 */
export function createFanOutEdgeGroup(
  source: ExecutorId,
  targets: ExecutorId[],
  edges: BaseEdge[],
  broadcastMode: "parallel" | "sequential" = "parallel"
): FanOutEdgeGroup {
  return {
    id: `fan-out-${Date.now()}`,
    type: "fan-out",
    source,
    targets,
    edges,
    broadcastMode,
  };
}

/**
 * Create a switch-case edge group
 */
export function createSwitchCaseEdgeGroup(
  source: ExecutorId,
  switchExpression: string,
  cases: Case[],
  defaultCase?: DefaultCase
): SwitchCaseEdgeGroup {
  return {
    id: `switch-case-${Date.now()}`,
    type: "switch-case",
    source,
    switchExpression,
    cases,
    default: defaultCase,
  };
}

