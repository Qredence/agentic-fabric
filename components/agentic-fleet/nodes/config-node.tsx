import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Settings, FileCode } from 'lucide-react';
import { ConfigNode as ConfigNodeType } from '@/lib/agentic-fleet/types';
import { BaseNode, NodeSection, NodePill, NodeProperty } from './base-node';

export const ConfigNode = ({ data, selected }: NodeProps<ConfigNodeType>) => {
  return (
    <>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
      <BaseNode title="Configuration" icon={Settings} selected={selected}>
        <NodeProperty
          value={data.path}
          icon={FileCode}
        />

        <NodeSection label="Sections">
          {data.sections.map((section) => (
            <NodePill key={section}>
              {section}
            </NodePill>
          ))}
        </NodeSection>
      </BaseNode>
    </>
  );
};
