"use client"

import { useEffect, useRef, useState } from "react"

type Settings = {
  panSensitivity: number
  zoomSensitivity: number
  inertiaFriction: number
  maxMomentumSpeed: number
  enableWheelPan?: boolean
}

type ReactFlowApi = {
  getViewport: () => { x: number; y: number; zoom: number }
  setViewport: (v: { x: number; y: number; zoom: number }) => void
  project?: (pos: { x: number; y: number }) => { x: number; y: number }
  screenToFlowPosition?: (pos: { x: number; y: number }) => { x: number; y: number }
}

export function useTrackpadNavigation(
  el: React.MutableRefObject<HTMLElement | null>,
  api: ReactFlowApi,
  settings: Settings
) {
  const [navigating, setNavigating] = useState(false)
  const vx = useRef(0)
  const vy = useRef(0)
  const raf = useRef<number | null>(null)
  const endTimer = useRef<number | null>(null)
  const pinchActive = useRef(false)
  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const stopRaf = () => {
    if (raf.current) {
      cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }

  const scheduleEnd = () => {
    if (endTimer.current) window.clearTimeout(endTimer.current)
    endTimer.current = window.setTimeout(() => {
      if (reduced) {
        setNavigating(false)
        return
      }
      if (Math.abs(vx.current) < 0.001 && Math.abs(vy.current) < 0.001) {
        setNavigating(false)
        return
      }
      if (!raf.current) {
        const step = () => {
          const vpx = api.getViewport()
          const nx = vpx.x - vx.current
          const ny = vpx.y - vy.current
          api.setViewport({ x: nx, y: ny, zoom: vpx.zoom })
          vx.current *= settings.inertiaFriction
          vy.current *= settings.inertiaFriction
          if (Math.abs(vx.current) < 0.001 && Math.abs(vy.current) < 0.001) {
            setNavigating(false)
            raf.current = null
            return
          }
          raf.current = requestAnimationFrame(step)
        }
        raf.current = requestAnimationFrame(step)
      }
    }, 100)
  }

  useEffect(() => {
    const node = el.current
    if (!node) return

    const onWheel = (e: WheelEvent) => {
      if (!node) return
      if (e.ctrlKey) {
        e.preventDefault()
        pinchActive.current = true
        setNavigating(true)
        const vp = api.getViewport()
        const factor = Math.exp(-(e.deltaY || 0) * settings.zoomSensitivity)
        const targetZoom = Math.max(0.1, Math.min(4, vp.zoom * factor))
        const rect = node.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top
        const projector = api.project ?? api.screenToFlowPosition ?? ((p: { x: number; y: number }) => p)
        const pt = projector({ x: cx, y: cy })
        const k = targetZoom / vp.zoom
        const nx = pt.x - k * (pt.x - vp.x)
        const ny = pt.y - k * (pt.y - vp.y)
        api.setViewport({ x: nx, y: ny, zoom: targetZoom })
        scheduleEnd()
        return
      }
      if (settings.enableWheelPan !== false) {
        e.preventDefault()
        setNavigating(true)
        const vp = api.getViewport()
        const dx = (e.deltaX || 0) * settings.panSensitivity / vp.zoom
        const dy = (e.deltaY || 0) * settings.panSensitivity / vp.zoom
        const nx = vp.x - dx
        const ny = vp.y - dy
        api.setViewport({ x: nx, y: ny, zoom: vp.zoom })
        vx.current = Math.max(-settings.maxMomentumSpeed, Math.min(settings.maxMomentumSpeed, vx.current + dx))
        vy.current = Math.max(-settings.maxMomentumSpeed, Math.min(settings.maxMomentumSpeed, vy.current + dy))
        scheduleEnd()
      }
    }

    const onGestureStart = (e: Event) => {
      pinchActive.current = true
      setNavigating(true)
    }
    const onGestureChange = (e: Event) => {
      const ge = e as any
      if (typeof ge.scale !== "number") return
      const vp = api.getViewport()
      const targetZoom = Math.max(0.1, Math.min(4, vp.zoom * ge.scale))
      api.setViewport({ x: vp.x, y: vp.y, zoom: targetZoom })
    }
    const onGestureEnd = () => {
      pinchActive.current = false
      scheduleEnd()
    }

    node.addEventListener("wheel", onWheel, { passive: false })
    node.addEventListener("gesturestart", onGestureStart as any)
    node.addEventListener("gesturechange", onGestureChange as any)
    node.addEventListener("gestureend", onGestureEnd as any)

    return () => {
      stopRaf()
      if (endTimer.current) window.clearTimeout(endTimer.current)
      node.removeEventListener("wheel", onWheel as any)
      node.removeEventListener("gesturestart", onGestureStart as any)
      node.removeEventListener("gesturechange", onGestureChange as any)
      node.removeEventListener("gestureend", onGestureEnd as any)
    }
  }, [el, api, settings.panSensitivity, settings.zoomSensitivity, settings.inertiaFriction, settings.maxMomentumSpeed])

  return { navigating }
}