import React, { ReactNode } from 'react';
import { BookOpen, Trash2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseNodeProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onInspect?: () => void;
  onDelete?: () => void;
  headerActions?: ReactNode;
}

export const BaseNode = ({
  title,
  icon: Icon,
  children,
  className,
  selected,
  onInspect,
  onDelete,
  headerActions,
}: BaseNodeProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col w-[320px] bg-[#1A1A1A] text-white rounded-[32px] p-5 shadow-xl transition-all duration-200 border border-transparent",
        selected && "border-primary ring-2 ring-primary/20",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-gray-300" />}
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {headerActions}
          <button
            onClick={onInspect}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

// Helper components for the "Guardrails" style
export const NodeSection = ({
  label,
  icon: Icon,
  children
}: {
  label: string;
  icon?: LucideIcon;
  children: ReactNode
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

export const NodePill = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn(
    "bg-[#2A2A2A] hover:bg-[#333333] text-gray-200 text-sm font-medium px-4 py-1.5 rounded-full transition-colors",
    className
  )}>
    {children}
  </div>
);

export const NodeProperty = ({
  label,
  value,
  icon: Icon
}: {
  label?: string;
  value: string;
  icon?: LucideIcon
}) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2A2A2A] text-gray-400">
      {Icon && <Icon className="w-5 h-5" />}
    </div>
    <div className="flex flex-col">
      {label && <span className="text-xs text-gray-500">{label}</span>}
      <span className="text-sm font-medium text-gray-200">{value}</span>
    </div>
  </div>
);
