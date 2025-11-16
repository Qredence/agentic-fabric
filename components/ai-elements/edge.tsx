'use client';

import React, { useMemo } from 'react';
import {
  BaseEdge,
  type EdgeProps,
  getBezierPath,
  type InternalNode,
  type Node,
  Position,
  useInternalNode,
  useReactFlow,
} from '@xyflow/react';
import { cn } from '@/lib/utils';

/**
 * Enhanced edge types with improved handle position calculation
 */

/**
 * Calculate handle coordinates based on node position and handle type
 * Automatically determines the best handle position and applies smart offsets
 */
const getHandleCoordsByPosition = (
  node: InternalNode<Node>,
  handlePosition: Position,
  handleType: 'source' | 'target' = handlePosition === Position.Left ? 'target' : 'source',
): [number, number] => {
  const handle = node.internals.handleBounds?.[handleType]?.find(
    (h) => h.position === handlePosition,
  );

  if (!handle) {
    // Fallback to node center if handle not found
    const bounds = node.internals.bounds;
    return [
      node.internals.positionAbsolute.x + (bounds?.width || 0) / 2,
      node.internals.positionAbsolute.y + (bounds?.height || 0) / 2,
    ];
  }

  // Smart offset calculation based on handle type and position
  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // Adjust offset based on handle position for proper connection alignment
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0; // Connect at the left edge
      break;
    case Position.Right:
      offsetX = handle.width; // Connect at the right edge
      break;
    case Position.Top:
      offsetY = 0; // Connect at the top edge
      break;
    case Position.Bottom:
      offsetY = handle.height; // Connect at the bottom edge
      break;
    default:
      // Use center if position is not recognized
      offsetX = handle.width / 2;
      offsetY = handle.height / 2;
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
};

/**
 * Get optimal edge parameters with automatic handle position detection
 */
const getEdgeParams = (source: InternalNode<Node>, target: InternalNode<Node>) => {
  // Automatically determine best handle positions
  // Default: source from right, target from left
  const sourcePos = Position.Right;
  const targetPos = Position.Left;

  const [sx, sy] = getHandleCoordsByPosition(source, sourcePos, 'source');
  const [tx, ty] = getHandleCoordsByPosition(target, targetPos, 'target');

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
};

/**
 * Temporary Edge Component
 * - Uses dashed lines with ring color
 * - Typically used for preview/connection states
 * - Smooth Bezier curve connection
 */
export const TemporaryEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
  style,
}: EdgeProps) => {
  // Try to use actual node positions if available for better accuracy
  const sourceNode = source ? useInternalNode(source) : null;
  const targetNode = target ? useInternalNode(target) : null;

  const edgePath = useMemo(() => {
    // Use calculated positions if nodes are available
    if (sourceNode && targetNode) {
      const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);
      const [path] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetX: tx,
        targetY: ty,
        targetPosition: targetPos,
      });
      return path;
    }

    // Fallback to provided coordinates
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: sourcePosition || Position.Right,
      targetX,
      targetY,
      targetPosition: targetPosition || Position.Left,
    });
    return path;
  }, [sourceNode, targetNode, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        strokeWidth: 2,
        stroke: (
          getComputedStyle(document.documentElement).getPropertyValue('--edge-color-secondary') ||
          '#7a7a7a'
        ).trim(),
        opacity: Number(
          getComputedStyle(document.documentElement).getPropertyValue('--edge-opacity-secondary') ||
            0.5,
        ),
        strokeDasharray: '8, 4',
        strokeLinecap: 'round',
        filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))',
        ...style,
      }}
    />
  );
};

/**
 * Animated Edge Component
 * - Includes a moving circle indicator along the path
 * - Smooth Bezier curve connection
 * - Automatically calculates optimal handle positions
 * - Visual indicator shows flow direction
 * - Interactive button on hover to add nodes
 */
export const AnimatedEdge = ({
  id,
  source,
  target,
  markerEnd,
  style,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  onHover,
}: EdgeProps & {
  onHover?: (position: { x: number; y: number }, screenPosition: { x: number; y: number }) => void;
}) => {
  const sourceNode = source ? useInternalNode(source) : null;
  const targetNode = target ? useInternalNode(target) : null;
  const [isHovered, setIsHovered] = React.useState(false);
  const reactFlow = useReactFlow();
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { edgePath, midPoint } = useMemo(() => {
    if (sourceNode && targetNode) {
      const params = getEdgeParams(sourceNode, targetNode);
      const [path] = getBezierPath({
        sourceX: params.sx,
        sourceY: params.sy,
        sourcePosition: params.sourcePos,
        targetX: params.tx,
        targetY: params.ty,
        targetPosition: params.targetPos,
      });

      // Calculate midpoint
      const midX = (params.sx + params.tx) / 2;
      const midY = (params.sy + params.ty) / 2;

      return {
        edgePath: path,
        midPoint: { x: midX, y: midY },
      };
    }

    // Fallback to provided coordinates
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: sourcePosition || Position.Right,
      targetX,
      targetY,
      targetPosition: targetPosition || Position.Left,
    });

    // Calculate midpoint
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    return {
      edgePath: path,
      midPoint: { x: midX, y: midY },
    };
  }, [sourceNode, targetNode, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]);

  if (!edgePath) {
    return null;
  }

  return (
    <>
      <BaseEdge
        id={id}
        markerEnd={markerEnd}
        path={edgePath}
        style={{
          strokeWidth: isHovered ? 3 : 2,
          stroke: (
            getComputedStyle(document.documentElement).getPropertyValue('--edge-color-primary') ||
            '#6b6b6b'
          ).trim(),
          opacity: isHovered
            ? Math.min(
                Number(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    '--edge-opacity-primary',
                  ) || 0.8,
                ) + 0.1,
                1,
              )
            : Number(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--edge-opacity-primary',
                ) || 0.8,
              ),
          transition: 'all 0.2s ease-out',
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn('cursor-pointer', isHovered && 'drop-shadow-lg')}
      />
      {!prefersReducedMotion && (
        <>
          <circle
            r="6"
            fill="hsl(var(--primary))"
            className="animate-pulse"
            opacity={isHovered ? 0.9 : 0.7}
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={edgePath}
              keyPoints="0;1"
              keyTimes="0;1"
            />
          </circle>
          <circle r="4" fill="hsl(var(--primary))" opacity={isHovered ? 0.6 : 0.4}>
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={edgePath}
              keyPoints="0.3;1.3"
              keyTimes="0;1"
              begin="0.5s"
            />
          </circle>
          <circle r="2" fill="hsl(var(--primary))" opacity={isHovered ? 0.4 : 0.2}>
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={edgePath}
              keyPoints="0.6;1.6"
              keyTimes="0;1"
              begin="1s"
            />
          </circle>
        </>
      )}
      {/* Interactive button in the middle - shown on hover */}
      {isHovered && midPoint && onHover && (
        <foreignObject
          x={midPoint.x - 16}
          y={midPoint.y - 16}
          width="32"
          height="32"
          className="pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            const screenPos = reactFlow.flowToScreenPosition(midPoint);
            onHover(midPoint, screenPos);
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary shadow-lg cursor-pointer hover:bg-primary/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </foreignObject>
      )}
    </>
  );
};

/**
 * Export edge components for use in edgeTypes configuration
 */
export const Edge = {
  temporary: TemporaryEdge,
  animated: AnimatedEdge,
};

// Type exports for TypeScript
export type TemporaryEdgeProps = EdgeProps;
export type AnimatedEdgeProps = EdgeProps;
