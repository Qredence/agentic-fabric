import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Wrench, Tag, Key, FileText } from 'lucide-react';
import { ToolNode as ToolNodeType } from '@/lib/agentic-fleet/types';
import { BaseNode, NodeProperty, NodePill } from './base-node';

export const ToolNode = ({ data, selected }: NodeProps<ToolNodeType>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-gray-400" />

      <BaseNode title={data.name} icon={Wrench} selected={selected}>
        <NodeProperty value={data.description} icon={FileText} />

        <div className="flex gap-2 mt-2">
          <NodePill className="flex items-center gap-2">
            <Tag className="w-3 h-3" />
            <span className="capitalize">{data.category}</span>
          </NodePill>

          {data.requiresApiKey && (
            <NodePill className="bg-amber-900/30 text-amber-200 hover:bg-amber-900/50 flex items-center gap-2">
              <Key className="w-3 h-3" />
              <span>Auth</span>
            </NodePill>
          )}
        </div>
      </BaseNode>
    </>
  );
};
