"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AgentExecutor } from "@/lib/workflow/executors";

interface AgentExecutorEditorProps {
  executor: AgentExecutor;
  onChange: (updates: Partial<AgentExecutor>) => void;
}

export function AgentExecutorEditor({
  executor,
  onChange,
}: AgentExecutorEditorProps) {
  return (
    <div className="space-y-4 pt-2 border-t">
      <h4 className="text-sm font-medium">Agent Configuration</h4>

      <div className="space-y-2">
        <Label htmlFor="agent-id">Agent ID</Label>
        <Input
          id="agent-id"
          value={executor.agentId || ""}
          onChange={(e) => onChange({ agentId: e.target.value })}
          placeholder="my-agent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="agent-type">Agent Type</Label>
        <Select
          value={executor.agentType || "chat"}
          onValueChange={(value) => onChange({ agentType: value as "chat" | "workflow" | "magentic" })}
        >
          <SelectTrigger id="agent-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chat">Chat</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
            <SelectItem value="magentic">Magentic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={executor.model || ""}
          onChange={(e) => onChange({ model: e.target.value || undefined })}
          placeholder="gpt-4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="system-prompt">System Prompt</Label>
        <Textarea
          id="system-prompt"
          value={executor.systemPrompt || ""}
          onChange={(e) => onChange({ systemPrompt: e.target.value || undefined })}
          placeholder="You are a helpful assistant..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature</Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={executor.temperature ?? ""}
            onChange={(e) =>
              onChange({
                temperature: e.target.value ? Number.parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="0.7"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-tokens">Max Tokens</Label>
          <Input
            id="max-tokens"
            type="number"
            min="1"
            value={executor.maxTokens ?? ""}
            onChange={(e) =>
              onChange({
                maxTokens: e.target.value ? Number.parseInt(e.target.value, 10) : undefined,
              })
            }
            placeholder="1000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tool-mode">Tool Mode</Label>
        <Select
          value={executor.toolMode || "auto"}
          onValueChange={(value) =>
            onChange({ toolMode: value as "auto" | "required" | "none" })
          }
        >
          <SelectTrigger id="tool-mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="required">Required</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {executor.tools && executor.tools.length > 0 && (
        <div className="space-y-2">
          <Label>Tools ({executor.tools.length})</Label>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            {executor.tools.map((tool, idx) => (
              <div key={idx} className="py-1">
                {tool.toolId}
                {tool.enabled === false && <span className="ml-2 text-muted-foreground">(disabled)</span>}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Tool configuration would be expanded here in a full implementation
          </p>
        </div>
      )}
    </div>
  );
}
