import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Handle, Position } from '@xyflow/react';
import type { ComponentProps } from 'react';

export type NodeProps = ComponentProps<typeof Card> & {
  handles: {
    target: boolean;
    source: boolean;
  };
};

export const Node = ({ handles, className, ...props }: NodeProps) => (
  <Card
    className={cn(
      'node-container relative size-full h-auto w-sm gap-0 rounded-lg p-0 transition-all duration-300 ease-out',
      'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]',
      'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      'group/node',
      className,
    )}
    {...props}
  >
    {handles.target && (
      <Handle
        position={Position.Left}
        type="target"
        className="!bg-primary !border-2 !border-background transition-all duration-200 hover:!scale-125"
      />
    )}
    {handles.source && (
      <Handle
        position={Position.Right}
        type="source"
        className="!bg-primary !border-2 !border-background transition-all duration-200 hover:!scale-125"
      />
    )}
    {props.children}
  </Card>
);

export type NodeHeaderProps = ComponentProps<typeof CardHeader>;

export const NodeHeader = ({ className, ...props }: NodeHeaderProps) => (
  <CardHeader
    className={cn(
      'gap-0.5 rounded-t-lg border-b bg-gradient-to-r from-secondary to-secondary/80 p-4',
      'transition-all duration-300 ease-out',
      'group-hover/node:bg-gradient-to-r group-hover/node:from-secondary group-hover/node:to-accent/20',
      className,
    )}
    {...props}
  />
);

export type NodeTitleProps = ComponentProps<typeof CardTitle>;

export const NodeTitle = (props: NodeTitleProps) => <CardTitle {...props} />;

export type NodeDescriptionProps = ComponentProps<typeof CardDescription>;

export const NodeDescription = (props: NodeDescriptionProps) => <CardDescription {...props} />;

export type NodeActionProps = ComponentProps<typeof CardAction>;

export const NodeAction = (props: NodeActionProps) => <CardAction {...props} />;

export type NodeContentProps = ComponentProps<typeof CardContent>;

export const NodeContent = ({ className, ...props }: NodeContentProps) => (
  <CardContent className={cn('p-4 transition-all duration-300 ease-out', className)} {...props} />
);

export type NodeFooterProps = ComponentProps<typeof CardFooter>;

export const NodeFooter = ({ className, ...props }: NodeFooterProps) => (
  <CardFooter
    className={cn(
      'rounded-b-lg border-t bg-gradient-to-r from-secondary/50 to-secondary/30 p-4',
      'transition-all duration-300 ease-out',
      'group-hover/node:bg-gradient-to-r group-hover/node:from-secondary group-hover/node:to-accent/10',
      className,
    )}
    {...props}
  />
);
