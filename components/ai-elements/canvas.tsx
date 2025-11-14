import { Background, ReactFlow, type ReactFlowProps } from "@xyflow/react"
import type { ReactNode } from "react"
import "@xyflow/react/dist/style.css"

type CanvasProps = ReactFlowProps & {
  children?: ReactNode
}

export const Canvas = ({ children, ...props }: CanvasProps) => (
  <ReactFlow
    deleteKeyCode={["Backspace", "Delete"]}
    fitView
    panOnDrag={[2, 3]}
    panOnScroll={false}
    selectionOnDrag={true}
    selectionKeyCode="Shift"
    zoomOnScroll={true}
    zoomOnPinch={true}
    zoomOnDoubleClick={false}
    snapToGrid={false}
    snapGrid={[15, 15]}
    {...props}
  >
    <Background bgColor="var(--sidebar)" />
    {children}
  </ReactFlow>
)
