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
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Bot, Pencil, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentExecutor } from "@/lib/workflow/executors";
import { ExecutorNodeWrapper } from "@/components/ai-elements/executor-node-wrapper";

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

  const displayLabel = label || executor.label || executor.agentId || executor.id;
  const displayDescription = description || executor.description || `Agent: ${executor.agentId}`;

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
            className="mb-2 px-0"
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 pt-4">
              <div className="min-w-0">
                <motion.div
                  layoutId={`agent-title-${id}`}
                  transition={springTransition}
                  className="text-[24px] leading-[30px] truncate text-gray-300"
                >
                  {displayLabel}
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
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
                  className="text-sm text-gray-600 truncate max-w-[120px]"
                >
                  {executor.model || "Agent"}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Configure Section */}
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
              delay: 0.15,
            }}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
          >
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">Configure Agent</span>
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                delay: 0.2,
              }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Agent ID
                </label>
                <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300 font-mono">
                  {executor.agentId}
                </div>
              </div>

              {executor.agentType && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Agent Type
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400 capitalize">
                    {executor.agentType}
                  </div>
                </div>
              )}

              {executor.model && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Model
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400 font-mono">
                    {executor.model}
                  </div>
                </div>
              )}

              {executor.tools && executor.tools.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Tools
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                    {executor.tools.length} tool(s)
                  </div>
                </div>
              )}

              {executor.toolMode && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Tool Mode
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400 capitalize">
                    {executor.toolMode}
                  </div>
                </div>
              )}

              {executor.systemPrompt && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    System Prompt
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-xs text-gray-400 max-h-20 overflow-auto">
                    {executor.systemPrompt.substring(0, 150)}
                    {executor.systemPrompt.length > 150 && "..."}
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
            </motion.div>
          </div>

          {/* Footer with Actions */}
          <div className="border-t border-white/5 px-4 py-3">
            <Toolbar>
              <Actions>
                <Action tooltip="Edit agent executor" label="Edit" aria-label="Edit">
                  <Pencil className="size-4" />
                </Action>
                <Action tooltip="Configure agent" label="Settings" aria-label="Settings">
                  <Settings className="size-4" />
                </Action>
                <Action tooltip="Delete agent executor" label="Delete" aria-label="Delete">
                  <Trash2 className="size-4" />
                </Action>
              </Actions>
            </Toolbar>
          </div>
        </div>
      </Node>
    </ExecutorNodeWrapper>
  );
});

AgentExecutorNode.displayName = "AgentExecutorNode";

