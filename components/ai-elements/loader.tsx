import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type LoaderIconProps = {
  size?: number;
};

const LoaderIcon = ({ size = 16 }: LoaderIconProps) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <title>Loader</title>
    <g clipPath="url(#clip0_2393_1490)">
      <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 16V12"
        opacity="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.29773 1.52783L5.64887 4.7639"
        opacity="0.9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12.7023 1.52783L10.3511 4.7639"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12.7023 14.472L10.3511 11.236"
        opacity="0.4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.29773 14.472L5.64887 11.236"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.6085 5.52783L11.8043 6.7639"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M0.391602 10.472L4.19583 9.23598"
        opacity="0.7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.6085 10.4722L11.8043 9.2361"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M0.391602 5.52783L4.19583 6.7639"
        opacity="0.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_2393_1490">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>
);

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => (
  <div
    className={cn(
      "inline-flex animate-spin items-center justify-center",
      "transition-all duration-300 ease-out",
      className
    )}
    {...props}
  >
    <LoaderIcon size={size} />
  </div>
);

export const SkeletonLoader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "animate-shimmer-enhanced bg-gradient-to-r from-transparent via-foreground/10 to-transparent",
      "rounded-lg",
      className
    )}
    {...props}
  />
);

export const NodeSkeleton = () => (
  <div data-testid="node-skeleton" className="w-[352px] h-[200px] rounded-xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-4">
    <div className="flex items-center gap-3 mb-4">
      <SkeletonLoader className="w-3 h-3 rounded-full" />
      <SkeletonLoader className="h-6 w-32 rounded" />
    </div>
    <div className="space-y-3">
      <SkeletonLoader className="h-4 w-full rounded" />
      <SkeletonLoader className="h-4 w-4/5 rounded" />
      <SkeletonLoader className="h-4 w-3/5 rounded" />
    </div>
  </div>
);
