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
import { Pencil, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseExecutor, ExecutorId } from "@/lib/workflow/types";
import type { ExecutorType } from "@/lib/workflow/executors";
import { getExecutorTypeLabel } from "@/lib/workflow/executors";
import { ExecutorNodeWrapper } from "@/components/ai-elements/executor-node-wrapper";

/**
 * Executor node data for React Flow
 */
export interface ExecutorNodeData {
  variant: "executor";
  handles: {
    target: boolean;
    source: boolean;
  };
  executor: BaseExecutor;
  executorType: ExecutorType;
  label?: string;
  description?: string;
  status?: "idle" | "running" | "completed" | "error";
  error?: string;
}

/**
 * Props for ExecutorNode component
 */
export type ExecutorNodeProps = any;

/**
 * Base executor node component - displays an executor in the workflow canvas
 */
export const ExecutorNode = memo(({ id, data, selected }: ExecutorNodeProps) => {
  const { handles, executor, executorType, label, description, status, error } = data;

  const displayLabel = label || executor.label || executor.id;
  const displayDescription = description || executor.description || getExecutorTypeLabel(executorType);

  const statusColors = {
    idle: "text-gray-500",
    running: "text-blue-500",
    completed: "text-green-500",
    error: "text-red-500",
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
            className="mb-2 px-0"
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 pt-4">
              <div className="min-w-0">
                <motion.div
                  layoutId={`executor-title-${id}`}
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
                  {getExecutorTypeLabel(executorType)}
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
            <span className="text-sm text-gray-400">Configure Executor</span>
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
                  Executor Type
                </label>
                <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300">
                  <span className="font-mono">{executorType}</span>
                </div>
              </div>

              {status && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Status
                  </label>
                  <div className={cn("px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm font-medium", statusColors[status as keyof typeof statusColors])}>
                    {status}
                  </div>
                </div>
              )}

              {error && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Error
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                    {error}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Executor ID
                </label>
                <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400 font-mono">
                  {executor.id}
                </div>
              </div>

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
                <Action tooltip="Edit executor" label="Edit" aria-label="Edit executor">
                  <Pencil className="size-4" />
                </Action>
                <Action tooltip="Delete executor" label="Delete" aria-label="Delete executor">
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

ExecutorNode.displayName = "ExecutorNode";

