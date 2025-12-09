import { AgenticFleetNode, AgenticFleetEdge, PhaseNode } from './types';

const TIER_HEIGHT = 200;
const NODE_WIDTHS = {
  config: 320,
  dspy_module: 280,
  phase: 220,
  strategy: 250,
  agent: 280,
  tool: 230,
  task: 220,
};

const TIER_Y_OFFSETS = {
  config: 0,
  dspy_module: 200,
  phase: 450,
  strategy: 700,
  agent: 950,
  tool: 1250,
  task: 1250, // Tasks might float or be at bottom
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
    const nodeWidth = NODE_WIDTHS[type as keyof typeof NODE_WIDTHS] || 250;
    const spacingX = 50;

    const totalWidth = tierNodes.length * nodeWidth + (tierNodes.length - 1) * spacingX;
    const startX = -totalWidth / 2;

    tierNodes.forEach((node, index) => {
      // Calculate position
      const x = startX + index * (nodeWidth + spacingX);
      const y = tierY;

      layoutedNodes.push({
        ...node,
        position: { x, y },
        draggable: false, // Enforce layout
      });
    });
  });

  return { nodes: layoutedNodes, edges };
};
