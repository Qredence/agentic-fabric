import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CircleDashed, AlertCircle, PlayCircle } from 'lucide-react';
import { TaskNode as TaskNodeType } from '@/lib/agentic-fleet/types';
import { cn } from '@/lib/utils';

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusIcons = {
  queued: CircleDashed,
  processing: PlayCircle,
  completed: CheckCircle2,
  failed: AlertCircle,
};

export const TaskNode = ({ data }: NodeProps<TaskNodeType>) => {
  const StatusIcon = statusIcons[data.status];

  return (
    <Card className="w-48 bg-yellow-50 dark:bg-zinc-900 border-l-4 border-l-yellow-400 dark:border-l-yellow-600 shadow-md">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <CardHeader className="p-2 pb-1 flex flex-row justify-between items-start space-y-0">
         <Badge className={cn("text-[10px] px-1.5 h-4", priorityColors[data.priority])}>
           {data.priority}
         </Badge>
         <StatusIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="p-2 text-xs">
        <div className="font-medium line-clamp-3 mb-2">
          {data.content}
        </div>
        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
           {data.assignedAgent && (
             <div>Agent: <span className="font-semibold">{data.assignedAgent}</span></div>
           )}
           <div>Phase: <span className="font-semibold">{data.phase}</span></div>
        </div>
      </CardContent>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </Card>
  );
};
