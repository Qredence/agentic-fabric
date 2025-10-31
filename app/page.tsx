"use client";

import React, { memo, useCallback, useRef, useState, useMemo, type DragEvent } from "react";
import {
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node as ReactFlowNode,
  type NodeProps,
} from "@xyflow/react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Connection as ConnectionLine } from "@/components/ai-elements/connection";
import { Edge as WorkflowEdgeComponent } from "@/components/ai-elements/edge";
import { TemporaryEdge, AnimatedEdge } from "@/components/ai-elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Panel } from "@/components/ai-elements/panel";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextBlockCard } from "@/components/ai-elements/text-block-card";
import { AttributeNode } from "@/components/ai-elements/attribute-node";
import { Action, Actions } from "@/components/ai-elements/actions";
import { Pencil, Trash2, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { nanoid } from "nanoid";

// Import executor node components
import { ExecutorNode } from "@/components/ai-elements/executors/executor-node";
import { FunctionExecutorNode } from "@/components/ai-elements/executors/function-executor-node";
import { AgentExecutorNode } from "@/components/ai-elements/executors/agent-executor-node";
import { WorkflowExecutorNode } from "@/components/ai-elements/executors/workflow-executor-node";
import { RequestInfoExecutorNode } from "@/components/ai-elements/executors/request-info-executor-node";

// Import edge group components
import { FanInNode } from "@/components/ai-elements/edge-groups/fan-in-node";
import { FanOutNode } from "@/components/ai-elements/edge-groups/fan-out-node";
import { SwitchCaseNode } from "@/components/ai-elements/edge-groups/switch-case-node";

// Import workflow builder components
import { NodeLibrary } from "@/components/workflow-builder/node-library";
import { PropertiesPanel } from "@/components/workflow-builder/properties-panel";
import { WorkflowControls } from "@/components/workflow-builder/workflow-controls";
import { ExportDialog } from "@/components/workflow-builder/export-dialog";
import { ImportDialog } from "@/components/workflow-builder/import-dialog";

// Import types and utilities
import type {
  AttributeNodeData,
  TextBlockNodeData,
  WorkflowStepNodeData,
} from "@/lib/workflow/types";
import {
  defaultAttributeNodeData,
  defaultTextBlockData,
  defaultWorkflowStepData,
} from "@/lib/workflow/types";
import type { WorkflowReactFlowNode, WorkflowNodeData, WorkflowNodeDataWithIndex } from "@/lib/workflow/conversion";
import {
  reactFlowToWorkflow,
  workflowToReactFlow,
  createExecutorFromNodeType,
  createNodeDataFromExecutorType,
} from "@/lib/workflow/conversion";
import type { Workflow } from "@/lib/workflow/workflow";
import type { BaseExecutor } from "@/lib/workflow/types";

type WorkflowNode = WorkflowReactFlowNode;
type WorkflowEdge = Edge;

const nodeIds = {
  start: "start",
  process1: "process1",
  process2: "process2",
  decision: "decision",
  output1: "output1",
  output2: "output2",
  textBlock: "textBlock",
  attribute: "attribute",
};

const initialNodes: WorkflowNode[] = [
  {
    id: nodeIds.start,
    type: "workflow",
    position: { x: 0, y: 0 },
    data: { ...defaultWorkflowStepData({
      handles: { target: false, source: true },
      label: "Start",
      description: "Initialize workflow",
      content: "Triggered by user action at 09:30 AM",
      footer: "Status: Ready",
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.process1,
    type: "workflow",
    position: { x: 500, y: 0 },
    data: { ...defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Process Data",
      description: "Transform input",
      content: "Validating 1,234 records and applying business rules",
      footer: "Duration: ~2.5s",
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.decision,
    type: "workflow",
    position: { x: 1000, y: 0 },
    data: { ...defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Decision Point",
      description: "Route based on conditions",
      content: "Evaluating: data.status === 'valid' && data.score > 0.8",
      footer: "Confidence: 94%",
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.output1,
    type: "workflow",
    position: { x: 1500, y: -300 },
    data: { ...defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Success Path",
      description: "Handle success case",
      content: "1,156 records passed validation (93.7%)",
      footer: "Next: Send to production",
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.output2,
    type: "workflow",
    position: { x: 1500, y: 300 },
    data: { ...defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Error Path",
      description: "Handle error case",
      content: "78 records failed validation (6.3%)",
      footer: "Next: Queue for review",
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.process2,
    type: "workflow",
    position: { x: 2000, y: 0 },
    data: { ...defaultWorkflowStepData({
      handles: { target: true, source: false },
      label: "Complete",
      description: "Finalize workflow",
      content: "All records processed and routed successfully",
      footer: "Total time: 4.2s",
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.textBlock,
    type: "textBlock",
    position: { x: 600, y: -250 },
    data: { ...defaultTextBlockData({
      title: "Creative brief",
      placeholder: "Outline the project scope and key messaging",
      showSuggestions: true,
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.attribute,
    type: "attribute",
    position: { x: 600, y: 250 },
    data: { ...defaultAttributeNodeData({
      title: "Generation settings",
      attributes: [
        {
          id: "tone",
          label: "Tone",
          type: "select",
          options: ["Formal", "Neutral", "Playful"],
          value: "Neutral",
        },
        {
          id: "temperature",
          label: "Temperature",
          type: "slider",
          min: 0,
          max: 1,
          step: 0.05,
          value: 0.7,
        },
        {
          id: "length",
          label: "Length",
          type: "progress",
          value: 40,
        },
      ],
    }), ...{} } as WorkflowNodeDataWithIndex,
  },
];

const initialEdges: WorkflowEdge[] = [
  {
    id: "edge1",
    source: nodeIds.start,
    target: nodeIds.process1,
    type: "animated",
  },
  {
    id: "edge2",
    source: nodeIds.process1,
    target: nodeIds.decision,
    type: "animated",
  },
  {
    id: "edge3",
    source: nodeIds.decision,
    target: nodeIds.output1,
    type: "animated",
  },
  {
    id: "edge4",
    source: nodeIds.decision,
    target: nodeIds.output2,
    type: "temporary",
  },
  {
    id: "edge5",
    source: nodeIds.output1,
    target: nodeIds.process2,
    type: "animated",
  },
  {
    id: "edge6",
    source: nodeIds.output2,
    target: nodeIds.process2,
    type: "temporary",
  },
];

const WorkflowStepNode = memo(({ id, data }: { id: string; data: WorkflowStepNodeData }) => (
  <Node handles={data.handles}>
    <NodeHeader>
      <NodeTitle>{data.label}</NodeTitle>
      <NodeDescription>{data.description}</NodeDescription>
    </NodeHeader>
    <NodeContent>
      <p className="text-sm">{data.content}</p>
    </NodeContent>
    <NodeFooter>
      <p className="text-muted-foreground text-xs">{data.footer}</p>
    </NodeFooter>
    <Toolbar>
      <Actions>
        <Action tooltip="Edit node" label="Edit" aria-label="Edit node">
          <Pencil className="size-4" />
        </Action>
        <Action tooltip="Delete node" label="Delete" aria-label="Delete node">
          <Trash2 className="size-4" />
        </Action>
      </Actions>
    </Toolbar>
  </Node>
));

const TextBlockWorkflowNode = memo(({
  id,
  data,
  selected,
}: { id: string; data: TextBlockNodeData; selected?: boolean }) => {
  const { handles: _handles, ...cardProps } = data;
  void _handles;

  return <TextBlockCard {...cardProps} data-id={id} isSelected={selected} />;
});

const AttributeWorkflowNode = memo(({
  id,
  data,
  selected,
}: { id: string; data: AttributeNodeData; selected?: boolean }) => {
  const { handles: _handles, ...attributeProps } = data;
  void _handles;

  return (
    <AttributeNode {...attributeProps} data-id={id} isSelected={selected} />
  );
});

const nodeTypes: Record<string, React.ComponentType<any>> = {
  // Legacy node types (kept for backward compatibility)
  workflow: WorkflowStepNode,
  textBlock: TextBlockWorkflowNode,
  attribute: AttributeWorkflowNode,
  // New executor node types
  executor: ExecutorNode,
  "function-executor": FunctionExecutorNode,
  "agent-executor": AgentExecutorNode,
  "workflow-executor": WorkflowExecutorNode,
  "request-info-executor": RequestInfoExecutorNode,
  // Edge group node types
  "fan-in": FanInNode,
  "fan-out": FanOutNode,
  "switch-case": SwitchCaseNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
  temporary: TemporaryEdge,
};


const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlow = useReactFlow();
  const flowWrapperRef = useRef<HTMLDivElement>(null);

  // State management for new features
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode<WorkflowNodeDataWithIndex> | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Convert React Flow state to Workflow format
  const currentWorkflow = useMemo(() => {
    return reactFlowToWorkflow(nodes as any, edges, "workflow-1", "Multi-Agent Workflow");
  }, [nodes, edges]);

  // Handle node selection - wrapper to sync selected node state
  const handleNodesChangeWrapper = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
      // Update selected node if it was changed
      if (selectedNode) {
        const updatedNode = nodes.find((n) => n.id === selectedNode.id);
        if (updatedNode) {
          setSelectedNode(updatedNode as ReactFlowNode<WorkflowNodeDataWithIndex>);
        } else {
          // Node was deleted
          setSelectedNode(null);
        }
      }
    },
    [onNodesChange, selectedNode, nodes]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "animated" }, eds));
    },
    [setEdges]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) {
        return;
      }

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNodes((nds) => {
        let newNode: ReactFlowNode<WorkflowNodeDataWithIndex>;

        // Handle legacy node types
        if (nodeType === "textBlock") {
          newNode = {
            id: nanoid(),
            type: nodeType,
            position,
            data: { ...defaultTextBlockData(), ...{} } as WorkflowNodeDataWithIndex,
          };
        } else if (nodeType === "attribute") {
          newNode = {
            id: nanoid(),
            type: nodeType,
            position,
            data: { ...defaultAttributeNodeData(), ...{} } as WorkflowNodeDataWithIndex,
          };
        } else if (nodeType === "workflow") {
          newNode = {
            id: nanoid(),
            type: nodeType,
            position,
            data: { ...defaultWorkflowStepData({
              label: `New Step ${nds.length + 1}`,
            }), ...{} } as WorkflowNodeDataWithIndex,
          };
        } else {
          // Handle new executor types
          const executorId = nanoid();
          const executor = createExecutorFromNodeType(nodeType, executorId, `New ${nodeType}`);
          const nodeData = createNodeDataFromExecutorType(nodeType as any, executor);
          
          newNode = {
            id: executorId,
            type: nodeType,
            position,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          };
        }

        return [...nds, newNode];
      });
    },
    [reactFlow, setNodes]
  );

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, nodeType: string) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleAddNode = useCallback(
    (nodeType: string = "executor") => {
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

        if (nodeType === "workflow") {
          newNode = {
            id: nanoid(),
            type: nodeType,
            position: centerPosition,
            data: { ...defaultWorkflowStepData({
              label: `New Step ${nds.length + 1}`,
              description: "Added from panel",
              content: "Start connecting this step to build out the workflow.",
            }), ...{} } as WorkflowNodeDataWithIndex,
          };
        } else {
          // Create new executor node
          const executorId = nanoid();
          const executor = createExecutorFromNodeType(nodeType, executorId, `New ${nodeType}`);
          const nodeData = createNodeDataFromExecutorType(nodeType as any, executor);
          
          newNode = {
            id: executorId,
            type: nodeType,
            position: centerPosition,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          };
        }

        return [...nds, newNode];
      });
    },
    [reactFlow, setNodes]
  );

  // Handle node update from properties panel
  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<BaseExecutor>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId && isExecutorNode(node as ReactFlowNode<WorkflowNodeDataWithIndex>)) {
            const currentData = node.data as any;
            if (currentData.executor) {
              const updatedExecutor = { ...currentData.executor, ...updates };
              return {
                ...node,
                data: {
                  ...currentData,
                  executor: updatedExecutor,
                  label: updates.label ?? currentData.label,
                  description: updates.description ?? currentData.description,
                },
              };
            }
          }
          return node;
        })
      );
      
      // Update selected node if it was the one that changed
      if (selectedNode?.id === nodeId) {
        const updatedNode = nodes.find((n) => n.id === nodeId);
        if (updatedNode) {
          setSelectedNode(updatedNode as ReactFlowNode<WorkflowNodeDataWithIndex>);
        }
      }
    },
    [setNodes, selectedNode, nodes]
  );

  // Check if node is an executor node
  const isExecutorNode = (node: ReactFlowNode<WorkflowNodeDataWithIndex>): boolean => {
    const data = node.data as any;
    return (
      data?.variant === "executor" ||
      data?.variant === "function-executor" ||
      data?.variant === "agent-executor" ||
      data?.variant === "workflow-executor" ||
      data?.variant === "request-info-executor"
    );
  };

  // Handle node selection
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node as ReactFlowNode<WorkflowNodeDataWithIndex>);
    },
    []
  );

  // Handle workflow import
  const handleImport = useCallback(
    (importedNodes: any[], importedEdges: Edge[]) => {
      setNodes(importedNodes as any);
      setEdges(importedEdges);
      reactFlow.fitView();
    },
    [setNodes, setEdges, reactFlow]
  );

  return (
    <div ref={flowWrapperRef} className="h-full w-full">
      <Canvas
        className="h-full w-full"
        connectionLineComponent={ConnectionLine}
        edges={edges}
        edgeTypes={edgeTypes}
        fitView
        nodes={nodes}
        nodeTypes={nodeTypes}
        onConnect={handleConnect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onNodeClick={handleNodeClick}
      >
        <WorkflowControls
          workflow={currentWorkflow}
          onExport={() => setExportDialogOpen(true)}
          onImport={() => setImportDialogOpen(true)}
        />
        <NodeLibrary
          onAddNode={handleAddNode}
          onDragStart={handleDragStart}
        />
            <PropertiesPanel
              selectedNode={
                selectedNode
                  ? {
                      id: selectedNode.id,
                      type: selectedNode.type || "executor",
                      data: selectedNode.data as any,
                    }
                  : null
              }
              onUpdate={handleNodeUpdate}
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

  componentDidCatch() {}

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
