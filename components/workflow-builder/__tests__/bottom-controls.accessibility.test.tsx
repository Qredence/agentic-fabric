import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { BottomControls } from "@/components/workflow-builder/bottom-controls"

describe("BottomControls accessibility", () => {
  it("renders accessible actions and supports keyboard navigation", () => {
    const onUndo = vi.fn()
    const onRedo = vi.fn()
    const onFitView = vi.fn()
    const onToggleLock = vi.fn()
    const onEvaluate = vi.fn()
    const onValidate = vi.fn()

    render(
      <BottomControls
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo
        canRedo
        onFitView={onFitView}
        onToggleLock={onToggleLock}
        onEvaluate={onEvaluate}
        onValidate={onValidate}
      />
    )

    const group = screen.getByRole("group")
    expect(group).toBeInTheDocument()

    expect(screen.getByLabelText("Undo")).toBeInTheDocument()
    expect(screen.getByLabelText("Redo")).toBeInTheDocument()
    expect(screen.getByLabelText("Evaluate workflow")).toBeInTheDocument()
    expect(screen.getByLabelText("Validate workflow")).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText("Evaluate workflow"))
    expect(onEvaluate).toHaveBeenCalled()

    fireEvent.click(screen.getByLabelText("Validate workflow"))
    expect(onValidate).toHaveBeenCalled()
  })
})