"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WorkflowExecutor } from "@/lib/workflow/executors";

interface WorkflowExecutorEditorProps {
  executor: WorkflowExecutor;
  onChange: (updates: Partial<WorkflowExecutor>) => void;
}

export function WorkflowExecutorEditor({
  executor,
  onChange,
}: WorkflowExecutorEditorProps) {
  return (
    <div className="space-y-4 pt-2 border-t">
      <h4 className="text-sm font-medium">Nested Workflow Configuration</h4>

      <div className="space-y-2">
        <Label htmlFor="workflow-id">Workflow ID</Label>
        <Input
          id="workflow-id"
          value={executor.workflowId || ""}
          onChange={(e) => onChange({ workflowId: e.target.value })}
          placeholder="nested-workflow-1"
        />
        <p className="text-xs text-muted-foreground">
          Reference to the nested workflow to execute
        </p>
      </div>

      {executor.workflowDefinition && (
        <div className="space-y-2">
          <Label>Workflow Definition</Label>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <div>Executors: {executor.workflowDefinition.executors.length}</div>
            <div>Edges: {executor.workflowDefinition.edges.length}</div>
          </div>
        </div>
      )}

      {executor.inputMapping && Object.keys(executor.inputMapping).length > 0 && (
        <div className="space-y-2">
          <Label>Input Mappings</Label>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <pre>{JSON.stringify(executor.inputMapping, null, 2)}</pre>
          </div>
          <p className="text-xs text-muted-foreground">
            Maps parent workflow inputs to nested workflow inputs
          </p>
        </div>
      )}

      {executor.outputMapping && Object.keys(executor.outputMapping).length > 0 && (
        <div className="space-y-2">
          <Label>Output Mappings</Label>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <pre>{JSON.stringify(executor.outputMapping, null, 2)}</pre>
          </div>
          <p className="text-xs text-muted-foreground">
            Maps nested workflow outputs to parent workflow outputs
          </p>
        </div>
      )}
    </div>
  );
}
