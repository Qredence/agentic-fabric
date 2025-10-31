"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps as ReactFlowNodeProps } from "@xyflow/react";
import { motion } from "motion/react";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentExecutor, ToolReference } from "@/lib/workflow/executors";
import { ExecutorNodeWrapper } from "@/components/ai-elements/executor-node-wrapper";
import { Badge } from "@/components/ui/badge";

const truncateText = (value: string | undefined, max = 160) => {
  if (!value) {
    return "";
  }
  return value.length > max ? `${value.slice(0, max)}…` : value;
};

const InfoRow = ({
  label,
  value,
  mono = false,
  placeholder = "—",
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-widest text-gray-500">
      {label}
    </span>
    <span
      className={cn(
        "text-sm text-gray-100",
        mono && "font-mono text-xs",
        !value && "text-gray-500"
      )}
    >
      {value && String(value).length > 0 ? value : placeholder}
    </span>
  </div>
);

/**
 * Agent executor node data
 */
export interface AgentExecutorNodeData {
  variant: "agent-executor";
  handles: {
    target: boolean;
    source: boolean;
  };
  executor: AgentExecutor;
  label?: string;
  description?: string;
  status?: "idle" | "running" | "completed" | "error";
}

/**
 * Props for AgentExecutorNode component
 */
export type AgentExecutorNodeProps = any;

/**
 * Agent executor node component
 */
export const AgentExecutorNode = memo(({ id, data, selected }: AgentExecutorNodeProps) => {
  const { handles, executor, label, description, status } = data;

  const typedExecutor = executor as AgentExecutor & {
    agentRole?: string;
    capabilities?: string[];
    tools?: ToolReference[];
    systemPrompt?: string;
  };

  const metadata = (executor.metadata as Record<string, any> | undefined) ?? {};
  const magenticMeta = (metadata.magentic as Record<string, any> | undefined) ?? {};
  const agentRole = typedExecutor.agentRole || magenticMeta.agentRole;
  const capabilities = typedExecutor.capabilities || magenticMeta.capabilities;
  const toolIds = Array.isArray(typedExecutor.tools)
    ? typedExecutor.tools.map((tool) => tool.toolId).filter(Boolean)
    : Array.isArray(magenticMeta.toolIds)
      ? (magenticMeta.toolIds as string[])
      : undefined;
  const systemPrompt = typedExecutor.systemPrompt;
  const presetKey = (magenticMeta.presetKey as string | undefined) ?? undefined;

  // Format agent type for display
  const getAgentTypeLabel = (agentType?: string): string => {
    if (!agentType) return "Agent";
    
    // Check metadata for provider information
    const provider = metadata.provider || metadata.agentProvider;
    
    if (provider === "azure" || provider === "azure-ai") {
      return "Azure AI Agent";
    }
    if (provider === "openai") {
      return "OpenAI Agent";
    }
    
    // Format based on agentType
    switch (agentType.toLowerCase()) {
      case "chat":
        return "Chat Agent";
      case "workflow":
        return "Workflow Agent";
      case "magentic":
        return "Magentic Agent";
      default:
        // Capitalize first letter of each word
        return agentType
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") + " Agent";
    }
  };
  
  const agentTypeLabel = getAgentTypeLabel(executor.agentType);

  const displayLabel = label || executor.label || agentRole || executor.agentId || executor.id;
  const rawDescription =
    description ||
    executor.description ||
    (agentRole ? `Role: ${agentRole}` : executor.agentId ? `Agent: ${executor.agentId}` : "Agent");
  const displayDescription = truncateText(rawDescription, 180);
  const systemPromptPreview = systemPrompt ? truncateText(systemPrompt, 220) : undefined;

  const displayedCapabilities = Array.isArray(capabilities) ? capabilities.slice(0, 4) : [];
  const remainingCapabilities = Array.isArray(capabilities) && capabilities.length > 4 ? capabilities.length - 4 : 0;
  const displayedTools = Array.isArray(toolIds) ? toolIds.slice(0, 4) : [];
  const remainingTools = Array.isArray(toolIds) && toolIds.length > 4 ? toolIds.length - 4 : 0;

  const statusColors = {
    idle: "text-gray-500",
    running: "text-blue-500",
    completed: "text-green-500",
    error: "text-red-500",
  };

  const statusBgColors = {
    idle: "bg-gray-500/20",
    running: "bg-blue-500/20",
    completed: "bg-green-500/20",
    error: "bg-red-500/20",
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <ExecutorNodeWrapper selected={selected} dataId={id} handles={handles}>
      <Node handles={{ target: false, source: false }} className="h-full w-full bg-transparent border-none shadow-none rounded-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <motion.div
            initial={{
              y: -10,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              ...springTransition,
              delay: 0.1,
            }}
            className="px-4 pt-4 pb-3 border-b border-white/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    layoutId={`agent-title-${id}`}
                    transition={springTransition}
                    className="text-[24px] leading-[30px] truncate text-gray-300"
                  >
                    {displayLabel}
                  </motion.div>
                  {status && (
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0 flex items-center justify-center",
                        statusBgColors[status as keyof typeof statusBgColors]
                      )}
                      title={status}
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          statusColors[status as keyof typeof statusColors]
                        )}
                      />
                    </div>
                  )}
                </div>
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    ...springTransition,
                    delay: 0.05,
                  }}
                  className="text-sm text-gray-600"
                >
                  {executor.model || agentRole || "Agent"}
                </motion.div>
              </div>
              {/* Header Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  title="Edit agent executor"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  title="Configure agent"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  title="Delete agent executor"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                ...springTransition,
                delay: 0.15,
              }}
              className="space-y-4"
            >
              {/* Primary Information Group */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Agent ID
                    </label>
                    {presetKey && (
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px] uppercase tracking-wide shrink-0">
                        {presetKey}
                      </Badge>
                    )}
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300 font-mono break-all">
                    {executor.agentId}
                  </div>
                </div>

                {/* Agent Type - Always show */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Type
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                    {agentTypeLabel}
                  </div>
                </div>

                {/* Agent Role - Show if available */}
                {agentRole && (
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Role
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300 capitalize break-words">
                      {agentRole}
                    </div>
                  </div>
                )}

                {/* Model - Show if available */}
                {executor.model && (
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Model
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400 font-mono break-all">
                      {executor.model}
                    </div>
                  </div>
                )}
              </div>

              {/* Configuration Group - Always show if any config exists */}
              {(Array.isArray(capabilities) && capabilities.length > 0) || (toolIds && toolIds.length > 0) || executor.toolMode ? (
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Configuration
                  </h3>

                  {/* Capabilities - Always show if available */}
                  {Array.isArray(capabilities) && capabilities.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Capabilities
                      </label>
                      <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                        {capabilities.map((capability, idx) => (
                          <Badge 
                            key={`${capability}-${idx}`} 
                            variant="outline" 
                            className="border-white/15 bg-white/5 text-gray-100 text-[11px] px-2 py-0.5"
                          >
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools - Always show section */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Tools
                    </label>
                    {toolIds && toolIds.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                        {toolIds.map((toolId, idx) => (
                          <Badge 
                            key={`${toolId}-${idx}`} 
                            variant="secondary" 
                            className="bg-primary/15 text-primary-foreground border-primary/30 text-[11px] px-2 py-0.5 break-all"
                          >
                            {toolId}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-2 rounded-lg bg-black/10 border border-white/5 text-xs text-gray-500">
                        No tools configured
                      </div>
                    )}
                  </div>

                  {/* Tool Mode - Show if available */}
                  {executor.toolMode && (
                    <div className="flex items-center justify-between py-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">
                        Tool Mode
                      </label>
                      <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400 capitalize">
                        {executor.toolMode}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Show empty state if no configuration
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Configuration
                  </h3>
                  <div className="px-3 py-2 rounded-lg bg-black/10 border border-white/5 text-xs text-gray-500">
                    No capabilities or tools configured
                  </div>
                </div>
              )}

              {/* Details Section */}
              {(systemPromptPreview || displayDescription) && (
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Details
                  </h3>
                  {systemPromptPreview && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        System Prompt
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-xs text-gray-200 max-h-32 overflow-hidden whitespace-pre-wrap leading-relaxed">
                        {systemPromptPreview}
                      </div>
                    </div>
                  )}
                  {displayDescription && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Description
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                        {displayDescription}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </Node>
    </ExecutorNodeWrapper>
  );
});

AgentExecutorNode.displayName = "AgentExecutorNode";
