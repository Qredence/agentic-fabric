import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, CheckCircle2, XCircle } from 'lucide-react';
import { DSPyNode as DSPyNodeType } from '@/lib/agentic-fleet/types';

export const DSPyNode = ({ data }: NodeProps<DSPyNodeType>) => {
  return (
    <Card className="w-64 border-l-4 border-l-purple-500 shadow-sm">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-purple-600" />
            <CardTitle className="text-sm font-semibold">{data.name}</CardTitle>
          </div>
          {data.compiled ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-amber-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0 text-xs">
        <div className="mb-2 text-muted-foreground">{data.signatureFile}</div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-[10px] text-muted-foreground mr-1">IN:</span>
            {data.inputFields.map((field) => (
              <Badge key={field} variant="secondary" className="text-[10px] px-1 h-4">
                {field}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-[10px] text-muted-foreground mr-1">OUT:</span>
            {data.outputFields.map((field) => (
              <Badge key={field} variant="secondary" className="text-[10px] px-1 h-4 bg-purple-100 dark:bg-purple-900/30">
                {field}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
    </Card>
  );
};
