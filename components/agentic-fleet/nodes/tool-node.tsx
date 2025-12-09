import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Globe, Search, Terminal, FileText, Key } from 'lucide-react';
import { ToolNode as ToolNodeType } from '@/lib/agentic-fleet/types';

const categoryIcons = {
  search: Search,
  browser: Globe,
  mcp: Terminal,
  code: Terminal,
  file: FileText,
};

export const ToolNode = ({ data }: NodeProps<ToolNodeType>) => {
  const Icon = categoryIcons[data.category] || Wrench;

  return (
    <Card className="w-52 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-slate-400" />

      <CardHeader className="py-2 px-3 flex flex-row items-center gap-2 space-y-0">
        <Icon className="h-4 w-4 text-slate-500" />
        <div className="overflow-hidden">
          <CardTitle className="text-sm font-medium truncate" title={data.name}>
            {data.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pb-2 px-3 text-xs">
        <div className="text-muted-foreground mb-2 line-clamp-2" title={data.description}>
          {data.description}
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] capitalize">
            {data.category}
          </Badge>
          {data.requiresApiKey && (
            <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-500" title={data.apiKeyEnvVar}>
              <Key className="h-3 w-3" />
              <span>Auth</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
