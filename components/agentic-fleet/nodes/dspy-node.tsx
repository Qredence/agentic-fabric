import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { BrainCircuit, FileCode, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';
import { DSPyNode as DSPyNodeType } from '@/lib/agentic-fleet/types';
import { BaseNode, NodeSection, NodePill, NodeProperty } from './base-node';

export const DSPyNode = ({ data, selected }: NodeProps<DSPyNodeType>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      <BaseNode
        title={data.name}
        icon={BrainCircuit}
        selected={selected}
        headerActions={
          data.compiled ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-amber-500" />
        }
      >
        <NodeProperty
          value={data.signatureFile}
          icon={FileCode}
        />

        <NodeSection label="Input Fields" icon={ArrowRightLeft}>
          {data.inputFields.map((field) => (
            <NodePill key={field}>{field}</NodePill>
          ))}
        </NodeSection>

        <NodeSection label="Output Fields" icon={ArrowRightLeft}>
          {data.outputFields.map((field) => (
            <NodePill key={field} className="bg-[#3A3A3A]">{field}</NodePill>
          ))}
        </NodeSection>
      </BaseNode>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </>
  );
};
