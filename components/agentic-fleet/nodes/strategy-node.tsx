import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Users, AlignJustify } from 'lucide-react';
import { StrategyNode as StrategyNodeType } from '@/lib/agentic-fleet/types';
import { BaseNode, NodeSection, NodePill, NodeProperty } from './base-node';

export const StrategyNode = ({ data, selected }: NodeProps<StrategyNodeType>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />

      <BaseNode title={data.name} icon={GitBranch} selected={selected} className="capitalize">
        <NodeProperty
          value={data.description}
          icon={AlignJustify}
        />

        {data.maxConcurrency && (
          <NodeSection label="Concurrency">
            <NodePill>Max: {data.maxConcurrency}</NodePill>
          </NodeSection>
        )}

        {data.participants && (
          <NodeSection label="Participants" icon={Users}>
            {data.participants.map(p => (
              <NodePill key={p}>{p}</NodePill>
            ))}
          </NodeSection>
        )}
      </BaseNode>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </>
  );
};
