import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomControls } from "@/components/workflow-builder/bottom-controls";

describe("BottomControls unified toolbar", () => {
  it("renders Undo/Redo/Auto-fit/Lock controls", () => {
    render(<BottomControls canUndo canRedo />);
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /redo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /auto-fit view/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /lock node edits/i })).toBeInTheDocument();
  });

  it("calls provided callbacks", () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    const onFitView = vi.fn();
    const onToggleLock = vi.fn();
    render(
      <BottomControls
        canUndo
        canRedo
        onUndo={onUndo}
        onRedo={onRedo}
        onFitView={onFitView}
        onToggleLock={onToggleLock}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /undo/i }));
    fireEvent.click(screen.getByRole("button", { name: /redo/i }));
    fireEvent.click(screen.getByRole("button", { name: /auto-fit view/i }));
    fireEvent.click(screen.getByRole("button", { name: /lock node edits/i }));
    expect(onUndo).toHaveBeenCalled();
    expect(onRedo).toHaveBeenCalled();
    expect(onFitView).toHaveBeenCalled();
    expect(onToggleLock).toHaveBeenCalled();
  });
});

