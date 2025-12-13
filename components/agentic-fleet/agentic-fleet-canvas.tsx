'use client';

import React, { useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AgenticFleetNode, AgenticFleetEdge } from '@/lib/agentic-fleet/types';
import { getLayoutedElements } from '@/lib/agentic-fleet/layout';

import { ConfigNode } from './nodes/config-node';
import { DSPyNode } from './nodes/dspy-node';
import { PhaseNode } from './nodes/phase-node';
import { StrategyNode } from './nodes/strategy-node';
import { AgentNode } from './nodes/agent-node';
import { ToolNode } from './nodes/tool-node';
import { TaskNode } from './nodes/task-node';

const nodeTypes = {
  config: ConfigNode,
  dspy_module: DSPyNode,
  phase: PhaseNode,
  strategy: StrategyNode,
  agent: AgentNode,
  tool: ToolNode,
  task: TaskNode,
};

const initialNodesData: AgenticFleetNode[] = [
  // Tier 1: Config
  {
    id: 'config-1',
    type: 'config',
    position: { x: 0, y: 0 },
    data: {
      path: 'src/agentic_fleet/config/workflow_config.yaml',
      sections: ['models', 'agents', 'tools', 'thresholds', 'workflow'],
    },
  },
  // Tier 2: DSPy Modules
  {
    id: 'dspy-1',
    type: 'dspy_module',
    position: { x: 0, y: 0 },
    data: {
      name: 'SupervisorSignature',
      signatureFile: 'signatures.py',
      compiled: true,
      inputFields: ['task', 'context'],
      outputFields: ['plan', 'delegation'],
    },
  },
  {
    id: 'dspy-2',
    type: 'dspy_module',
    position: { x: 0, y: 0 },
    data: {
      name: 'TaskAnalysis',
      signatureFile: 'reasoner.py',
      compiled: false,
      inputFields: ['query'],
      outputFields: ['complexity', 'requirements'],
    },
  },
  {
    id: 'dspy-3',
    type: 'dspy_module',
    position: { x: 0, y: 0 },
    data: {
      name: 'CompiledModule',
      signatureFile: 'compiled.py',
      compiled: true,
      cachePath: 'var/logs/compiled_supervisor.pkl',
      inputFields: ['history'],
      outputFields: ['action'],
    },
  },
  // Tier 3: Pipeline Phases
  {
    id: 'phase-1',
    type: 'phase',
    position: { x: 0, y: 0 },
    data: { name: 'Analysis', executor: 'AnalysisExecutor', status: 'completed', metrics: { duration_ms: 120, tokens_used: 450 } },
  },
  {
    id: 'phase-2',
    type: 'phase',
    position: { x: 0, y: 0 },
    data: { name: 'Routing', executor: 'RoutingExecutor', status: 'completed', metrics: { duration_ms: 80, tokens_used: 120 } },
  },
  {
    id: 'phase-3',
    type: 'phase',
    position: { x: 0, y: 0 },
    data: { name: 'Execution', executor: 'ExecutionExecutor', status: 'running', metrics: { duration_ms: 2500, tokens_used: 1500 } },
  },
  {
    id: 'phase-4',
    type: 'phase',
    position: { x: 0, y: 0 },
    data: { name: 'Progress', executor: 'ProgressExecutor', status: 'pending' },
  },
  {
    id: 'phase-5',
    type: 'phase',
    position: { x: 0, y: 0 },
    data: { name: 'Quality', executor: 'QualityExecutor', status: 'pending' },
  },
  // Tier 4: Strategies
  {
    id: 'strat-1',
    type: 'strategy',
    position: { x: 0, y: 0 },
    data: { name: 'delegated', description: 'Delegates subtasks to specialized agents', participants: ['coordinator', 'researcher'] },
  },
  {
    id: 'strat-2',
    type: 'strategy',
    position: { x: 0, y: 0 },
    data: { name: 'parallel', description: 'Executes independent tasks concurrently', maxConcurrency: 5 },
  },
  {
    id: 'strat-3',
    type: 'strategy',
    position: { x: 0, y: 0 },
    data: { name: 'handoff', description: 'Sequential processing with context passing' },
  },
  // Tier 5: Agents
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 0, y: 0 },
    data: { name: 'Coordinator', role: 'Orchestrates the workflow', model: 'gpt-4o', tools: [], systemPrompt: 'prompts.coordinator', status: 'active', currentTask: 'Assigning tasks to researchers' },
  },
  {
    id: 'agent-2',
    type: 'agent',
    position: { x: 0, y: 0 },
    data: { name: 'Researcher', role: 'Gathers information', model: 'gpt-4o-mini', tools: ['tavily_search', 'browser'], systemPrompt: 'prompts.researcher', status: 'active', currentTask: 'Searching for recent news' },
  },
  {
    id: 'agent-3',
    type: 'agent',
    position: { x: 0, y: 0 },
    data: { name: 'Coder', role: 'Writes and executes code', model: 'claude-3-5-sonnet', tools: ['code_interpreter'], systemPrompt: 'prompts.coder', status: 'idle' },
  },
  {
    id: 'agent-4',
    type: 'agent',
    position: { x: 0, y: 0 },
    data: { name: 'Reviewer', role: 'Validates output', model: 'gpt-4o', tools: [], systemPrompt: 'prompts.reviewer', status: 'waiting' },
  },
  // Tier 6: Tools
  {
    id: 'tool-1',
    type: 'tool',
    position: { x: 0, y: 0 },
    data: { name: 'tavily_search', category: 'search', requiresApiKey: true, apiKeyEnvVar: 'TAVILY_API_KEY', description: 'Search the web for up-to-date information' },
  },
  {
    id: 'tool-2',
    type: 'tool',
    position: { x: 0, y: 0 },
    data: { name: 'browser', category: 'browser', requiresApiKey: false, description: 'Headless browser for scraping' },
  },
  {
    id: 'tool-3',
    type: 'tool',
    position: { x: 0, y: 0 },
    data: { name: 'code_interpreter', category: 'code', requiresApiKey: false, description: 'Python execution sandbox' },
  },
  // Extra: Task Node
  {
    id: 'task-1',
    type: 'task',
    position: { x: 0, y: 0 },
    data: { content: 'Research the impact of AI on software engineering jobs in 2025', status: 'processing', priority: 'high', phase: 'Execution', assignedAgent: 'Researcher' },
  },
];

const initialEdgesData: AgenticFleetEdge[] = [
  // Config -> DSPy
  { id: 'e1', source: 'config-1', target: 'dspy-1', type: 'config_link' },
  { id: 'e2', source: 'config-1', target: 'dspy-2', type: 'config_link' },
  { id: 'e3', source: 'config-1', target: 'dspy-3', type: 'config_link' },
  // DSPy -> Phases
  { id: 'e4', source: 'dspy-1', target: 'phase-1', type: 'data_flow' },
  { id: 'e5', source: 'dspy-2', target: 'phase-1', type: 'data_flow' },
  { id: 'e6', source: 'dspy-3', target: 'phase-1', type: 'data_flow' },
  // Phases Sequence
  { id: 'e7', source: 'phase-1', target: 'phase-2', type: 'phase_flow', animated: true },
  { id: 'e8', source: 'phase-2', target: 'phase-3', type: 'phase_flow', animated: true },
  { id: 'e9', source: 'phase-3', target: 'phase-4', type: 'phase_flow' },
  { id: 'e10', source: 'phase-4', target: 'phase-5', type: 'phase_flow' },
  // Routing -> Strategies
  { id: 'e11', source: 'phase-2', target: 'strat-1', type: 'delegation' },
  { id: 'e12', source: 'phase-2', target: 'strat-2', type: 'delegation' },
  { id: 'e13', source: 'phase-2', target: 'strat-3', type: 'delegation' },
  // Strategies -> Agents
  { id: 'e14', source: 'strat-1', target: 'agent-1', type: 'delegation' },
  { id: 'e15', source: 'strat-1', target: 'agent-4', type: 'delegation' },
  { id: 'e16', source: 'strat-2', target: 'agent-2', type: 'delegation', animated: true },
  { id: 'e17', source: 'strat-2', target: 'agent-3', type: 'delegation' },
  { id: 'e18', source: 'strat-3', target: 'agent-1', type: 'delegation' },
  // Agents -> Tools
  { id: 'e19', source: 'agent-2', target: 'tool-1', type: 'agent_tool' },
  { id: 'e20', source: 'agent-2', target: 'tool-2', type: 'agent_tool' },
  { id: 'e21', source: 'agent-3', target: 'tool-3', type: 'agent_tool' },
];

export const AgenticFleetCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AgenticFleetNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AgenticFleetEdge>([]);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodesData,
      initialEdgesData
    );
    // Cast to any to avoid strict type check issues with ReactFlow's generic constraints
    setNodes(layoutedNodes as any);
    setEdges(layoutedEdges);
  }, [setNodes, setEdges]);

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: 'straight',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: '#64748b' },
        }}
      >
        <Background color="#94a3b8" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default AgenticFleetCanvas;
