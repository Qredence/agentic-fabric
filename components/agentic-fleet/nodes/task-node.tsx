import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ClipboardList, Flag, User } from 'lucide-react';
import { TaskNode as TaskNodeType } from '@/lib/agentic-fleet/types';
import { BaseNode, NodeProperty, NodePill } from './base-node';
import { cn } from '@/lib/utils';

export const TaskNode = ({ data, selected }: NodeProps<TaskNodeType>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <BaseNode
        title="Task"
        icon={ClipboardList}
        selected={selected}
        className="w-64"
      >
        <div className="bg-[#2A2A2A] p-3 rounded-xl text-sm text-gray-200 italic border-l-2 border-yellow-500">
          {data.content}
        </div>

        <div className="flex gap-2">
          <NodePill className={cn("capitalize flex items-center gap-2",
            data.priority === 'high' ? "text-red-300 bg-red-900/20" :
            data.priority === 'medium' ? "text-yellow-300 bg-yellow-900/20" : "text-blue-300 bg-blue-900/20"
          )}>
            <Flag className="w-3 h-3" />
            {data.priority}
          </NodePill>

          <NodePill className="capitalize flex items-center gap-2">
             <div className={cn("w-2 h-2 rounded-full",
               data.status === 'completed' ? "bg-green-500" :
               data.status === 'processing' ? "bg-blue-500 animate-pulse" :
               data.status === 'failed' ? "bg-red-500" : "bg-gray-500"
             )} />
             {data.status}
          </NodePill>
        </div>

        {data.assignedAgent && (
          <NodeProperty value={data.assignedAgent} icon={User} label="Assigned To" />
        )}
      </BaseNode>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </>
  );
};
