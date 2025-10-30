"use client";

import React, { memo, useCallback, useRef, type DragEvent } from "react";
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
import { Connection } from "@/components/ai-elements/connection";
import { Edge as WorkflowEdgeComponent } from "@/components/ai-elements/edge";
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
import BottomLeftPromptInput from "@/components/ai-elements/@prompt-input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextBlockCard } from "@/components/ai-elements/text-block-card";
import { AttributeNode } from "@/components/ai-elements/attribute-node";
import { Action, Actions } from "@/components/ai-elements/actions";
import { Pencil, Trash2, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { nanoid } from "nanoid";
import type {
  AttributeNodeData,
  TextBlockNodeData,
  WorkflowNodeData,
  WorkflowStepNodeData,
} from "@/lib/workflow/types";
import {
  defaultAttributeNodeData,
  defaultTextBlockData,
  defaultWorkflowStepData,
} from "@/lib/workflow/types";

type WorkflowNode = ReactFlowNode<WorkflowNodeData>;
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
    data: defaultWorkflowStepData({
      handles: { target: false, source: true },
      label: "Start",
      description: "Initialize workflow",
      content: "Triggered by user action at 09:30 AM",
      footer: "Status: Ready",
    }),
  },
  {
    id: nodeIds.process1,
    type: "workflow",
    position: { x: 500, y: 0 },
    data: defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Process Data",
      description: "Transform input",
      content: "Validating 1,234 records and applying business rules",
      footer: "Duration: ~2.5s",
    }),
  },
  {
    id: nodeIds.decision,
    type: "workflow",
    position: { x: 1000, y: 0 },
    data: defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Decision Point",
      description: "Route based on conditions",
      content: "Evaluating: data.status === 'valid' && data.score > 0.8",
      footer: "Confidence: 94%",
    }),
  },
  {
    id: nodeIds.output1,
    type: "workflow",
    position: { x: 1500, y: -300 },
    data: defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Success Path",
      description: "Handle success case",
      content: "1,156 records passed validation (93.7%)",
      footer: "Next: Send to production",
    }),
  },
  {
    id: nodeIds.output2,
    type: "workflow",
    position: { x: 1500, y: 300 },
    data: defaultWorkflowStepData({
      handles: { target: true, source: true },
      label: "Error Path",
      description: "Handle error case",
      content: "78 records failed validation (6.3%)",
      footer: "Next: Queue for review",
    }),
  },
  {
    id: nodeIds.process2,
    type: "workflow",
    position: { x: 2000, y: 0 },
    data: defaultWorkflowStepData({
      handles: { target: true, source: false },
      label: "Complete",
      description: "Finalize workflow",
      content: "All records processed and routed successfully",
      footer: "Total time: 4.2s",
    }),
  },
  {
    id: nodeIds.textBlock,
    type: "textBlock",
    position: { x: 600, y: -250 },
    data: defaultTextBlockData({
      title: "Creative brief",
      placeholder: "Outline the project scope and key messaging",
      showSuggestions: true,
    }),
  },
  {
    id: nodeIds.attribute,
    type: "attribute",
    position: { x: 600, y: 250 },
    data: defaultAttributeNodeData({
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
    }),
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

const WorkflowStepNode = memo(({ id, data }: NodeProps<WorkflowStepNodeData>) => (
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
}: NodeProps<TextBlockNodeData>) => {
  const { handles: _handles, ...cardProps } = data;
  void _handles;

  return <TextBlockCard {...cardProps} data-id={id} isSelected={selected} />;
});

const AttributeWorkflowNode = memo(({
  id,
  data,
  selected,
}: NodeProps<AttributeNodeData>) => {
  const { handles: _handles, ...attributeProps } = data;
  void _handles;

  return (
    <AttributeNode {...attributeProps} data-id={id} isSelected={selected} />
  );
});

const nodeTypes = {
  workflow: WorkflowStepNode,
  textBlock: TextBlockWorkflowNode,
  attribute: AttributeWorkflowNode,
};

const edgeTypes = {
  animated: WorkflowEdgeComponent.Animated,
  temporary: WorkflowEdgeComponent.Temporary,
};

type NodeLibraryPanelProps = {
  onDragStart: (event: DragEvent<HTMLDivElement>, nodeType: string) => void;
  onAddNode: () => void;
};

const NodeLibraryPanel = ({
  onDragStart,
  onAddNode,
}: NodeLibraryPanelProps) => (
  <Panel position="center-left" className="ml-4 w-52 space-y-3 p-3">
    <div>
      <h3 className="text-sm font-semibold">Node library</h3>
      <p className="text-xs text-muted-foreground">Drag onto the canvas</p>
    </div>
    <div
      draggable
      onDragStart={(event) => onDragStart(event, "workflow")}
      className="cursor-grab rounded-md border bg-muted p-2 text-sm shadow-sm transition-colors hover:bg-muted/70"
    >
      Workflow step
    </div>
    <div
      draggable
      onDragStart={(event) => onDragStart(event, "textBlock")}
      className="cursor-grab rounded-md border bg-muted p-2 text-sm shadow-sm transition-colors hover:bg-muted/70"
    >
      Text Block
    </div>
    <div
      draggable
      onDragStart={(event) => onDragStart(event, "attribute")}
      className="cursor-grab rounded-md border bg-muted p-2 text-sm shadow-sm transition-colors hover:bg-muted/70"
    >
      Attribute Node
    </div>
    <Button size="sm" className="w-full" onClick={onAddNode}>
      Add to center
    </Button>
  </Panel>
);

const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<WorkflowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlow = useReactFlow();
  const flowWrapperRef = useRef<HTMLDivElement>(null);

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
        let newNode: WorkflowNode;

        if (nodeType === "textBlock") {
          newNode = {
            id: nanoid(),
            type: nodeType,
            position,
            data: defaultTextBlockData(),
          };
        } else if (nodeType === "attribute") {
          newNode = {
            id: nanoid(),
            type: nodeType,
            position,
            data: defaultAttributeNodeData(),
          };
        } else {
          newNode = {
            id: nanoid(),
            type: nodeType,
            position,
            data: defaultWorkflowStepData({
              label: `New Step ${nds.length + 1}`,
            }),
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

  const handleAddNode = useCallback(() => {
    if (!flowWrapperRef.current) {
      return;
    }

    const bounds = flowWrapperRef.current.getBoundingClientRect();
    const centerPosition = reactFlow.screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    });

    setNodes((nds) => [
      ...nds,
      {
        id: nanoid(),
        type: "workflow",
        position: centerPosition,
        data: defaultWorkflowStepData({
          label: `New Step ${nds.length + 1}`,
          description: "Added from panel",
          content: "Start connecting this step to build out the workflow.",
        }),
      },
    ]);
  }, [reactFlow, setNodes]);

  return (
    <div ref={flowWrapperRef} className="h-full w-full">
      <Canvas
        className="h-full w-full"
        connectionLineComponent={Connection}
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
      >
        <Panel position="top-left" className="space-y-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Workflow controls</h2>
            <ThemeToggle />
          </div>
          <Actions>
            <Action
              tooltip="Fit view to canvas"
              label="Fit view"
              onClick={() => reactFlow.fitView()}
            >
              <Maximize2 className="size-4" />
            </Action>
            <Action
              tooltip="Zoom in"
              label="Zoom in"
              onClick={() => reactFlow.zoomIn()}
            >
              <ZoomIn className="size-4" />
            </Action>
            <Action
              tooltip="Zoom out"
              label="Zoom out"
              onClick={() => reactFlow.zoomOut()}
            >
              <ZoomOut className="size-4" />
            </Action>
            <Action
              tooltip="Reset zoom"
              label="Reset zoom"
              onClick={() => {
                reactFlow.setZoom(1);
                reactFlow.setCenter(0, 0);
              }}
            >
              <RotateCcw className="size-4" />
            </Action>
          </Actions>
        </Panel>
        <Panel position="bottom-left" className="m-4">
          <BottomLeftPromptInput />
        </Panel>
        <NodeLibraryPanel
          onAddNode={handleAddNode}
          onDragStart={handleDragStart}
        />
      </Canvas>
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
