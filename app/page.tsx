"use client"

import React, { memo, useCallback, useRef, useState, useMemo, type DragEvent } from "react"
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
} from "@xyflow/react"
import { Canvas } from "@/components/ai-elements/canvas"
import { Connection as ConnectionLine } from "@/components/ai-elements/connection"
import { TemporaryEdge, AnimatedEdge } from "@/components/ai-elements/edge"
import { EdgeNodeDropdown } from "@/components/workflow-builder/edge-node-dropdown"
import { Node, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node"
import { Toolbar } from "@/components/ai-elements/toolbar"
import { TextBlockCard } from "@/components/ai-elements/text-block-card"
import { AttributeNode } from "@/components/ai-elements/attribute-node"
import { Action, Actions } from "@/components/ai-elements/actions"
import { Pencil, Trash2 } from "lucide-react"
import { nanoid } from "nanoid"

// Import executor node components
import { ExecutorNode } from "@/components/ai-elements/executors/executor-node"
import { FunctionExecutorNode } from "@/components/ai-elements/executors/function-executor-node"
import { AgentExecutorNode } from "@/components/ai-elements/executors/agent-executor-node"
import { WorkflowExecutorNode } from "@/components/ai-elements/executors/workflow-executor-node"
import { RequestInfoExecutorNode } from "@/components/ai-elements/executors/request-info-executor-node"

// Import edge group components
import { FanInNode } from "@/components/ai-elements/edge-groups/fan-in-node"
import type { FanInNodeData } from "@/components/ai-elements/edge-groups/fan-in-node"
import { FanOutNode } from "@/components/ai-elements/edge-groups/fan-out-node"
import type { FanOutNodeData } from "@/components/ai-elements/edge-groups/fan-out-node"
import { SwitchCaseNode } from "@/components/ai-elements/edge-groups/switch-case-node"
import type { SwitchCaseNodeData } from "@/components/ai-elements/edge-groups/switch-case-node"

// Import workflow builder components
import { NodeLibrary } from "@/components/workflow-builder/node-library"
import { PropertiesPanel } from "@/components/workflow-builder/properties-panel"
import { ExportDialog } from "@/components/workflow-builder/export-dialog"
import { ImportDialog } from "@/components/workflow-builder/import-dialog"
import { TopNavigation } from "@/components/workflow-builder/top-navigation"
import { BottomControls } from "@/components/workflow-builder/bottom-controls"

// Import types and utilities
import type { AttributeNodeData, TextBlockNodeData, WorkflowStepNodeData } from "@/lib/workflow/types"
import { defaultAttributeNodeData, defaultTextBlockData, defaultWorkflowStepData } from "@/lib/workflow/types"
import type { WorkflowReactFlowNode, WorkflowNodeDataWithIndex } from "@/lib/workflow/conversion"
import {
  reactFlowToWorkflow,
  createExecutorFromNodeType,
  createNodeDataFromExecutorType,
} from "@/lib/workflow/conversion"
import type { FanInEdgeGroup, FanOutEdgeGroup, SwitchCaseEdgeGroup } from "@/lib/workflow/edges"
import type { ExecutorType } from "@/lib/workflow/executors"
import { MAGENTIC_AGENT_PRESETS } from "@/lib/workflow/magentic-presets"
import type { MagenticAgentPresetKey } from "@/lib/workflow/magentic-presets"
import type { BaseExecutor } from "@/lib/workflow/types"

type WorkflowNode = WorkflowReactFlowNode
type WorkflowEdge = Edge

const nodeIds = {
  start: "start",
  process1: "process1",
  process2: "process2",
  decision: "decision",
  output1: "output1",
  output2: "output2",
  textBlock: "textBlock",
  attribute: "attribute",
}

const initialNodes: WorkflowNode[] = [
  {
    id: nodeIds.start,
    type: "workflow",
    position: { x: 0, y: 0 },
    data: {
      ...defaultWorkflowStepData({
        handles: { target: false, source: true },
        label: "Start",
        description: "Initialize workflow",
        content: "Triggered by user action at 09:30 AM",
        footer: "Status: Ready",
      }),
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.process1,
    type: "workflow",
    position: { x: 500, y: 0 },
    data: {
      ...defaultWorkflowStepData({
        handles: { target: true, source: true },
        label: "Process Data",
        description: "Transform input",
        content: "Validating 1,234 records and applying business rules",
        footer: "Duration: ~2.5s",
      }),
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.decision,
    type: "workflow",
    position: { x: 1000, y: 0 },
    data: {
      ...defaultWorkflowStepData({
        handles: { target: true, source: true },
        label: "Decision Point",
        description: "Route based on conditions",
        content: "Evaluating: data.status === 'valid' && data.score > 0.8",
        footer: "Confidence: 94%",
      }),
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.output1,
    type: "workflow",
    position: { x: 1500, y: -300 },
    data: {
      ...defaultWorkflowStepData({
        handles: { target: true, source: true },
        label: "Success Path",
        description: "Handle success case",
        content: "1,156 records passed validation (93.7%)",
        footer: "Next: Send to production",
      }),
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.output2,
    type: "workflow",
    position: { x: 1500, y: 300 },
    data: {
      ...defaultWorkflowStepData({
        handles: { target: true, source: true },
        label: "Error Path",
        description: "Handle error case",
        content: "78 records failed validation (6.3%)",
        footer: "Next: Queue for review",
      }),
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.process2,
    type: "workflow",
    position: { x: 2000, y: 0 },
    data: {
      ...defaultWorkflowStepData({
        handles: { target: true, source: false },
        label: "Complete",
        description: "Finalize workflow",
        content: "All records processed and routed successfully",
        footer: "Total time: 4.2s",
      }),
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.textBlock,
    type: "textBlock",
    position: { x: 600, y: -250 },
    data: {
      ...defaultTextBlockData({
        title: "Creative brief",
        placeholder: "Outline the project scope and key messaging",
        showSuggestions: true,
      }),
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
  {
    id: nodeIds.attribute,
    type: "attribute",
    position: { x: 600, y: 250 },
    data: {
      ...defaultAttributeNodeData({
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
      ...{},
    } as WorkflowNodeDataWithIndex,
  },
]

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
]

type EdgeGroupNodeType = "fan-in" | "fan-out" | "switch-case"

const isEdgeGroupNodeType = (nodeType: string): nodeType is EdgeGroupNodeType => {
  return nodeType === "fan-in" || nodeType === "fan-out" || nodeType === "switch-case"
}

const parseNodeTypeToken = (value: string): { baseType: string; presetKey?: MagenticAgentPresetKey } => {
  const [baseType, preset] = value.split(":")
  return {
    baseType,
    presetKey: preset as MagenticAgentPresetKey | undefined,
  }
}

function createDefaultFanInGroup(id: string): FanInEdgeGroup {
  return {
    id,
    type: "fan-in",
    sources: [],
    target: "",
    edges: [],
  }
}

function createDefaultFanOutGroup(id: string): FanOutEdgeGroup {
  return {
    id,
    type: "fan-out",
    source: "",
    targets: [],
    edges: [],
    broadcastMode: "parallel",
  }
}

function createDefaultSwitchCaseGroup(id: string): SwitchCaseEdgeGroup {
  return {
    id,
    type: "switch-case",
    source: "",
    cases: [],
    switchExpression: "message.type",
  }
}

function createEdgeGroupNode(nodeType: EdgeGroupNodeType, position: XYPosition): WorkflowReactFlowNode {
  const id = `${nodeType}-${nanoid()}`

  if (nodeType === "fan-in") {
    const group = createDefaultFanInGroup(id)
    const data: FanInNodeData = {
      variant: "fan-in",
      handles: {
        target: true,
        source: true,
        sourceCount: group.sources.length,
      },
      group,
    }
    return {
      id,
      type: nodeType,
      position,
      data: data as WorkflowNodeDataWithIndex,
    }
  }

  if (nodeType === "fan-out") {
    const group = createDefaultFanOutGroup(id)
    const data: FanOutNodeData = {
      variant: "fan-out",
      handles: {
        target: true,
        source: true,
        targetCount: group.targets.length,
      },
      group,
    }
    return {
      id,
      type: nodeType,
      position,
      data: data as WorkflowNodeDataWithIndex,
    }
  }

  const group = createDefaultSwitchCaseGroup(id)
  const data: SwitchCaseNodeData = {
    variant: "switch-case",
    handles: {
      target: true,
      source: true,
      caseCount: group.cases.length,
    },
    group,
  }
  return {
    id,
    type: nodeType,
    position,
    data: data as WorkflowNodeDataWithIndex,
  }
}

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
))

const TextBlockWorkflowNode = memo(
  ({ id, data, selected }: { id: string; data: TextBlockNodeData; selected?: boolean }) => {
    const { handles: _handles, ...cardProps } = data
    void _handles

    return <TextBlockCard {...cardProps} data-id={id} isSelected={selected} />
  },
)

const AttributeWorkflowNode = memo(
  ({ id, data, selected }: { id: string; data: AttributeNodeData; selected?: boolean }) => {
    const { handles: _handles, ...attributeProps } = data
    void _handles

    return <AttributeNode {...attributeProps} data-id={id} isSelected={selected} />
  },
)

const nodeTypes: Record<string, React.ComponentType<any>> = {
  // Legacy node types (kept for backward compatibility)
  workflow: WorkflowStepNode,
  textBlock: TextBlockWorkflowNode,
  attribute: AttributeWorkflowNode,
  // New executor node types
  executor: ExecutorNode,
  "function-executor": FunctionExecutorNode,
  "agent-executor": AgentExecutorNode,
  "magentic-agent-executor": AgentExecutorNode,
  "workflow-executor": WorkflowExecutorNode,
  "request-info-executor": RequestInfoExecutorNode,
  "magentic-orchestrator-executor": ExecutorNode,
  // Edge group node types
  "fan-in": FanInNode,
  "fan-out": FanOutNode,
  "switch-case": SwitchCaseNode,
}

// Create edge types with handlers
const createEdgeTypes = (
  onEdgeHover?: (edgeId: string, position: XYPosition, screenPosition: { x: number; y: number }) => void,
) => ({
  animated: (props: any) => (
    <AnimatedEdge
      {...props}
      onHover={
        onEdgeHover
          ? (pos: XYPosition, screenPos: { x: number; y: number }) => onEdgeHover(props.id, pos, screenPos)
          : undefined
      }
    />
  ),
  temporary: TemporaryEdge,
})



const WorkflowCanvas = () => {
  const [nodes, setNodes] = useNodesState(initialNodes as any)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const reactFlow = useReactFlow()
  const flowWrapperRef = useRef<HTMLDivElement>(null)

  // State management for new features
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode<WorkflowNodeDataWithIndex> | null>(null)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)

  // Undo/Redo history management
  const [history, setHistory] = useState<Array<{ nodes: any[]; edges: Edge[] }>>([
    { nodes: initialNodes as any[], edges: initialEdges },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Save state to history
  const saveToHistory = useCallback(
    (newNodes: any[], newEdges: Edge[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push({ nodes: JSON.parse(JSON.stringify(newNodes)), edges: JSON.parse(JSON.stringify(newEdges)) })
        return newHistory.slice(-50) // Keep last 50 states
      })
      setHistoryIndex((prev) => Math.min(prev + 1, 49))
    },
    [historyIndex],
  )

  // Convert React Flow state to Workflow format
  const currentWorkflow = useMemo(() => {
    return reactFlowToWorkflow(nodes as any, edges, "workflow-1", "Agentic Fabric")
  }, [nodes, edges])

  // Handle node selection - wrapper to sync selected node state
  const handleNodesChangeWrapper = useCallback(
    (changes: NodeChange[]) => {
      const nextNodes = applyNodeChanges(changes, nodes)
      setNodes(nextNodes)

      const significantChanges = changes.filter((change) => change.type !== "select" && change.type !== "position")
      if (significantChanges.length > 0 && !draggedNodeId) {
        saveToHistory(nextNodes, edges)
      }

      if (selectedNode) {
        const updated = nextNodes.find((node) => node.id === selectedNode.id)
        setSelectedNode(updated ? (updated as ReactFlowNode<WorkflowNodeDataWithIndex>) : null)
      }
    },
    [nodes, selectedNode, setNodes, edges, saveToHistory, draggedNodeId],
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge({ ...connection, type: "animated" }, eds)
        saveToHistory(nodes, newEdges)
        return newEdges
      })
    },
    [setEdges, nodes, saveToHistory],
  )

  // Handle inserting node on edge
  const [edgeDropdownState, setEdgeDropdownState] = useState<{
    edgeId: string
    position: XYPosition
    screenPosition: { x: number; y: number }
  } | null>(null)

  const handleEdgeHover = useCallback(
    (edgeId: string, position: XYPosition, screenPosition: { x: number; y: number }) => {
      setEdgeDropdownState({
        edgeId,
        position,
        screenPosition,
      })
    },
    [],
  )

  const handleInsertNodeOnEdge = useCallback(
    (nodeType: string) => {
      if (!edgeDropdownState) return

      const edge = edges.find((e) => e.id === edgeDropdownState.edgeId)
      if (!edge) {
        setEdgeDropdownState(null)
        return
      }

      const position = edgeDropdownState.position
      const { baseType, presetKey } = parseNodeTypeToken(nodeType)

      // Create new node
      setNodes((nds) => {
        let newNode: ReactFlowNode<WorkflowNodeDataWithIndex>

        if (isEdgeGroupNodeType(baseType)) {
          newNode = createEdgeGroupNode(baseType, position)
        } else {
          const executorId = nanoid()
          const preset = presetKey ? MAGENTIC_AGENT_PRESETS.find((item) => item.key === presetKey) : undefined
          const executor = createExecutorFromNodeType(baseType, executorId, preset?.label || `New ${baseType}`, {
            presetKey,
          })
          const nodeData = createNodeDataFromExecutorType(baseType as ExecutorType, executor)

          newNode = {
            id: executorId,
            type: baseType,
            position,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          }
        }

        const newNodes = [...nds, newNode]

        // Split edge: remove old edge, add two new edges
        setEdges((eds) => {
          const filtered = eds.filter((e) => e.id !== edgeDropdownState.edgeId)
          const newEdges = [
            ...filtered,
            { id: nanoid(), source: edge.source, target: newNode.id, type: "animated" },
            { id: nanoid(), source: newNode.id, target: edge.target, type: "animated" },
          ]
          // Save to history after all changes
          saveToHistory(newNodes, newEdges)
          return newEdges
        })

        return newNodes
      })

      setEdgeDropdownState(null)
    },
    [edgeDropdownState, edges, setNodes, setEdges, saveToHistory],
  )

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const nodeType = event.dataTransfer.getData("application/reactflow")
      if (!nodeType) {
        return
      }

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      setNodes((nds) => {
        let newNode: ReactFlowNode<WorkflowNodeDataWithIndex>
        const { baseType, presetKey } = parseNodeTypeToken(nodeType)

        if (baseType === "textBlock") {
          newNode = {
            id: nanoid(),
            type: baseType,
            position,
            data: { ...defaultTextBlockData(), ...{} } as WorkflowNodeDataWithIndex,
          }
        } else if (baseType === "attribute") {
          newNode = {
            id: nanoid(),
            type: baseType,
            position,
            data: { ...defaultAttributeNodeData(), ...{} } as WorkflowNodeDataWithIndex,
          }
        } else if (baseType === "workflow") {
          newNode = {
            id: nanoid(),
            type: baseType,
            position,
            data: {
              ...defaultWorkflowStepData({
                label: `New Step ${nds.length + 1}`,
              }),
              ...{},
            } as WorkflowNodeDataWithIndex,
          }
        } else if (isEdgeGroupNodeType(baseType)) {
          newNode = createEdgeGroupNode(baseType, position)
        } else {
          const executorId = nanoid()
          const preset = presetKey ? MAGENTIC_AGENT_PRESETS.find((item) => item.key === presetKey) : undefined
          const executor = createExecutorFromNodeType(baseType, executorId, preset?.label || `New ${baseType}`, {
            presetKey,
          })
          const nodeData = createNodeDataFromExecutorType(baseType as ExecutorType, executor)

          newNode = {
            id: executorId,
            type: baseType,
            position,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          }
        }

        const newNodes = [...nds, newNode]
        saveToHistory(newNodes, edges)
        return newNodes
      })
    },
    [reactFlow, setNodes, edges, saveToHistory],
  )

  const handleDragStart = useCallback((event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }, [])

  const handleAddNode = useCallback(
    (nodeType = "executor") => {
      if (!flowWrapperRef.current) {
        return
      }

      const bounds = flowWrapperRef.current.getBoundingClientRect()
      const centerPosition = reactFlow.screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      })

      setNodes((nds) => {
        let newNode: ReactFlowNode<WorkflowNodeDataWithIndex>
        const { baseType, presetKey } = parseNodeTypeToken(nodeType)

        if (baseType === "workflow") {
          newNode = {
            id: nanoid(),
            type: baseType,
            position: centerPosition,
            data: {
              ...defaultWorkflowStepData({
                label: `New Step ${nds.length + 1}`,
                description: "Added from panel",
                content: "Start connecting this step to build out the workflow.",
              }),
              ...{},
            } as WorkflowNodeDataWithIndex,
          }
        } else if (isEdgeGroupNodeType(baseType)) {
          newNode = createEdgeGroupNode(baseType, centerPosition)
        } else {
          const executorId = nanoid()
          const preset = presetKey ? MAGENTIC_AGENT_PRESETS.find((item) => item.key === presetKey) : undefined
          const executor = createExecutorFromNodeType(baseType, executorId, preset?.label || `New ${baseType}`, {
            presetKey,
          })
          const nodeData = createNodeDataFromExecutorType(baseType as ExecutorType, executor)

          newNode = {
            id: executorId,
            type: baseType,
            position: centerPosition,
            data: { ...nodeData, ...{} } as WorkflowNodeDataWithIndex,
          }
        }

        const newNodes = [...nds, newNode]
        saveToHistory(newNodes, edges)
        return newNodes
      })
    },
    [reactFlow, setNodes, edges, saveToHistory],
  )

  const handleAddMagenticScaffold = useCallback(() => {
    if (!flowWrapperRef.current) {
      return
    }

    const bounds = flowWrapperRef.current.getBoundingClientRect()
    const centerPosition = reactFlow.screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    })

    const currentNodes = reactFlow.getNodes() as ReactFlowNode<WorkflowNodeDataWithIndex>[]
    const currentEdges = reactFlow.getEdges()

    const findPresetKey = (node: ReactFlowNode<WorkflowNodeDataWithIndex>) => {
      const executor = (node.data as any)?.executor as BaseExecutor | undefined
      const metadata = (executor?.metadata as any)?.magentic
      return metadata?.presetKey ?? metadata?.preset ?? undefined
    }

    let orchestratorNode = currentNodes.find((node) => node.type === "magentic-orchestrator-executor")
    if (!orchestratorNode) {
      const orchestratorId = nanoid()
      const orchestratorExecutor = createExecutorFromNodeType(
        "magentic-orchestrator-executor",
        orchestratorId,
        "Magentic Orchestrator",
      )
      orchestratorNode = {
        id: orchestratorId,
        type: "magentic-orchestrator-executor",
        position: centerPosition,
        data: {
          ...createNodeDataFromExecutorType("magentic-orchestrator-executor", orchestratorExecutor),
        } as WorkflowNodeDataWithIndex,
      }
    }

    const orchestratorId = orchestratorNode.id
    const origin = orchestratorNode.position ?? centerPosition

    const radius = 280
    const presets = MAGENTIC_AGENT_PRESETS
    const angleStep = presets.length ? (Math.PI * 2) / presets.length : 0
    const nextNodesMap = new Map<string, ReactFlowNode<WorkflowNodeDataWithIndex>>()
    currentNodes.forEach((node) => nextNodesMap.set(node.id, { ...node }))
    nextNodesMap.set(orchestratorNode.id, { ...orchestratorNode, position: origin })

    const agentNodes: ReactFlowNode<WorkflowNodeDataWithIndex>[] = presets.map((preset, index) => {
      const angle = angleStep * index
      const targetPosition = {
        x: origin.x + radius * Math.cos(angle),
        y: origin.y + radius * Math.sin(angle),
      }

      const existing = [...nextNodesMap.values()].find(
        (node) => node.type === "magentic-agent-executor" && findPresetKey(node) === preset.key,
      )

      if (existing) {
        const executor = (existing.data as any)?.executor as BaseExecutor | undefined
        const updatedExecutor = executor
          ? {
              ...executor,
              metadata: {
                ...(executor.metadata || {}),
                magentic: {
                  presetKey: preset.key,
                  capabilities: preset.capabilities,
                },
                source: "agent-framework",
              },
              capabilities: preset.capabilities,
              systemPrompt: preset.systemPrompt,
              label: preset.label,
              description: preset.description,
              tools: preset.toolIds?.map((toolId) => ({ toolId, enabled: true })),
            }
          : undefined

        const updatedNode = {
          ...existing,
          position: targetPosition,
          data: {
            ...(existing.data as WorkflowNodeDataWithIndex),
            executor: updatedExecutor ?? (existing.data as any).executor,
            label: preset.label,
            description: preset.description,
          },
        } as ReactFlowNode<WorkflowNodeDataWithIndex>
        nextNodesMap.set(updatedNode.id, updatedNode)
        return updatedNode
      }

      const agentId = nanoid()
      const agentExecutor = createExecutorFromNodeType("magentic-agent-executor", agentId, preset.label, {
        presetKey: preset.key,
      })

      const newNode: ReactFlowNode<WorkflowNodeDataWithIndex> = {
        id: agentId,
        type: "magentic-agent-executor",
        position: targetPosition,
        data: {
          ...createNodeDataFromExecutorType("magentic-agent-executor", agentExecutor),
        } as WorkflowNodeDataWithIndex,
      }

      nextNodesMap.set(agentId, newNode)
      return newNode
    })

    const nextEdges = [...currentEdges]
    const ensureEdge = (source: string, target: string) => {
      if (!nextEdges.some((edge) => edge.source === source && edge.target === target)) {
        nextEdges.push({ id: nanoid(), source, target, type: "animated" })
      }
    }

    agentNodes.forEach((agentNode) => {
      ensureEdge(orchestratorId, agentNode.id)
      ensureEdge(agentNode.id, orchestratorId)
    })

    setNodes(Array.from(nextNodesMap.values()))
    setEdges(nextEdges)
  }, [MAGENTIC_AGENT_PRESETS, reactFlow, setEdges, setNodes])

  // Handle node update from properties panel
  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<BaseExecutor>) => {
      let updatedNode: ReactFlowNode<WorkflowNodeDataWithIndex> | null = null

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId && isExecutorNode(node as ReactFlowNode<WorkflowNodeDataWithIndex>)) {
            const currentData = node.data as any
            if (currentData.executor) {
              const updatedExecutor = { ...currentData.executor, ...updates }
              const nextNode: ReactFlowNode<WorkflowNodeDataWithIndex> = {
                ...node,
                data: {
                  ...currentData,
                  executor: updatedExecutor,
                  label: updates.label ?? currentData.label,
                  description: updates.description ?? currentData.description,
                },
              }
              updatedNode = nextNode
              return nextNode
            }
          }
          return node
        }),
      )

      if (selectedNode?.id === nodeId) {
        setSelectedNode(updatedNode ?? null)
      }
    },
    [setNodes, selectedNode],
  )

  // Check if node is an executor node
  const isExecutorNode = (node: ReactFlowNode<WorkflowNodeDataWithIndex>): boolean => {
    const data = node.data as any
    return (
      data?.variant === "executor" ||
      data?.variant === "function-executor" ||
      data?.variant === "agent-executor" ||
      data?.variant === "workflow-executor" ||
      data?.variant === "request-info-executor"
    )
  }

  // Handle node selection
  const handleNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNode(node as ReactFlowNode<WorkflowNodeDataWithIndex>)
  }, [])

  // Handle workflow import
  const handleImport = useCallback(
    (importedNodes: any[], importedEdges: Edge[]) => {
      setNodes(importedNodes as any)
      setEdges(importedEdges)
      reactFlow.fitView()
    },
    [setNodes, setEdges, reactFlow],
  )

  const handleEvaluate = useCallback(() => {
    // TODO: Implement evaluate functionality
    console.log("Evaluate workflow")
  }, [])

  const handleCode = useCallback(() => {
    // TODO: Implement code view functionality
    console.log("Show code")
  }, [])

  const handlePreview = useCallback(() => {
    // TODO: Implement preview functionality
    console.log("Preview workflow")
  }, [])

  const handlePublish = useCallback(() => {
    // TODO: Implement publish functionality
    console.log("Publish workflow")
  }, [])

  const handleNodeDragStart = useCallback((_event: React.MouseEvent, node: ReactFlowNode) => {
    setDraggedNodeId(node.id)
  }, [])

  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: ReactFlowNode) => {
      if (!draggedNodeId) return

      // Find if the dragged node overlaps with any other node
      const draggedNode = nodes.find((n) => n.id === draggedNodeId)
      if (!draggedNode) {
        setDraggedNodeId(null)
        return
      }

      // Check for overlapping nodes (excluding the dragged node itself)
      const overlappingNode = nodes.find((n) => {
        if (n.id === draggedNodeId) return false

        // Calculate node bounds (assuming standard node dimensions)
        const nodeWidth = 300
        const nodeHeight = 200

        const draggedBounds = {
          left: draggedNode.position.x,
          right: draggedNode.position.x + nodeWidth,
          top: draggedNode.position.y,
          bottom: draggedNode.position.y + nodeHeight,
        }

        const targetBounds = {
          left: n.position.x,
          right: n.position.x + nodeWidth,
          top: n.position.y,
          bottom: n.position.y + nodeHeight,
        }

        // Check for overlap
        return !(
          draggedBounds.right < targetBounds.left ||
          draggedBounds.left > targetBounds.right ||
          draggedBounds.bottom < targetBounds.top ||
          draggedBounds.top > targetBounds.bottom
        )
      })

      if (overlappingNode) {
        // Reposition the dragged node near the overlapping node
        const offset = 350 // Distance to place the node
        const angle = Math.atan2(
          draggedNode.position.y - overlappingNode.position.y,
          draggedNode.position.x - overlappingNode.position.x,
        )

        const newPosition = {
          x: overlappingNode.position.x + Math.cos(angle) * offset,
          y: overlappingNode.position.y + Math.sin(angle) * offset,
        }

        setNodes((nds) => {
          const updatedNodes = nds.map((n) => (n.id === draggedNodeId ? { ...n, position: newPosition } : n))
          saveToHistory(updatedNodes, edges)
          return updatedNodes
        })
      } else {
        // Save position change to history even if no overlap
        saveToHistory(nodes, edges)
      }

      setDraggedNodeId(null)
    },
    [draggedNodeId, nodes, edges, setNodes, saveToHistory],
  )

  return (
    <div className="relative h-full w-full">
      <TopNavigation
        projectName={currentWorkflow.name || "MCP Draft"}
        projectStatus={currentWorkflow.metadata?.custom?.status as string | undefined}
        workflow={currentWorkflow}
        onEvaluate={handleEvaluate}
        onCode={handleCode}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onValidate={() => {
          // TODO: Implement validation view/panel
          console.log("Validate workflow")
        }}
      />
      <div ref={flowWrapperRef} className="absolute inset-0 w-full h-full overflow-hidden">
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
            setSelectedNode(null)
            setEdgeDropdownState(null)
          }}
          panOnDrag={[1]}
          nodesDraggable={!locked}
          selectionOnDrag={false}
          edgeTypes={createEdgeTypes(handleEdgeHover)}
          onNodeDragStart={handleNodeDragStart}
          onNodeDragStop={handleNodeDragStop}
        >
          <NodeLibrary
            onAddNode={handleAddNode}
            onDragStart={handleDragStart}
            onAddMagenticScaffold={handleAddMagenticScaffold}
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
                type: selectedNode.type || "executor",
                data: selectedNode.data as any,
              }}
            onUpdate={(nodeId, updates) => {
              if (locked) return
              handleNodeUpdate(nodeId, updates)
            }}
            onDelete={(nodeId) => {
              if (locked) return
              setNodes((nds) => {
                const newNodes = nds.filter((n) => n.id !== nodeId)
                saveToHistory(newNodes, edges)
                return newNodes
              })
              if (selectedNode?.id === nodeId) {
                setSelectedNode(null)
              }
            }}
            onDuplicate={(nodeId) => {
              if (locked) return
              const nodeToDuplicate = nodes.find((n) => n.id === nodeId)
              if (nodeToDuplicate) {
                const newId = nanoid()
                const duplicatedNode = {
                  ...nodeToDuplicate,
                  id: newId,
                  position: {
                    x: nodeToDuplicate.position.x + 50,
                    y: nodeToDuplicate.position.y + 50,
                  },
                }
                setNodes((nds) => {
                  const newNodes = [...nds, duplicatedNode]
                  saveToHistory(newNodes, edges)
                  return newNodes
                })
              }
            }}
              onEvaluate={(nodeId) => {
                // TODO: Implement node evaluation
                console.log("Evaluate node", nodeId)
              }}
            />
          )}
          <BottomControls
            onUndo={() => {
              if (canUndo) {
                const newIndex = historyIndex - 1
                setHistoryIndex(newIndex)
                const state = history[newIndex]
                setNodes(state.nodes as any)
                setEdges(state.edges)
              }
            }}
            onRedo={() => {
              if (canRedo) {
                const newIndex = historyIndex + 1
                setHistoryIndex(newIndex)
                const state = history[newIndex]
                setNodes(state.nodes as any)
                setEdges(state.edges)
              }
            }}
            canUndo={canUndo}
            canRedo={canRedo}
            onFitView={() => {
              try {
                reactFlow.fitView()
              } catch {}
            }}
            locked={locked}
            onToggleLock={() => setLocked((v) => !v)}
          />
        </Canvas>
        <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} workflow={currentWorkflow} />
        <ImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImport={handleImport} />
      </div>
    </div>
  )
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-sm">Something went wrong.</div>
    }
    return this.props.children
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
)

export default Page
