"use client";

import React, { useCallback } from "react";
import { Panel } from "@/components/ai-elements/panel";
import { Button } from "@/components/ui/button";
import {
  Code,
  Bot,
  Workflow,
  Globe,
  ArrowDownToLine,
  ArrowUpFromLine,
  GitBranch,
} from "lucide-react";
import type { ExecutorType } from "@/lib/workflow/executors";
import { getExecutorTypeLabel, getExecutorTypeDescription } from "@/lib/workflow/executors";
import type { EdgeGroupType } from "@/lib/workflow/types";
import { getEdgeGroupTypeLabel, getEdgeGroupTypeDescription } from "@/lib/workflow/edges";

interface NodeLibraryProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
  onAddNode: (nodeType: string) => void;
}

interface NodeLibraryItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "executors" | "edge-groups";
}

const executorItems: NodeLibraryItem[] = [
  {
    id: "executor",
    label: getExecutorTypeLabel("executor"),
    description: getExecutorTypeDescription("executor"),
    icon: Workflow,
    category: "executors",
  },
  {
    id: "function-executor",
    label: getExecutorTypeLabel("function-executor"),
    description: getExecutorTypeDescription("function-executor"),
    icon: Code,
    category: "executors",
  },
  {
    id: "agent-executor",
    label: getExecutorTypeLabel("agent-executor"),
    description: getExecutorTypeDescription("agent-executor"),
    icon: Bot,
    category: "executors",
  },
  {
    id: "workflow-executor",
    label: getExecutorTypeLabel("workflow-executor"),
    description: getExecutorTypeDescription("workflow-executor"),
    icon: Workflow,
    category: "executors",
  },
  {
    id: "request-info-executor",
    label: getExecutorTypeLabel("request-info-executor"),
    description: getExecutorTypeDescription("request-info-executor"),
    icon: Globe,
    category: "executors",
  },
];

const edgeGroupItems: NodeLibraryItem[] = [
  {
    id: "fan-in",
    label: getEdgeGroupTypeLabel("fan-in"),
    description: getEdgeGroupTypeDescription("fan-in"),
    icon: ArrowDownToLine,
    category: "edge-groups",
  },
  {
    id: "fan-out",
    label: getEdgeGroupTypeLabel("fan-out"),
    description: getEdgeGroupTypeDescription("fan-out"),
    icon: ArrowUpFromLine,
    category: "edge-groups",
  },
  {
    id: "switch-case",
    label: getEdgeGroupTypeLabel("switch-case"),
    description: getEdgeGroupTypeDescription("switch-case"),
    icon: GitBranch,
    category: "edge-groups",
  },
];

export function NodeLibrary({ onDragStart, onAddNode }: NodeLibraryProps) {
  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
      onDragStart(event, nodeType);
    },
    [onDragStart]
  );

  const handleAddNode = useCallback(
    (nodeType: string) => {
      onAddNode(nodeType);
    },
    [onAddNode]
  );

  const renderNodeItem = (item: NodeLibraryItem) => {
    const Icon = item.icon;
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        className="cursor-grab rounded-md border bg-muted p-3 text-sm shadow-sm transition-colors hover:bg-muted/70 active:cursor-grabbing"
      >
        <div className="flex items-start gap-2">
          <Icon className="size-4 text-primary mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {item.description}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Panel position="center-left" className="ml-4 w-64 space-y-4 p-3 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div>
        <h3 className="text-sm font-semibold mb-1">Node Library</h3>
        <p className="text-xs text-muted-foreground">Drag onto canvas or click to add</p>
      </div>

      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Executors
        </h4>
        <div className="space-y-2">
          {executorItems.map(renderNodeItem)}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Edge Groups
        </h4>
        <div className="space-y-2">
          {edgeGroupItems.map(renderNodeItem)}
        </div>
      </div>

      <div className="pt-2 border-t">
        <Button
          size="sm"
          className="w-full"
          onClick={() => handleAddNode("executor")}
        >
          Add Executor to Center
        </Button>
      </div>
    </Panel>
  );
}

