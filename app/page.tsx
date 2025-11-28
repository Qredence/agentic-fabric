'use client';

import React, {
  memo,
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
  type DragEvent,
} from 'react';
import {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node as ReactFlowNode,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react';
import { Canvas } from '@/components/ai-elements/canvas';
import { Connection as ConnectionLine } from '@/components/ai-elements/connection';
import { TemporaryEdge, AnimatedEdge } from '@/components/ai-elements/edge';
import { EdgeNodeDropdown } from '@/components/workflow-builder/edge-node-dropdown';
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from '@/components/ai-elements/node';
import { Toolbar } from '@/components/ai-elements/toolbar';
import { TextBlockCard } from '@/components/ai-elements/text-block-card';
import { AttributeNode } from '@/components/ai-elements/attribute-node';
import { Action, Actions } from '@/components/ai-elements/actions';
import { nanoid } from 'nanoid';
import { validateWorkflowExtended } from '@/lib/workflow/export/validator';
import { downloadWorkflow } from '@/lib/workflow/export/serializers';
import { toast } from '@/hooks/use-toast';

// Import executor node components
import { ExecutorNode } from '@/components/ai-elements/executors/executor-node';
import { FunctionExecutorNode } from '@/components/ai-elements/executors/function-executor-node';
import { AgentExecutorNode } from '@/components/ai-elements/executors/agent-executor-node';
import { WorkflowExecutorNode } from '@/components/ai-elements/executors/workflow-executor-node';
import { RequestInfoExecutorNode } from '@/components/ai-elements/executors/request-info-executor-node';

// Import edge group components
import { FanInNode } from '@/components/ai-elements/edge-groups/fan-in-node';
import type { FanInNodeData } from '@/components/ai-elements/edge-groups/fan-in-node';
import { FanOutNode } from '@/components/ai-elements/edge-groups/fan-out-node';
import type { FanOutNodeData } from '@/components/ai-elements/edge-groups/fan-out-node';
import { SwitchCaseNode } from '@/components/ai-elements/edge-groups/switch-case-node';
import type { SwitchCaseNodeData } from '@/components/ai-elements/edge-groups/switch-case-node';

// Import workflow builder components
import dynamic from 'next/dynamic';
const NodeLibrary = dynamic(
  () => import('@/components/workflow-builder/node-library').then((m) => m.NodeLibrary),
  { ssr: false },
);
import { PropertiesPanel } from '@/components/workflow-builder/properties-panel';
import { ExportDialog } from '@/components/workflow-builder/export-dialog';
import { ImportDialog } from '@/components/workflow-builder/import-dialog';
import { TopNavigation } from '@/components/workflow-builder/top-navigation';
import { BottomControls } from '@/components/workflow-builder/bottom-controls';
import { ParametersInspector } from '@/components/workflow-builder/parameters-inspector';
import { useTrackpadNavigation } from '@/hooks/use-trackpad-navigation';

// Import types and utilities
import type { WorkflowReactFlowNode, WorkflowNodeDataWithIndex } from '@/lib/workflow/conversion';
import {
  reactFlowToWorkflow,
  createExecutorFromNodeType,
  createNodeDataFromExecutorType,
} from '@/lib/workflow/conversion';
import type { FanInEdgeGroup, FanOutEdgeGroup, SwitchCaseEdgeGroup } from '@/lib/workflow/edges';
import type { ExecutorType } from '@/lib/workflow/executors';
import { MAGENTIC_AGENT_PRESETS } from '@/lib/workflow/magentic-presets';
import type { MagenticAgentPresetKey } from '@/lib/workflow/magentic-presets';
import { log } from '@/lib/logger';

type WorkflowNode = WorkflowReactFlowNode;
type WorkflowEdge = Edge;

// Optimized orchestrator-centric initial scaffold
const orchestratorId = nanoid();
const agentAId = nanoid();
const agentBId = nanoid();
const requestId = nanoid();
const functionId = nanoid();
const childWorkflowId = nanoid();

const orchestratorExec = createExecutorFromNodeType(
  'executor',
  orchestratorId,
  'Orchestrator',
) as any;
const agentAExec = createExecutorFromNodeType(
  'magentic-agent-executor',
  agentAId,
  'Agent A',
) as any;
const agentBExec = createExecutorFromNodeType(
  'magentic-agent-executor',
  agentBId,
  'Agent B',
) as any;
const requestExec = createExecutorFromNodeType(
  'request-info-executor',
  requestId,
  'Fetch Data',
) as any;
const functionExec = createExecutorFromNodeType(
  'function-executor',
  functionId,
  'Process Data',
) as any;
const childWorkflowExec = createExecutorFromNodeType(
  'workflow-executor',
  childWorkflowId,
  'Child Workflow',
) as any;

const initialNodes: WorkflowNode[] = [
  {
    id: orchestratorId,
    type: 'executor',
    position: { x: 600, y: 0 },
    data: createNodeDataFromExecutorType('executor', orchestratorExec) as WorkflowNodeDataWithIndex,
  },
  {
    id: agentAId,
    type: 'magentic-agent-executor',
    position: { x: 200, y: -200 },
    data: createNodeDataFromExecutorType(
      'magentic-agent-executor',
      agentAExec,
    ) as WorkflowNodeDataWithIndex,
  },
  {
    id: agentBId,
    type: 'magentic-agent-executor',
    position: { x: 200, y: 200 },
    data: createNodeDataFromExecutorType(
      'magentic-agent-executor',
      agentBExec,
    ) as WorkflowNodeDataWithIndex,
  },
  {
    id: requestId,
    type: 'request-info-executor',
    position: { x: 1000, y: -200 },
    data: createNodeDataFromExecutorType(
      'request-info-executor',
      requestExec,
    ) as WorkflowNodeDataWithIndex,
  },
  {
    id: functionId,
    type: 'function-executor',
    position: { x: 1000, y: 200 },
    data: createNodeDataFromExecutorType(
      'function-executor',
      functionExec,
    ) as WorkflowNodeDataWithIndex,
  },
  {
    id: childWorkflowId,
    type: 'workflow-executor',
    position: { x: 1400, y: 0 },
    data: createNodeDataFromExecutorType(
      'workflow-executor',
      childWorkflowExec,
    ) as WorkflowNodeDataWithIndex,
  },
];

const initialEdges: WorkflowEdge[] = [
  { id: nanoid(), source: orchestratorId, target: agentAId, type: 'animated' },
  { id: nanoid(), source: orchestratorId, target: agentBId, type: 'animated' },
  { id: nanoid(), source: agentAId, target: requestId, type: 'animated' },
  { id: nanoid(), source: agentBId, target: functionId, type: 'animated' },
  { id: nanoid(), source: requestId, target: childWorkflowId, type: 'animated' },
  { id: nanoid(), source: functionId, target: childWorkflowId, type: 'animated' },
];

type EdgeGroupNodeType = 'fan-in' | 'fan-out' | 'switch-case';

const isEdgeGroupNodeType = (nodeType: string): nodeType is EdgeGroupNodeType => {
  return nodeType === 'fan-in' || nodeType === 'fan-out' || nodeType === 'switch-case';
};

const parseNodeTypeToken = (
  value: string,
): { baseType: string; presetKey?: MagenticAgentPresetKey } => {
  const [baseType, preset] = value.split(':');
  return {
    baseType,
    presetKey: preset as MagenticAgentPresetKey | undefined,
  };
};

function createDefaultFanInGroup(id: string): FanInEdgeGroup {
  return {
    id,
    type: 'fan-in',
    sources: [],
    target: '',
    edges: [],
  };
}

function createDefaultFanOutGroup(id: string): FanOutEdgeGroup {
  return {
    id,
    type: 'fan-out',
    source: '',
    targets: [],
    edges: [],
    broadcastMode: 'parallel',
  };
}

function createDefaultSwitchCaseGroup(id: string): SwitchCaseEdgeGroup {
  return {
    id,
    type: 'switch-case',
    source: '',
    cases: [],
    switchExpression: 'message.type',
  };
}

function createEdgeGroupNode(
  nodeType: EdgeGroupNodeType,
  position: XYPosition,
): WorkflowReactFlowNode {
  const id = `${nodeType}-${nanoid()}`;

  if (nodeType === 'fan-in') {
    const group = createDefaultFanInGroup(id);
    const data: FanInNodeData = {
      variant: 'fan-in',
      handles: {
        target: true,
        source: true,
        sourceCount: group.sources.length,
      },
      group,
    };
    return {
      id,
      type: nodeType,
      position,
      data: data as WorkflowNodeDataWithIndex,
    };
  }

  if (nodeType === 'fan-out') {
    const group = createDefaultFanOutGroup(id);
    const data: FanOutNodeData = {
      variant: 'fan-out',
      handles: {
        target: true,
        source: true,
        targetCount: group.targets.length,
      },
      group,
    };
    return {
      id,
      type: nodeType,
      position,
      data: data as WorkflowNodeDataWithIndex,
    };
  }

  const group = createDefaultSwitchCaseGroup(id);
  const data: SwitchCaseNodeData = {
    variant: 'switch-case',
    handles: {
      target: true,
      source: true,
      caseCount: group.cases.length,
    },
    group,
  };
  return {
    id,
    type: nodeType,
    position,
    data: data as WorkflowNodeDataWithIndex,
  };
}

const nodeTypes: Record<string, React.ComponentType<any>> = {
  executor: ExecutorNode,
  'function-executor': FunctionExecutorNode,
  'agent-executor': AgentExecutorNode,
  'magentic-agent-executor': AgentExecutorNode,
  'workflow-executor': WorkflowExecutorNode,
  'request-info-executor': RequestInfoExecutorNode,
  'magentic-orchestrator-executor': ExecutorNode,
  // Edge group node types
  'fan-in': FanInNode,
  'fan-out': FanOutNode,
  'switch-case': SwitchCaseNode,
};

// Create edge types with handlers
const createEdgeTypes = (
  onEdgeHover?: (
    edgeId: string,
    position: XYPosition,
    screenPosition: { x: number; y: number },
  ) => void,
) => ({
  animated: (props: any) => (
    <AnimatedEdge
      {...props}
      onHover={
        onEdgeHover
          ? (pos: XYPosition, screenPos: { x: number; y: number }) =>
              onEdgeHover(props.id, pos, screenPos)
          : undefined
      }
    />
  ),
  temporary: TemporaryEdge,
});

const WorkflowCanvas = () => {
  const [nodes, setNodes] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlow = useReactFlow();
  const [navSettings] = useState({
    panSensitivity: 1.0,
    zoomSensitivity: 0.003,
    inertiaFriction: 0.92,
    maxMomentumSpeed: 3.0,
    enableWheelPan: false,
  });
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const { navigating } = useTrackpadNavigation(
    flowWrapperRef as any,
    reactFlow as any,
    navSettings,
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        try {
          reactFlow.zoomIn();
        } catch {}
      } else if (e.key === '-') {
        try {
          reactFlow.zoomOut();
        } catch {}
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [reactFlow]);

  // State management for new features
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode<WorkflowNodeDataWithIndex> | null>(
    null,
  );
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [nodeStatuses, setNodeStatuses] = useState<
    Record<string, 'idle' | 'running' | 'completed' | 'error'>
  >({});
  const setNodeStatus = useCallback(
    (id: string, status: 'idle' | 'running' | 'completed' | 'error') => {
      setNodeStatuses((prev) => ({ ...prev, [id]: status }));
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? ({ ...n, data: { ...(n.data as any), status } } as any) : n)),
      );
    },
    [setNodes],
  );

  // Undo/Redo history management
  const [history, setHistory] = useState<Array<{ nodes: any[]; edges: Edge[] }>>([
    { nodes: initialNodes as any[], edges: initialEdges },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const historyFrameRef = useRef(0 as number);
  const bufferedNodesRef = useRef<any[]>([]);
  const bufferedEdgesRef = useRef<Edge[]>([]);
  const saveToHistory = useCallback(
    (newNodes: any[], newEdges: Edge[]) => {
      bufferedNodesRef.current = newNodes;
      bufferedEdgesRef.current = newEdges;
      if (historyFrameRef.current) return;
      historyFrameRef.current = requestAnimationFrame(() => {
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push({
            nodes: structuredClone(bufferedNodesRef.current),
            edges: structuredClone(bufferedEdgesRef.current),
          });
          return newHistory.slice(-50);
        });
        setHistoryIndex((prev) => Math.min(prev + 1, 49));
        historyFrameRef.current = 0;
      });
    },
    [historyIndex],
  );

  const [currentWorkflow, setCurrentWorkflow] = useState<any | null>(null);
  const [lastTransformMs, setLastTransformMs] = useState<number | null>(null);
  const recomputeWorkflow = useCallback(() => {
    const t0 = performance.now();
    const wf = reactFlowToWorkflow(nodes as any, edges, 'workflow-1', 'Agentic Fabric');
    setCurrentWorkflow(wf);
    setLastTransformMs(performance.now() - t0);
  }, [nodes, edges]);

  // Handle node selection - wrapper to sync selected node state
  const handleNodesChangeWrapper = useCallback(
    (changes: NodeChange[]) => {
      const nextNodes = applyNodeChanges(changes, nodes);
      setNodes(nextNodes);

      const significantChanges = changes.filter(
        (change) => change.type !== 'select' && change.type !== 'position',
      );
      if (significantChanges.length > 0 && !draggedNodeId) {
        saveToHistory(nextNodes, edges);
      }

      if (selectedNode) {
        const updated = nextNodes.find((node) => node.id === selectedNode.id);
        setSelectedNode(updated ? (updated as ReactFlowNode<WorkflowNodeDataWithIndex>) : null);
      }
    },
    [nodes, selectedNode, setNodes, edges, saveToHistory, draggedNodeId],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge({ ...connection, type: 'animated' }, eds);
        saveToHistory(nodes, newEdges);
        return newEdges;
      });
    },
    [setEdges, nodes, saveToHistory],
  );

  // Handle inserting node on edge
  const [edgeDropdownState, setEdgeDropdownState] = useState<{
    edgeId: string;
    position: XYPosition;
    screenPosition: { x: number; y: number };
  } | null>(null);

  const handleEdgeHover = useCallback(
    (edgeId: string, position: XYPosition, screenPosition: { x: number; y: number }) => {
      setEdgeDropdownState({
        edgeId,
        position,
        screenPosition,
      });
    },
    [],
  );

  // Memoize edge types to prevent unnecessary re-renders
  const edgeTypes = useMemo(() => createEdgeTypes(handleEdgeHover), [handleEdgeHover]);

  const handleInsertNodeOnEdge = useCallback(
    (nodeType: string) => {
      if (!edgeDropdownState) return;

      const edge = edges.find((e) => e.id === edgeDropdownState.edgeId);
      if (!edge) {
        setEdgeDropdownState(null);
        return;
      }

      const position = edgeDropdownState.position;
      const { baseType, presetKey } = parseNodeTypeToken(nodeType);

      // Create new node
      setNodes((nds) => {
        let newNode: ReactFlowNode<WorkflowNodeDataWithIndex>;

        if (isEdgeGroupNodeType(baseType)) {
          newNode = createEdgeGroupNode(baseType, position);
        } else {
          const executorId = nanoid();
          const preset = presetKey
            ? MAGENTIC_AGENT_PRESETS.find((item) => item.key === presetKey)
            : undefined;
          const executor = createExecutorFromNodeType(
            baseType,
            executorId,
            preset?.label || `New ${baseType}`,
            {
              presetKey,
            },
          );
          const nodeData = createNodeDataFromExecutorType(baseType as ExecutorType, executor);

          newNode = {
            id: executorId,
            type: baseType,
            position,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          };
        }

        const newNodes = [...nds, newNode];

        // Split edge: remove old edge, add two new edges
        setEdges((eds) => {
          const filtered = eds.filter((e) => e.id !== edgeDropdownState.edgeId);
          const newEdges = [
            ...filtered,
            { id: nanoid(), source: edge.source, target: newNode.id, type: 'animated' },
            { id: nanoid(), source: newNode.id, target: edge.target, type: 'animated' },
          ];
          // Save to history after all changes
          saveToHistory(newNodes, newEdges);
          return newEdges;
        });

        return newNodes;
      });

      setEdgeDropdownState(null);
    },
    [edgeDropdownState, edges, setNodes, setEdges, saveToHistory],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) {
        return;
      }

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNodes((nds) => {
        let newNode: ReactFlowNode<WorkflowNodeDataWithIndex>;
        const { baseType, presetKey } = parseNodeTypeToken(nodeType);

        if (isEdgeGroupNodeType(baseType)) {
          newNode = createEdgeGroupNode(baseType, position);
        } else {
          const executorId = nanoid();
          const preset = presetKey
            ? MAGENTIC_AGENT_PRESETS.find((item) => item.key === presetKey)
            : undefined;
          const executor = createExecutorFromNodeType(
            baseType,
            executorId,
            preset?.label || `New ${baseType}`,
            {
              presetKey,
            },
          );
          const nodeData = createNodeDataFromExecutorType(baseType as ExecutorType, executor);

          newNode = {
            id: executorId,
            type: baseType,
            position,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          };
        }

        const newNodes = [...nds, newNode];
        saveToHistory(newNodes, edges);
        return newNodes;
      });
    },
    [reactFlow, setNodes, edges, saveToHistory],
  );

  const handleDragStart = useCallback((event: DragEvent<HTMLElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleAddNode = useCallback(
    (nodeType = 'executor') => {
      if (!flowWrapperRef.current) {
        return;
      }

      const bounds = flowWrapperRef.current.getBoundingClientRect();
      const centerPosition = reactFlow.screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });

      setNodes((nds) => {
        let newNode: ReactFlowNode<WorkflowNodeDataWithIndex>;
        const { baseType, presetKey } = parseNodeTypeToken(nodeType);

        if (nodeType === 'scaffold:group-chat') {
          // Create a simple group chat scaffold: coordinator + 3 agents fully connected
          const center = centerPosition;
          const coordinatorId = nanoid();
          const coordinatorExec = createExecutorFromNodeType(
            'executor',
            coordinatorId,
            'Coordinator',
          );
          const coordinatorNode: ReactFlowNode<WorkflowNodeDataWithIndex> = {
            id: coordinatorId,
            type: 'executor',
            position: center,
            data: createNodeDataFromExecutorType(
              'executor',
              coordinatorExec,
            ) as WorkflowNodeDataWithIndex,
          };
          const radius = 240;
          const agents: ReactFlowNode<WorkflowNodeDataWithIndex>[] = [];
          const edgesToAdd: Edge[] = [];
          for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 * i) / 3;
            const pos = {
              x: center.x + radius * Math.cos(angle),
              y: center.y + radius * Math.sin(angle),
            };
            const aid = nanoid();
            const aexec = createExecutorFromNodeType('agent-executor', aid, `Agent ${i + 1}`);
            const anode: ReactFlowNode<WorkflowNodeDataWithIndex> = {
              id: aid,
              type: 'agent-executor',
              position: pos,
              data: createNodeDataFromExecutorType(
                'agent-executor',
                aexec,
              ) as WorkflowNodeDataWithIndex,
            };
            agents.push(anode);
            edgesToAdd.push({ id: nanoid(), source: coordinatorId, target: aid, type: 'animated' });
            edgesToAdd.push({ id: nanoid(), source: aid, target: coordinatorId, type: 'animated' });
          }
          setNodes((nds) => {
            const newNodes = [...nds, coordinatorNode, ...agents];
            setEdges((eds) => [...eds, ...edgesToAdd]);
            saveToHistory(newNodes, edges);
            return newNodes;
          });
          return nds;
        }

        if (nodeType === 'scaffold:handoff') {
          // Create triage agent with conditional routing to two specialists via switch-case
          const triageId = nanoid();
          const triageExec = createExecutorFromNodeType('agent-executor', triageId, 'Triage Agent');
          const triageNode: ReactFlowNode<WorkflowNodeDataWithIndex> = {
            id: triageId,
            type: 'agent-executor',
            position: { x: centerPosition.x - 200, y: centerPosition.y },
            data: createNodeDataFromExecutorType(
              'agent-executor',
              triageExec,
            ) as WorkflowNodeDataWithIndex,
          };
          const switchNode = createEdgeGroupNode('switch-case', {
            x: centerPosition.x,
            y: centerPosition.y,
          });
          const spec1Id = nanoid();
          const spec1Exec = createExecutorFromNodeType('agent-executor', spec1Id, 'Specialist A');
          const spec1Node: ReactFlowNode<WorkflowNodeDataWithIndex> = {
            id: spec1Id,
            type: 'agent-executor',
            position: { x: centerPosition.x + 220, y: centerPosition.y - 140 },
            data: createNodeDataFromExecutorType(
              'agent-executor',
              spec1Exec,
            ) as WorkflowNodeDataWithIndex,
          };
          const spec2Id = nanoid();
          const spec2Exec = createExecutorFromNodeType('agent-executor', spec2Id, 'Specialist B');
          const spec2Node: ReactFlowNode<WorkflowNodeDataWithIndex> = {
            id: spec2Id,
            type: 'agent-executor',
            position: { x: centerPosition.x + 220, y: centerPosition.y + 140 },
            data: createNodeDataFromExecutorType(
              'agent-executor',
              spec2Exec,
            ) as WorkflowNodeDataWithIndex,
          };
          setNodes((nds) => {
            const newNodes = [...nds, triageNode, switchNode as any, spec1Node, spec2Node];
            setEdges((eds) => [
              ...eds,
              { id: nanoid(), source: triageId, target: (switchNode as any).id, type: 'animated' },
              { id: nanoid(), source: (switchNode as any).id, target: spec1Id, type: 'animated' },
              { id: nanoid(), source: (switchNode as any).id, target: spec2Id, type: 'animated' },
            ]);
            saveToHistory(newNodes, edges);
            return newNodes;
          });
          return nds;
        }

        if (isEdgeGroupNodeType(baseType)) {
          newNode = createEdgeGroupNode(baseType, centerPosition);
        } else {
          const executorId = nanoid();
          const preset = presetKey
            ? MAGENTIC_AGENT_PRESETS.find((item) => item.key === presetKey)
            : undefined;
          const executor = createExecutorFromNodeType(
            baseType,
            executorId,
            preset?.label || `New ${baseType}`,
            {
              presetKey,
            },
          );
          const nodeData = createNodeDataFromExecutorType(baseType as ExecutorType, executor);

          newNode = {
            id: executorId,
            type: baseType,
            position: centerPosition,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          };
        }

        const newNodes = [...nds, newNode];
        saveToHistory(newNodes, edges);
        return newNodes;
      });
    },
    [reactFlow, setNodes, setEdges, edges, saveToHistory],
  );

  const handleAddMagenticScaffold = useCallback(() => {
    if (!flowWrapperRef.current) {
      return;
    }

    const bounds = flowWrapperRef.current.getBoundingClientRect();
    const centerPosition = reactFlow.screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    });

    const currentNodes = reactFlow.getNodes() as ReactFlowNode<WorkflowNodeDataWithIndex>[];
    const currentEdges = reactFlow.getEdges();

    const findPresetKey = (node: ReactFlowNode<WorkflowNodeDataWithIndex>) => {
      const executor = (node.data as any)?.executor as any;
      const metadata = (executor?.metadata as any)?.magentic;
      return metadata?.presetKey ?? metadata?.preset ?? undefined;
    };

    let orchestratorNode = currentNodes.find(
      (node) => node.type === 'magentic-orchestrator-executor',
    );
    if (!orchestratorNode) {
      const orchestratorId = nanoid();
      const orchestratorExecutor = createExecutorFromNodeType(
        'magentic-orchestrator-executor',
        orchestratorId,
        'Magentic Orchestrator',
      );
      orchestratorNode = {
        id: orchestratorId,
        type: 'magentic-orchestrator-executor',
        position: centerPosition,
        data: {
          ...createNodeDataFromExecutorType('magentic-orchestrator-executor', orchestratorExecutor),
        } as WorkflowNodeDataWithIndex,
      };
    }

    const orchestratorId = orchestratorNode.id;
    const origin = orchestratorNode.position ?? centerPosition;

    const radius = 280;
    const presets = MAGENTIC_AGENT_PRESETS;
    const angleStep = presets.length ? (Math.PI * 2) / presets.length : 0;
    const nextNodesMap = new Map<string, ReactFlowNode<WorkflowNodeDataWithIndex>>();
    currentNodes.forEach((node) => nextNodesMap.set(node.id, { ...node }));
    nextNodesMap.set(orchestratorNode.id, { ...orchestratorNode, position: origin });

    const agentNodes: ReactFlowNode<WorkflowNodeDataWithIndex>[] = presets.map((preset, index) => {
      const angle = angleStep * index;
      const targetPosition = {
        x: origin.x + radius * Math.cos(angle),
        y: origin.y + radius * Math.sin(angle),
      };

      const existing = [...nextNodesMap.values()].find(
        (node) => node.type === 'magentic-agent-executor' && findPresetKey(node) === preset.key,
      );

      if (existing) {
        const executor = (existing.data as any)?.executor as any;
        const updatedExecutor = executor
          ? {
              ...executor,
              metadata: {
                ...(executor.metadata || {}),
                magentic: {
                  presetKey: preset.key,
                  capabilities: preset.capabilities,
                },
                source: 'agent-framework',
              },
              capabilities: preset.capabilities,
              systemPrompt: preset.systemPrompt,
              label: preset.label,
              description: preset.description,
              tools: preset.toolIds?.map((toolId) => ({ toolId, enabled: true })),
            }
          : undefined;

        const updatedNode = {
          ...existing,
          position: targetPosition,
          data: {
            ...(existing.data as WorkflowNodeDataWithIndex),
            executor: updatedExecutor ?? (existing.data as any).executor,
            label: preset.label,
            description: preset.description,
          },
        } as ReactFlowNode<WorkflowNodeDataWithIndex>;
        nextNodesMap.set(updatedNode.id, updatedNode);
        return updatedNode;
      }

      const agentId = nanoid();
      const agentExecutor = createExecutorFromNodeType(
        'magentic-agent-executor',
        agentId,
        preset.label,
        {
          presetKey: preset.key,
        },
      );

      const newNode: ReactFlowNode<WorkflowNodeDataWithIndex> = {
        id: agentId,
        type: 'magentic-agent-executor',
        position: targetPosition,
        data: {
          ...createNodeDataFromExecutorType('magentic-agent-executor', agentExecutor),
        } as WorkflowNodeDataWithIndex,
      };

      nextNodesMap.set(agentId, newNode);
      return newNode;
    });

    const nextEdges = [...currentEdges];
    const edgeKey = (e: Edge) => `${e.source}->${e.target}`;
    const edgeSet = new Set(nextEdges.map(edgeKey));
    const ensureEdge = (source: string, target: string) => {
      const key = `${source}->${target}`;
      if (!edgeSet.has(key)) {
        const created = { id: nanoid(), source, target, type: 'animated' } as Edge;
        nextEdges.push(created);
        edgeSet.add(key);
      }
    };

    agentNodes.forEach((agentNode) => {
      ensureEdge(orchestratorId, agentNode.id);
      ensureEdge(agentNode.id, orchestratorId);
    });

    setNodes(Array.from(nextNodesMap.values()));
    setEdges(nextEdges);
  }, [reactFlow, setEdges, setNodes]);

  // Check if node is an executor node
  const isExecutorNode = (node: ReactFlowNode<WorkflowNodeDataWithIndex>): boolean => {
    const data = node.data as any;
    return (
      data?.variant === 'executor' ||
      data?.variant === 'function-executor' ||
      data?.variant === 'agent-executor' ||
      data?.variant === 'workflow-executor' ||
      data?.variant === 'request-info-executor'
    );
  };

  // Handle node update from properties panel
  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<any>) => {
      let updatedNode: ReactFlowNode<WorkflowNodeDataWithIndex> | null = null;

      setNodes((nds) =>
        nds.map((node) => {
          if (
            node.id === nodeId &&
            isExecutorNode(node as ReactFlowNode<WorkflowNodeDataWithIndex>)
          ) {
            const currentData = node.data as any;
            if (currentData.executor) {
              const updatedExecutor = { ...currentData.executor, ...updates };
              const nextNode: ReactFlowNode<WorkflowNodeDataWithIndex> = {
                ...node,
                data: {
                  ...currentData,
                  executor: updatedExecutor,
                  label: updates.label ?? currentData.label,
                  description: updates.description ?? currentData.description,
                },
              };
              updatedNode = nextNode;
              return nextNode;
            }
          }
          return node;
        }),
      );

      if (selectedNode?.id === nodeId) {
        setSelectedNode(updatedNode ?? null);
      }
    },
    [setNodes, selectedNode],
  );

  // Handle node selection
  const handleNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNode(node as ReactFlowNode<WorkflowNodeDataWithIndex>);
  }, []);

  // Handle workflow import
  const handleImport = useCallback(
    (importedNodes: any[], importedEdges: Edge[]) => {
      setNodes(importedNodes as any);
      setEdges(importedEdges);
      reactFlow.fitView();
    },
    [setNodes, setEdges, reactFlow],
  );

  const handleEvaluate = useCallback(() => {
    recomputeWorkflow();
    const result = validateWorkflowExtended(currentWorkflow);
    const message = result.valid ? 'Workflow is valid' : 'Workflow has issues';
    const details = result.valid
      ? 'No errors or warnings'
      : `${result.errors.length + result.typeErrors.length} errors, ${result.warnings.length + result.connectivityWarnings.length} warnings`;
    toast({ title: message, description: details });
  }, [currentWorkflow, recomputeWorkflow]);

  const handleCode = useCallback(() => {
    recomputeWorkflow();
    setExportDialogOpen(true);
  }, [recomputeWorkflow]);

  const handlePreview = useCallback(() => {
    recomputeWorkflow();
    setInspectOpen(true);
  }, [recomputeWorkflow]);

  const handlePublish = useCallback(() => {
    recomputeWorkflow();
    downloadWorkflow(currentWorkflow, 'json');
    toast({ title: 'Published', description: 'Workflow bundle downloaded' });
  }, [currentWorkflow, recomputeWorkflow]);

  const handleNodeDragStart = useCallback((_event: React.MouseEvent, node: ReactFlowNode) => {
    setDraggedNodeId(node.id);
  }, []);

  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: ReactFlowNode) => {
      if (!draggedNodeId) return;

      // Find if the dragged node overlaps with any other node
      const draggedNode = nodes.find((n) => n.id === draggedNodeId);
      if (!draggedNode) {
        setDraggedNodeId(null);
        return;
      }

      // Calculate node bounds once (assuming standard node dimensions)
      const nodeWidth = 300;
      const nodeHeight = 200;

      const draggedBounds = {
        left: draggedNode.position.x,
        right: draggedNode.position.x + nodeWidth,
        top: draggedNode.position.y,
        bottom: draggedNode.position.y + nodeHeight,
      };

      // Check for overlapping nodes (excluding the dragged node itself)
      const overlappingNode = nodes.find((n) => {
        if (n.id === draggedNodeId) return false;

        const targetBounds = {
          left: n.position.x,
          right: n.position.x + nodeWidth,
          top: n.position.y,
          bottom: n.position.y + nodeHeight,
        };

        // Check for overlap
        return !(
          draggedBounds.right < targetBounds.left ||
          draggedBounds.left > targetBounds.right ||
          draggedBounds.bottom < targetBounds.top ||
          draggedBounds.top > targetBounds.bottom
        );
      });

      if (overlappingNode) {
        // Reposition the dragged node near the overlapping node
        const offset = 350; // Distance to place the node
        const angle = Math.atan2(
          draggedNode.position.y - overlappingNode.position.y,
          draggedNode.position.x - overlappingNode.position.x,
        );

        const newPosition = {
          x: overlappingNode.position.x + Math.cos(angle) * offset,
          y: overlappingNode.position.y + Math.sin(angle) * offset,
        };

        setNodes((nds) => {
          const updatedNodes = nds.map((n) =>
            n.id === draggedNodeId ? { ...n, position: newPosition } : n,
          );
          saveToHistory(updatedNodes, edges);
          return updatedNodes;
        });
      } else {
        // Save position change to history even if no overlap
        saveToHistory(nodes, edges);
      }

      setDraggedNodeId(null);
    },
    [draggedNodeId, nodes, edges, setNodes, saveToHistory],
  );

  return (
    <div className="relative h-full w-full">
      <TopNavigation
        projectName={currentWorkflow?.name || 'MCP Draft'}
        projectStatus={currentWorkflow?.metadata?.custom?.status as string | undefined}
        workflow={null}
        onEvaluate={handleEvaluate}
        onCode={handleCode}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onValidate={() => {
          setInspectOpen(true);
        }}
      />
      <div
        ref={flowWrapperRef}
        className={
          'absolute inset-0 w-full h-full overflow-hidden' + (navigating ? ' flow-navigating' : '')
        }
      >
        <Canvas
          className="h-full w-full"
          connectionLineComponent={ConnectionLine}
          edges={edges}
          fitView
          nodes={nodes}
          nodeTypes={nodeTypes}
          onConnect={handleConnect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEdgesChange={onEdgesChange}
          onNodesChange={handleNodesChangeWrapper}
          onNodeClick={handleNodeClick}
          onPaneClick={() => {
            setSelectedNode(null);
            setEdgeDropdownState(null);
          }}
          panOnDrag={[1]}
          nodesDraggable={!locked}
          selectionOnDrag={false}
          edgeTypes={edgeTypes}
          onNodeDragStart={handleNodeDragStart}
          onNodeDragStop={handleNodeDragStop}
        >
          <NodeLibrary
            onAddNode={handleAddNode}
            onDragStart={handleDragStart}
            onAddMagenticScaffold={handleAddMagenticScaffold}
            className="py-5"
          />
          {edgeDropdownState && (
            <EdgeNodeDropdown
              edgeId={edgeDropdownState.edgeId}
              position={edgeDropdownState.position}
              screenPosition={edgeDropdownState.screenPosition}
              onSelectNode={handleInsertNodeOnEdge}
              onClose={() => setEdgeDropdownState(null)}
            />
          )}
          {selectedNode && (
            <PropertiesPanel
              selectedNode={{
                id: selectedNode.id,
                type: selectedNode.type || 'executor',
                data: selectedNode.data as any,
              }}
              onUpdate={(nodeId, updates) => {
                if (locked) return;
                handleNodeUpdate(nodeId, updates);
              }}
              onDelete={(nodeId) => {
                if (locked) return;
                setNodes((nds) => {
                  const newNodes = nds.filter((n) => n.id !== nodeId);
                  saveToHistory(newNodes, edges);
                  return newNodes;
                });
                if (selectedNode?.id === nodeId) {
                  setSelectedNode(null);
                }
              }}
              onDuplicate={(nodeId) => {
                if (locked) return;
                const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
                if (nodeToDuplicate) {
                  const newId = nanoid();
                  const duplicatedNode = {
                    ...nodeToDuplicate,
                    id: newId,
                    position: {
                      x: nodeToDuplicate.position.x + 50,
                      y: nodeToDuplicate.position.y + 50,
                    },
                  };
                  setNodes((nds) => {
                    const newNodes = [...nds, duplicatedNode];
                    saveToHistory(newNodes, edges);
                    return newNodes;
                  });
                }
              }}
              onEvaluate={(nodeId) => {
                setNodeStatus(nodeId, 'running');
                window.setTimeout(() => setNodeStatus(nodeId, 'completed'), 600);
              }}
            />
          )}
          <BottomControls
            onUndo={() => {
              if (canUndo) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                const state = history[newIndex];
                setNodes(state.nodes as any);
                setEdges(state.edges);
              }
            }}
            onRedo={() => {
              if (canRedo) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                const state = history[newIndex];
                setNodes(state.nodes as any);
                setEdges(state.edges);
              }
            }}
            canUndo={canUndo}
            canRedo={canRedo}
            onEvaluate={handleEvaluate}
            onValidate={() => {
              setInspectOpen(true);
            }}
            onFitView={() => {
              try {
                reactFlow.fitView();
              } catch {}
            }}
            locked={locked}
            onToggleLock={() => setLocked((v) => !v)}
          />
        </Canvas>
        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          workflow={currentWorkflow}
        />
        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          onImport={handleImport}
        />
        <ParametersInspector
          open={inspectOpen}
          onOpenChange={setInspectOpen}
          workflow={currentWorkflow as any}
        />
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    try {
      log.error('ErrorBoundary', error, info);
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-sm">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

const Page = () => (
  <ReactFlowProvider>
    <div className="h-screen w-screen">
      <ErrorBoundary>
        <WorkflowCanvas />
      </ErrorBoundary>
    </div>
  </ReactFlowProvider>
);

export default Page;
