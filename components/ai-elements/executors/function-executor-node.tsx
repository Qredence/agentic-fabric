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
import { Code, Pencil, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FunctionExecutor } from "@/lib/workflow/executors";
import { ExecutorNodeWrapper } from "@/components/ai-elements/executor-node-wrapper";

/**
 * Function executor node data
 */
export interface FunctionExecutorNodeData {
  variant: "function-executor";
  handles: {
    target: boolean;
    source: boolean;
  };
  executor: FunctionExecutor;
  label?: string;
  description?: string;
  status?: "idle" | "running" | "completed" | "error";
}

/**
 * Props for FunctionExecutorNode component
 */
export type FunctionExecutorNodeProps = any;

/**
 * Function executor node component
 */
export const FunctionExecutorNode = memo(({ id, data, selected }: FunctionExecutorNodeProps) => {
  const { handles, executor, label, description, status } = data;

  const displayLabel = label || executor.label || executor.functionName || executor.id;
  const displayDescription = description || executor.description || `Function: ${executor.functionName}`;

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
                  layoutId={`function-title-${id}`}
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
                  Function
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
            <span className="text-sm text-gray-400">Configure Parameters</span>
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
                  Function Name
                </label>
                <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-300 font-mono">
                  {executor.functionName}
                </div>
              </div>

              {executor.functionCode && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Code
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-xs font-mono text-gray-400 max-h-20 overflow-auto">
                    {executor.functionCode.substring(0, 200)}
                    {executor.functionCode.length > 200 && "..."}
                  </div>
                </div>
              )}

              {executor.parameters && Object.keys(executor.parameters).length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Parameters
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm text-gray-400">
                    {Object.keys(executor.parameters).length} parameter(s)
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
                <Action tooltip="Edit function executor" label="Edit" aria-label="Edit">
                  <Pencil className="size-4" />
                </Action>
                <Action tooltip="Delete function executor" label="Delete" aria-label="Delete">
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

FunctionExecutorNode.displayName = "FunctionExecutorNode";

