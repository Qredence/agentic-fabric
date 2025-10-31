"use client";

import React from "react";
import { Panel } from "@/components/ai-elements/panel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BaseExecutor } from "@/lib/workflow/types";
import type {
  FunctionExecutor,
  AgentExecutor,
  WorkflowExecutor,
  RequestInfoExecutor,
} from "@/lib/workflow/executors";
import { FunctionExecutorEditor } from "./executor-editors/function-executor-editor";
import { AgentExecutorEditor } from "./executor-editors/agent-executor-editor";
import { WorkflowExecutorEditor } from "./executor-editors/workflow-executor-editor";
import { RequestInfoExecutorEditor } from "./executor-editors/request-info-executor-editor";

interface PropertiesPanelProps {
  selectedNode: {
    id: string;
    type: string;
    data: {
      executor?: BaseExecutor;
      executorType?: string;
    };
  } | null;
  onUpdate: (nodeId: string, updates: Partial<BaseExecutor>) => void;
}

export function PropertiesPanel({
  selectedNode,
  onUpdate,
}: PropertiesPanelProps) {
  if (!selectedNode || !selectedNode.data.executor) {
    return (
      <Panel position="center-right" className="mr-4 w-80 p-4">
        <div className="text-sm text-muted-foreground text-center py-8">
          Select a node to view and edit its properties
        </div>
      </Panel>
    );
  }

  const executor = selectedNode.data.executor;
  const executorType = selectedNode.data.executorType || executor.type;

  const handleChange = (field: keyof BaseExecutor, value: unknown) => {
    onUpdate(selectedNode.id, { [field]: value } as Partial<BaseExecutor>);
  };

  const handleExecutorChange = (updates: Partial<BaseExecutor>) => {
    onUpdate(selectedNode.id, updates);
  };

  return (
    <Panel position="center-right" className="mr-4 w-80 p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-4">Properties</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="executor-id">Executor ID</Label>
          <Input
            id="executor-id"
            value={executor.id}
            disabled
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Executor ID cannot be changed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="executor-type">Type</Label>
          <Input
            id="executor-type"
            value={executorType}
            disabled
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="executor-label">Label</Label>
          <Input
            id="executor-label"
            value={executor.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
            placeholder="Enter label"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="executor-description">Description</Label>
          <Textarea
            id="executor-description"
            value={executor.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter description"
            rows={3}
          />
        </div>

        {/* Type-specific editors */}
        {executorType === "function-executor" && (
          <FunctionExecutorEditor
            executor={executor as FunctionExecutor}
            onChange={handleExecutorChange}
          />
        )}

        {executorType === "agent-executor" && (
          <AgentExecutorEditor
            executor={executor as AgentExecutor}
            onChange={handleExecutorChange}
          />
        )}

        {executorType === "workflow-executor" && (
          <WorkflowExecutorEditor
            executor={executor as WorkflowExecutor}
            onChange={handleExecutorChange}
          />
        )}

        {executorType === "request-info-executor" && (
          <RequestInfoExecutorEditor
            executor={executor as RequestInfoExecutor}
            onChange={handleExecutorChange}
          />
        )}
      </div>
    </Panel>
  );
}

