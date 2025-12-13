import { AgenticFleetNode, AgenticFleetEdge, PhaseNode } from './types';

const TIER_HEIGHT = 200;
// All nodes default to w-[320px] via BaseNode, except Task which is w-64 (256px)
const DEFAULT_WIDTH = 320;
const TASK_WIDTH = 256;

const NODE_WIDTHS = {
  config: DEFAULT_WIDTH,
  dspy_module: DEFAULT_WIDTH,
  phase: DEFAULT_WIDTH,
  strategy: DEFAULT_WIDTH,
  agent: DEFAULT_WIDTH,
  tool: DEFAULT_WIDTH,
  task: TASK_WIDTH,
};

const TIER_Y_OFFSETS = {
  config: 0,
  dspy_module: 300,
  phase: 700,
  strategy: 1100,
  agent: 1500,
  tool: 1950,
  task: 1950,
};

const PHASE_ORDER = ['Analysis', 'Routing', 'Execution', 'Progress', 'Quality'];

export const getLayoutedElements = (
  nodes: AgenticFleetNode[],
  edges: AgenticFleetEdge[]
): { nodes: AgenticFleetNode[]; edges: AgenticFleetEdge[] } => {
  const nodesByType: Record<string, AgenticFleetNode[]> = {
    config: [],
    dspy_module: [],
    phase: [],
    strategy: [],
    agent: [],
    tool: [],
    task: [],
  };

  nodes.forEach((node) => {
    if (nodesByType[node.type]) {
      nodesByType[node.type].push(node);
    } else {
      // Fallback for unknown types if any
      if (!nodesByType.task) nodesByType.task = [];
      nodesByType.task.push(node);
    }
  });

  // Sort phases
  if (nodesByType.phase) {
    nodesByType.phase.sort((a, b) => {
      // We know these are PhaseNodes because of the key
      const phaseA = a as PhaseNode;
      const phaseB = b as PhaseNode;
      const idxA = PHASE_ORDER.indexOf(phaseA.data.name);
      const idxB = PHASE_ORDER.indexOf(phaseB.data.name);
      return idxA - idxB;
    });
  }

  const layoutedNodes: AgenticFleetNode[] = [];

  Object.entries(nodesByType).forEach(([type, tierNodes]) => {
    if (!tierNodes || tierNodes.length === 0) return;

    const tierY = TIER_Y_OFFSETS[type as keyof typeof TIER_Y_OFFSETS] || 0;
    const nodeWidth = NODE_WIDTHS[type as keyof typeof NODE_WIDTHS] || DEFAULT_WIDTH;
    const spacingX = 80; // Increased gap between nodes

    const totalWidth = tierNodes.length * nodeWidth + (tierNodes.length - 1) * spacingX;
    const startX = -totalWidth / 2;

    tierNodes.forEach((node, index) => {
      // Calculate position (centering the node)
      // startX + index * stride.
      // React Flow anchors top-left.
      const leftX = startX + index * (nodeWidth + spacingX);

      const y = tierY;

      layoutedNodes.push({
        ...node,
        position: { x: leftX, y },
        draggable: false, // Enforce layout
      });
    });
  });

  return { nodes: layoutedNodes, edges };
};
