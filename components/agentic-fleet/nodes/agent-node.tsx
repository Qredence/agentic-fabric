import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Clock, PauseCircle } from 'lucide-react';
import { AgentNode as AgentNodeType } from '@/lib/agentic-fleet/types';
import { cn } from '@/lib/utils';

const statusConfig = {
  idle: { color: 'bg-slate-500', icon: PauseCircle, border: 'border-slate-200 dark:border-slate-800' },
  active: { color: 'bg-green-500', icon: Zap, border: 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' },
  waiting: { color: 'bg-amber-500', icon: Clock, border: 'border-amber-400' },
};

export const AgentNode = ({ data }: NodeProps<AgentNodeType>) => {
  const status = statusConfig[data.status] || statusConfig.idle;
  const StatusIcon = status.icon;

  return (
    <Card className={cn("w-64 transition-all duration-300", status.border)}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />

      <CardHeader className="py-3 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{data.name}</CardTitle>
              <div className="text-xs text-muted-foreground capitalize">{data.role}</div>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-[10px] capitalize gap-1 pl-1",
            data.status === 'active' && "animate-pulse border-green-500 text-green-600"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", status.color)} />
            {data.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3 pt-1 space-y-2">
        <div className="text-xs font-mono bg-muted p-1.5 rounded text-center">
          {data.model}
        </div>

        {data.currentTask && (
          <div className="text-xs bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-2 rounded">
            <span className="font-semibold text-yellow-700 dark:text-yellow-400 block mb-0.5">Current Task:</span>
            {data.currentTask}
          </div>
        )}

        {data.tools.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tools.map(tool => (
              <Badge key={tool} variant="secondary" className="text-[10px] h-5 px-1.5">
                {tool}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
    </Card>
  );
};
