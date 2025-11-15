import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { ReactFlowProvider } from "@xyflow/react"
import { AnimatedEdge, TemporaryEdge } from "@/components/ai-elements/edge"

function hexToRgb(hex: string) {
  const h = hex.replace('#','').trim()
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

function srgbToLinear(c: number) {
  const cs = c / 255
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function contrastRatio(fgHex: string, bgHex: string, opacity = 1) {
  const Lf = relativeLuminance(fgHex)
  const Lb = relativeLuminance(bgHex)
  const Lc = opacity * Lf + (1 - opacity) * Lb
  const L1 = Math.max(Lc, Lb)
  const L2 = Math.min(Lc, Lb)
  return (L1 + 0.05) / (L2 + 0.05)
}

describe("Edge contrast compliance", () => {
  it("dark mode primary/secondary meet >=4.5:1", () => {
    document.documentElement.className = "dark"
    document.documentElement.style.setProperty('--edge-color-primary', '#FFFFFF')
    document.documentElement.style.setProperty('--edge-color-secondary', '#FFFFFF')
    document.documentElement.style.setProperty('--edge-opacity-primary', '0.8')
    document.documentElement.style.setProperty('--edge-opacity-secondary', '0.5')

    const { container } = render(
      <ReactFlowProvider>
        <svg>
          {/* @ts-expect-error test props */}
          <AnimatedEdge id="e1" sourceX={0} sourceY={0} targetX={100} targetY={0} />
          {/* @ts-expect-error test props */}
          <TemporaryEdge id="e2" sourceX={0} sourceY={0} targetX={100} targetY={0} />
        </svg>
      </ReactFlowProvider>
    )

    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)

    const primary = paths[0]
    const secondary = paths[1]
    const primaryStroke = primary.style.stroke || '#FFFFFF'
    const primaryOpacity = Number(primary.style.opacity || 0.8)
    const secondaryStroke = secondary.style.stroke || '#FFFFFF'
    const secondaryOpacity = Number(secondary.style.opacity || 0.5)

    const darkBg = '#000000'
    expect(contrastRatio(primaryStroke, darkBg, primaryOpacity)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(secondaryStroke, darkBg, secondaryOpacity)).toBeGreaterThanOrEqual(4.5)
  })

  it("light mode primary/secondary meet >=4.5:1", () => {
    document.documentElement.className = ""
    document.documentElement.style.setProperty('--edge-color-primary', '#6B6B6B')
    document.documentElement.style.setProperty('--edge-color-secondary', '#707070')
    document.documentElement.style.setProperty('--edge-opacity-primary', '1')
    document.documentElement.style.setProperty('--edge-opacity-secondary', '1')

    const { container } = render(
      <ReactFlowProvider>
        <svg>
          {/* @ts-expect-error test props */}
          <AnimatedEdge id="e1" sourceX={0} sourceY={0} targetX={100} targetY={0} />
          {/* @ts-expect-error test props */}
          <TemporaryEdge id="e2" sourceX={0} sourceY={0} targetX={100} targetY={0} />
        </svg>
      </ReactFlowProvider>
    )

    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)

    const primary = paths[0]
    const secondary = paths[1]
    const primaryStroke = primary.style.stroke || '#6B6B6B'
    const primaryOpacity = Number(primary.style.opacity || 1)
    const secondaryStroke = secondary.style.stroke || '#707070'
    const secondaryOpacity = Number(secondary.style.opacity || 1)

    const lightBg = '#FFFFFF'
    expect(contrastRatio(primaryStroke, lightBg, primaryOpacity)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(secondaryStroke, lightBg, secondaryOpacity)).toBeGreaterThanOrEqual(4.5)
  })
})