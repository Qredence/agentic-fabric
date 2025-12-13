import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot, Wrench, Cpu, PlayCircle } from 'lucide-react';
import { AgentNode as AgentNodeType } from '@/lib/agentic-fleet/types';
import { BaseNode, NodeSection, NodePill, NodeProperty } from './base-node';
import { cn } from '@/lib/utils';

export const AgentNode = ({ data, selected }: NodeProps<AgentNodeType>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />

      <BaseNode
        title={data.name}
        icon={Bot}
        selected={selected}
        headerActions={
          <div className={cn("w-2 h-2 rounded-full mr-2",
            data.status === 'active' ? "bg-green-500 animate-pulse" :
            data.status === 'waiting' ? "bg-amber-500" : "bg-gray-500"
          )} />
        }
      >
        <NodeProperty value={data.role} icon={Bot} />
        <NodeProperty value={data.model} icon={Cpu} />

        {data.currentTask && (
          <div className="bg-[#2A2A2A] rounded-xl p-3 border border-yellow-900/30">
            <div className="flex items-center gap-2 mb-1 text-yellow-500">
              <PlayCircle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Current Task</span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-2">{data.currentTask}</p>
          </div>
        )}

        {data.tools.length > 0 && (
          <NodeSection label="Tools" icon={Wrench}>
            {data.tools.map(tool => (
              <NodePill key={tool}>{tool}</NodePill>
            ))}
          </NodeSection>
        )}
      </BaseNode>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </>
  );
};
