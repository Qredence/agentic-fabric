import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Activity, Clock, Server } from 'lucide-react';
import { PhaseNode as PhaseNodeType } from '@/lib/agentic-fleet/types';
import { BaseNode, NodeProperty } from './base-node';
import { cn } from '@/lib/utils';

const statusColors = {
  pending: 'text-gray-400',
  running: 'text-blue-400',
  completed: 'text-green-400',
  failed: 'text-red-400',
};

export const PhaseNode = ({ data, selected }: NodeProps<PhaseNodeType>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" className="w-2 h-2" />
      <Handle type="target" position={Position.Left} id="prev" className="w-2 h-2" />

      <BaseNode
        title={data.name}
        icon={Activity}
        selected={selected}
        className={cn(data.status === 'running' && "ring-1 ring-blue-500/50")}
      >
        <NodeProperty
          value={data.executor}
          icon={Server}
        />

        <div className="flex justify-between items-center bg-[#2A2A2A] rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={cn("text-sm font-medium capitalize", statusColors[data.status])}>
              {data.status}
            </span>
          </div>
          {data.metrics && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">{data.metrics.duration_ms}ms</span>
              <span className="text-[10px] text-gray-500">{data.metrics.tokens_used} toks</span>
            </div>
          )}
        </div>
      </BaseNode>

      <Handle type="source" position={Position.Right} id="next" className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} id="strategy" className="w-2 h-2" />
    </>
  );
};
