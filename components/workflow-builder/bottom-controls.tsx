"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Frame, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolType = "pointer" | "pan";

interface BottomControlsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onFitView?: () => void;
  locked?: boolean;
  onToggleLock?: () => void;
}

export function BottomControls({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onFitView,
  locked = false,
  onToggleLock,
}: BottomControlsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 rounded-full border bg-background/95 backdrop-blur-sm shadow-lg p-1.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full",
            !canUndo && "opacity-50 cursor-not-allowed"
          )}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full",
            !canRedo && "opacity-50 cursor-not-allowed"
          )}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onFitView}
          title="Auto-fit view"
          aria-label="Auto-fit view"
        >
          <Frame className="h-4 w-4" />
        </Button>
        <Button
          variant={locked ? "secondary" : "ghost"}
          size="icon"
          className={cn("h-8 w-8 rounded-full", locked && "bg-primary/10")}
          onClick={onToggleLock}
          title={locked ? "Unlock node edits" : "Lock node edits"}
          aria-label={locked ? "Unlock node edits" : "Lock node edits"}
          aria-pressed={locked}
        >
          <Lock className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
