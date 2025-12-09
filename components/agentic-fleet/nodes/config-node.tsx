import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { ConfigNode as ConfigNodeType } from '@/lib/agentic-fleet/types';

export const ConfigNode = ({ data }: NodeProps<ConfigNodeType>) => {
  return (
    <Card className="w-80 border-2 border-primary/20 shadow-md">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-xs">
        <div className="mb-2 font-mono text-muted-foreground truncate" title={data.path}>
          {data.path}
        </div>
        <div className="flex flex-wrap gap-1">
          {data.sections.map((section) => (
            <Badge key={section} variant="outline" className="text-[10px]">
              {section}
            </Badge>
          ))}
        </div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
    </Card>
  );
};
