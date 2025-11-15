"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Undo2, Redo2, Frame, Lock, Unlock, Sun, Moon, Play, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
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
  onEvaluate?: () => void;
  onValidate?: () => void;
}

export function BottomControls({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onFitView,
  locked = false,
  onToggleLock,
  onEvaluate,
  onValidate,
}: BottomControlsProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Use a default theme during SSR to prevent hydration mismatch
  const isDark = mounted ? resolvedTheme === "dark" : false;
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <ExpandableTabs
        tabs={[
          { title: "Undo", icon: Undo2, disabled: !canUndo },
          { title: "Redo", icon: Redo2, disabled: !canRedo },
          { type: "separator" },
          { title: "Evaluate", icon: Play, ariaLabel: "Evaluate workflow" },
          { title: "Validation", icon: CheckCircle2, ariaLabel: "Validate workflow" },
          { type: "separator" },
          { title: "Auto-fit view", icon: Frame },
          {
            title: locked ? "Unlock node edits" : "Lock node edits",
            icon: locked ? Unlock : Lock,
            active: locked,
            ariaLabel: locked ? "Unlock node edits" : "Lock node edits",
          },
          { type: "separator" },
          {
            title: "Toggle theme",
            icon: isDark ? Moon : Sun,
            active: isDark,
            ariaLabel: isDark ? "Activate light mode" : "Activate dark mode",
          },
        ]}
        className={cn("rounded-full border bg-background/95 backdrop-blur-sm shadow-lg p-1.5")}
        showLabelsOnSelect={false}
        onClickBehavior="momentary"
        onChange={(index) => {
          if (index === null) return;
          if (index === 0) {
            if (canUndo) onUndo?.();
            return;
          }
          if (index === 1) {
            if (canRedo) onRedo?.();
            return;
          }
          if (index === 3) {
            onEvaluate?.();
            return;
          }
          if (index === 4) {
            onValidate?.();
            return;
          }
          if (index === 6) {
            onFitView?.();
            return;
          }
          if (index === 7) {
            onToggleLock?.();
            return;
          }
          if (index === 9) {
            setTheme(isDark ? "light" : "dark");
            return;
          }
        }}
      />
    </div>
  );
}
