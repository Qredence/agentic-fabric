import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import React from "react"
import { useRef } from "react"
import { useTrackpadNavigation } from "@/hooks/use-trackpad-navigation"

function FakeCanvas({ api }: { api: any }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { navigating } = useTrackpadNavigation(ref as any, api, { panSensitivity: 1, zoomSensitivity: 0.003, inertiaFriction: 0.92, maxMomentumSpeed: 3 })
  return <div data-testid="wrap" ref={ref} className={navigating ? "flow-navigating" : ""} style={{ width: 200, height: 200 }} />
}

describe("Trackpad navigation", () => {
  it("pans on wheel deltas", () => {
    const getViewport = vi.fn().mockReturnValue({ x: 0, y: 0, zoom: 1 })
    const setViewport = vi.fn()
    const project = vi.fn().mockImplementation((p) => p)
    const { getByTestId } = render(<FakeCanvas api={{ getViewport, setViewport, project }} />)
    const wrap = getByTestId("wrap")
    const evt = new WheelEvent("wheel", { deltaX: 10, deltaY: 5, bubbles: true, cancelable: true })
    wrap.dispatchEvent(evt)
    expect(setViewport).toHaveBeenCalled()
    const arg = setViewport.mock.calls[0][0]
    expect(arg.x).toBe(-10)
    expect(arg.y).toBe(-5)
  })

  it("zooms with ctrlKey pinch wheel", () => {
    const getViewport = vi.fn().mockReturnValue({ x: 0, y: 0, zoom: 1 })
    const setViewport = vi.fn()
    const project = vi.fn().mockImplementation((p) => p)
    const { getByTestId } = render(<FakeCanvas api={{ getViewport, setViewport, project }} />)
    const wrap = getByTestId("wrap")
    const evt = new WheelEvent("wheel", { deltaY: -40, ctrlKey: true, bubbles: true, cancelable: true })
    wrap.dispatchEvent(evt)
    expect(setViewport).toHaveBeenCalled()
    const arg = setViewport.mock.calls[0][0]
    expect(arg.zoom).toBeGreaterThan(1)
  })
})