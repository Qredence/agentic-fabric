"use client";

import React, { useCallback } from "react";
import { Panel } from "@/components/ai-elements/panel";
import { Button } from "@/components/ui/button";
import { Code, Bot, Workflow, ArrowDownToLine, ArrowUpFromLine, GitBranch, Square, FolderSearch, Repeat, ArrowLeftRight, FileCode } from "lucide-react";
import type { ExecutorType } from "@/lib/workflow/executors";
import { getExecutorTypeLabel, getExecutorTypeDescription } from "@/lib/workflow/executors";
import type { EdgeGroupType } from "@/lib/workflow/types";
import { getEdgeGroupTypeLabel, getEdgeGroupTypeDescription } from "@/lib/workflow/edges";
import { cn } from "@/lib/utils";

type NodeLibraryCategory = "agents" | "functions" | "orchestration" | "human" | "connections";

interface NodeLibraryProps {
  onDragStart: (event: React.DragEvent<HTMLElement>, nodeType: string) => void;
  onAddNode: (nodeType: string) => void;
  onAddMagenticScaffold: () => void;
}

interface NodeLibraryItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: NodeLibraryCategory;
  iconColor?: string;
}

// Agents
const agentItems: NodeLibraryItem[] = [
  {
    id: "agent-executor",
    label: getExecutorTypeLabel("agent-executor"),
    description: getExecutorTypeDescription("agent-executor"),
    icon: Bot,
    category: "agents",
    iconColor: "hsl(var(--chart-2))",
  },
  {
    id: "scaffold:group-chat",
    label: "Group Chat",
    description: "Create a multi-agent discussion pattern",
    icon: Workflow,
    category: "agents",
    iconColor: "hsl(var(--chart-2))",
  },
];

// Functions
const functionItems: NodeLibraryItem[] = [
  {
    id: "request-info-executor",
    label: "File search",
    description: getExecutorTypeDescription("request-info-executor"),
    icon: FolderSearch,
    category: "functions",
    iconColor: "hsl(var(--chart-4))",
  },
  {
    id: "function-executor",
    label: getExecutorTypeLabel("function-executor"),
    description: getExecutorTypeDescription("function-executor"),
    icon: FileCode,
    category: "functions",
    iconColor: "hsl(var(--chart-4))",
  },
];

// Orchestration
const orchestrationItems: NodeLibraryItem[] = [
  {
    id: "scaffold:handoff",
    label: "Handoff",
    description: "Create triage and specialist agent routing",
    icon: Repeat,
    category: "orchestration",
    iconColor: "hsl(var(--chart-5))",
  },
  {
    id: "switch-case",
    label: "Conditional Router",
    description: getEdgeGroupTypeDescription("switch-case" as EdgeGroupType),
    icon: GitBranch,
    category: "orchestration",
    iconColor: "hsl(var(--chart-5))",
  },
  {
    id: "workflow-executor",
    label: getExecutorTypeLabel("workflow-executor"),
    description: getExecutorTypeDescription("workflow-executor"),
    icon: Square,
    category: "orchestration",
    iconColor: "hsl(var(--chart-1))",
  },
  {
    id: "magentic-orchestrator-executor",
    label: getExecutorTypeLabel("magentic-orchestrator-executor"),
    description: getExecutorTypeDescription("magentic-orchestrator-executor"),
    icon: Code,
    category: "orchestration",
    iconColor: "hsl(var(--chart-3))",
  },
];

// Human-in-Loop
const humanItems: NodeLibraryItem[] = [
  {
    id: "request-info-executor",
    label: getExecutorTypeLabel("request-info-executor"),
    description: getExecutorTypeDescription("request-info-executor"),
    icon: ArrowLeftRight,
    category: "human",
    iconColor: "hsl(var(--accent))",
  },
];


const categoryConfig: Record<NodeLibraryCategory, { label: string; color: string; items: NodeLibraryItem[] }> = {
  agents: { label: "Agents", color: "#3B82F6", items: agentItems },
  functions: { label: "Functions", color: "#FBBF24", items: functionItems },
  orchestration: { label: "Orchestration", color: "#F97316", items: orchestrationItems },
  human: { label: "Human-in-Loop", color: "#A855F7", items: humanItems },
  connections: { label: "Connections", color: "hsl(var(--muted-foreground))", items: [
    {
      id: "fan-out",
      label: "Fan-Out",
      description: getEdgeGroupTypeDescription("fan-out" as EdgeGroupType),
      icon: ArrowUpFromLine,
      category: "connections",
      iconColor: "hsl(var(--muted-foreground))",
    },
    {
      id: "fan-in",
      label: getEdgeGroupTypeLabel("fan-in" as EdgeGroupType),
      description: getEdgeGroupTypeDescription("fan-in" as EdgeGroupType),
      icon: ArrowDownToLine,
      category: "connections",
      iconColor: "hsl(var(--muted-foreground))",
    },
    {
      id: "switch-case",
      label: getEdgeGroupTypeLabel("switch-case" as EdgeGroupType),
      description: getEdgeGroupTypeDescription("switch-case" as EdgeGroupType),
      icon: GitBranch,
      category: "connections",
      iconColor: "hsl(var(--muted-foreground))",
    },
  ] },
};

export function NodeLibrary({ onDragStart, onAddNode, onAddMagenticScaffold }: NodeLibraryProps) {
  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLElement>, nodeType: string) => {
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
    const iconColor = item.iconColor || "#9CA3AF";
    return (
      <button
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        onClick={() => handleAddNode(item.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleAddNode(item.id);
          }
        }}
        aria-label={item.label}
        aria-describedby={`desc-${item.id}`}
        className="group relative flex w-full items-center justify-between cursor-grab bg-background/20 px-3 py-3 text-sm transition-colors duration-200 hover:bg-background/30 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <div className="flex items-center gap-2">
          <div style={{ color: iconColor }}>
            <Icon className="size-4 shrink-0" />
          </div>
          <div className="font-medium text-[12px] text-foreground">{item.label}</div>
        </div>
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block pointer-events-none">
          <div className="bg-popover border rounded-md px-3 py-2 text-xs text-popover-foreground shadow-lg whitespace-nowrap max-w-xs">
            {item.description}
          </div>
        </div>
        <span id={`desc-${item.id}`} className="sr-only">{item.description}</span>
      </button>
    );
  };

  const renderCategory = (category: NodeLibraryCategory) => {
    const config = categoryConfig[category];
    if (!config || config.items.length === 0) return null;

    return (
      <div key={category}>
        <h4
          className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide"
          style={{ color: config.color }}
        >
          {config.label}
        </h4>
        <div className="rounded-2xl overflow-hidden border bg-background/20 p-0 shadow-sm divide-y divide-border/20" role="list">
          {config.items.map(renderNodeItem)}
        </div>
      </div>
    );
  };

  return (
    <Panel
      position="center-left"
      className={cn(
        "m-0 ml-6 mt-8 w-[224px] space-y-4 p-3",
        "bottom-6 overflow-y-auto",
        "bg-gray-262626 rounded-32 backdrop-blur-sm"
      )}
      style={{ height: "calc(100vh - 8.5rem)" }}
    >
      <div>
        <h3 className="text-sm font-semibold mb-1">Node Library</h3>
        <p className="text-xs text-muted-foreground">Drag onto canvas or click to add</p>
      </div>

      {(["agents", "functions", "orchestration", "human", "connections"] as NodeLibraryCategory[]).map(
        renderCategory
      )}

      
    </Panel>
  );
}
