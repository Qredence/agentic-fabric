"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FunctionExecutor } from "@/lib/workflow/executors";

interface FunctionExecutorEditorProps {
  executor: FunctionExecutor;
  onChange: (updates: Partial<FunctionExecutor>) => void;
}

export function FunctionExecutorEditor({
  executor,
  onChange,
}: FunctionExecutorEditorProps) {
  return (
    <div className="space-y-4 pt-2 border-t">
      <h4 className="text-sm font-medium">Function Configuration</h4>
      
      <div className="space-y-2">
        <Label htmlFor="function-name">Function Name</Label>
        <Input
          id="function-name"
          value={executor.functionName || ""}
          onChange={(e) => onChange({ functionName: e.target.value })}
          placeholder="my_function"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="function-id">Function ID (optional)</Label>
        <Input
          id="function-id"
          value={executor.functionId || ""}
          onChange={(e) => onChange({ functionId: e.target.value || undefined })}
          placeholder="function-registry-id"
        />
        <p className="text-xs text-muted-foreground">
          Use if function is registered in a function registry
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="function-code">Function Code (optional)</Label>
        <Textarea
          id="function-code"
          value={executor.functionCode || ""}
          onChange={(e) => onChange({ functionCode: e.target.value || undefined })}
          placeholder="def my_function(context):&#10;    # Your function code here&#10;    return []"
          rows={8}
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Provide inline function code or use Function ID to reference a registered function
        </p>
      </div>

      {executor.parameters && Object.keys(executor.parameters).length > 0 && (
        <div className="space-y-2">
          <Label>Parameters</Label>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <pre>{JSON.stringify(executor.parameters, null, 2)}</pre>
          </div>
          <p className="text-xs text-muted-foreground">
            Parameters are defined in function code or registry
          </p>
        </div>
      )}
    </div>
  );
}
