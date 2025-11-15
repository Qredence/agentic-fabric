import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomControls } from "@/components/workflow-builder/bottom-controls";

describe("BottomControls using ExpandableTabs", () => {
  it("renders toolbar and triggers actions", () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    const onFitView = vi.fn();
    const onToggleLock = vi.fn();
    const onEvaluate = vi.fn();
    const onValidate = vi.fn();
    render(
      <BottomControls
        canUndo
        canRedo
        onUndo={onUndo}
        onRedo={onRedo}
        onFitView={onFitView}
        onToggleLock={onToggleLock}
        onEvaluate={onEvaluate}
        onValidate={onValidate}
      />
    );

    const toolbar = screen.getByRole("group");
    expect(toolbar).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Undo"));
    fireEvent.click(screen.getByLabelText("Redo"));
    fireEvent.click(screen.getByLabelText("Auto-fit view"));
    fireEvent.click(screen.getByLabelText("Lock node edits"));
    fireEvent.click(screen.getByLabelText("Evaluate workflow"));
    fireEvent.click(screen.getByLabelText("Validate workflow"));

    expect(onUndo).toHaveBeenCalled();
    expect(onRedo).toHaveBeenCalled();
    expect(onFitView).toHaveBeenCalled();
    expect(onToggleLock).toHaveBeenCalled();
    expect(onEvaluate).toHaveBeenCalled();
    expect(onValidate).toHaveBeenCalled();
  });

  it("respects disabled undo/redo", () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    render(<BottomControls canUndo={false} canRedo={false} onUndo={onUndo} onRedo={onRedo} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(onUndo).not.toHaveBeenCalled();
    expect(onRedo).not.toHaveBeenCalled();
  });
});