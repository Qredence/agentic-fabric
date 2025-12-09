import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GitMerge, GitBranch, ArrowRightLeft, Users, MessageSquare } from 'lucide-react';
import { StrategyNode as StrategyNodeType } from '@/lib/agentic-fleet/types';

const strategyIcons = {
  delegated: GitBranch,
  sequential: ArrowRightLeft,
  parallel: GitMerge,
  handoff: ArrowRightLeft,
  discussion: MessageSquare,
};

export const StrategyNode = ({ data }: NodeProps<StrategyNodeType>) => {
  const Icon = strategyIcons[data.name] || GitBranch;

  return (
    <Card className="w-56 border-dashed border-2 border-slate-300 dark:border-slate-700 bg-transparent">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />

      <CardHeader className="py-2 flex flex-row items-center gap-2 space-y-0">
        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md">
          <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-sm font-medium capitalize">{data.name}</CardTitle>
          <span className="text-[10px] text-muted-foreground">Strategy</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 text-xs text-muted-foreground">
        {data.description}
        {data.maxConcurrency && (
          <div className="mt-1 font-semibold text-slate-600 dark:text-slate-300">
            Max Concurrency: {data.maxConcurrency}
          </div>
        )}
      </CardContent>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
    </Card>
  );
};
