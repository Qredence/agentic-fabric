"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Tab {
  title: string;
  icon: LucideIcon;
  disabled?: boolean;
  active?: boolean;
  ariaLabel?: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
  showLabelsOnSelect?: boolean;
  selected?: number | null;
  onSelectedChange?: (index: number | null) => void;
  onClickBehavior?: "momentary" | "toggle";
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition: any = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
  showLabelsOnSelect = true,
  selected,
  onSelectedChange,
  onClickBehavior = "toggle",
}: ExpandableTabsProps) {
  const [internalSelected, setInternalSelected] = React.useState<number | null>(null);
  const isControlled = selected !== undefined;
  const currentSelected = isControlled ? selected! : internalSelected;
  const outsideClickRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(outsideClickRef as any, () => {
    if (isControlled) {
      onSelectedChange?.(null);
    } else {
      setInternalSelected(null);
    }
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    if (isControlled) {
      onSelectedChange?.(index);
    } else {
      setInternalSelected(index);
    }
    onChange?.(index);

    if (onClickBehavior === "momentary") {
      setTimeout(() => {
        if (isControlled) {
          onSelectedChange?.(null);
        } else {
          setInternalSelected(null);
        }
      }, 200);
    }
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      role="group"
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
    >
      <TooltipProvider>
      {tabs.map((tab, index) => {
        if ((tab as Separator).type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const t = tab as Tab;
        const Icon = t.icon;
        const isDisabled = !!t.disabled;
        const isActive = !!t.active;
        const isSelected = currentSelected === index;
        return (
          <Tooltip key={t.title}>
            <TooltipTrigger asChild>
              <motion.button
                variants={buttonVariants}
                initial={false}
                animate="animate"
                custom={isSelected}
                onClick={() => !isDisabled && handleSelect(index)}
                transition={transition}
                disabled={isDisabled}
                aria-label={t.ariaLabel ?? t.title}
                aria-disabled={isDisabled}
                aria-pressed={isActive || undefined}
                className={cn(
                  "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
                  isSelected || isActive
                    ? cn("bg-muted", activeColor)
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={20} />
                <AnimatePresence initial={false}>
                  {showLabelsOnSelect && isSelected && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition}
                      className="overflow-hidden"
                    >
                      {t.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              {t.title}
            </TooltipContent>
          </Tooltip>
        );
      })}
      </TooltipProvider>
    </div>
  );
}