import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { PhaseNode as PhaseNodeType } from '@/lib/agentic-fleet/types';
import { cn } from '@/lib/utils';

const statusColors = {
  pending: 'border-slate-300 bg-slate-50 dark:bg-slate-900',
  running: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
  completed: 'border-green-500 bg-green-50 dark:bg-green-950/20',
  failed: 'border-red-500 bg-red-50 dark:bg-red-950/20',
};

const statusIcons = {
  pending: Clock,
  running: Activity,
  completed: CheckCircle,
  failed: AlertTriangle,
};

export const PhaseNode = ({ data }: NodeProps<PhaseNodeType>) => {
  const StatusIcon = statusIcons[data.status];

  return (
    <Card className={cn("w-48 shadow-sm transition-colors", statusColors[data.status])}>
      <Handle type="target" position={Position.Top} id="top" className="w-2 h-2" />
      <Handle type="target" position={Position.Left} id="prev" className="w-2 h-2" />

      <CardHeader className="py-2 px-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-bold uppercase tracking-wider">{data.name}</CardTitle>
          <StatusIcon className="h-4 w-4 opacity-70" />
        </div>
      </CardHeader>
      <CardContent className="pb-2 px-3 text-xs">
        <div className="font-mono text-[10px] text-muted-foreground mb-1">{data.executor}</div>
        {data.metrics && (
          <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{data.metrics.duration_ms}ms</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Tokens</span>
              <span className="font-medium">{data.metrics.tokens_used}</span>
            </div>
          </div>
        )}
      </CardContent>

      <Handle type="source" position={Position.Right} id="next" className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} id="strategy" className="w-2 h-2" />
    </Card>
  );
};
