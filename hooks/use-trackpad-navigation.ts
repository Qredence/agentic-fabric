'use client';

import { useEffect, useRef, useState } from 'react';

type Settings = {
  panSensitivity: number;
  zoomSensitivity: number;
  inertiaFriction: number;
  maxMomentumSpeed: number;
  enableWheelPan?: boolean;
};

type ReactFlowApi = {
  getViewport: () => { x: number; y: number; zoom: number };
  setViewport: (v: { x: number; y: number; zoom: number }) => void;
  project?: (pos: { x: number; y: number }) => { x: number; y: number };
  screenToFlowPosition?: (pos: { x: number; y: number }) => { x: number; y: number };
};

export function useTrackpadNavigation(
  el: React.MutableRefObject<HTMLElement | null>,
  api: ReactFlowApi,
  settings: Settings,
) {
  const [navigating, setNavigating] = useState(false);
  const vx = useRef(0);
  const vy = useRef(0);
  const raf = useRef<number | null>(null);
  const endTimer = useRef<number | null>(null);
  const pinchActive = useRef(false);
  const pinchBaseDistance = useRef<number | null>(null);
  const pinchBaseZoom = useRef<number | null>(null);
  const zoomRaf = useRef<number | null>(null);
  const targetZoomRef = useRef<number | null>(null);
  const zoomCenterRef = useRef<{ x: number; y: number } | null>(null);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopRaf = () => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  };

  const scheduleEnd = () => {
    if (endTimer.current) window.clearTimeout(endTimer.current);
    endTimer.current = window.setTimeout(() => {
      if (reduced) {
        setNavigating(false);
        return;
      }
      if (Math.abs(vx.current) < 0.001 && Math.abs(vy.current) < 0.001) {
        setNavigating(false);
        return;
      }
      if (!raf.current) {
        const step = () => {
          const vpx = api.getViewport();
          const nx = vpx.x - vx.current;
          const ny = vpx.y - vy.current;
          api.setViewport({ x: nx, y: ny, zoom: vpx.zoom });
          vx.current *= settings.inertiaFriction;
          vy.current *= settings.inertiaFriction;
          if (Math.abs(vx.current) < 0.001 && Math.abs(vy.current) < 0.001) {
            setNavigating(false);
            raf.current = null;
            return;
          }
          raf.current = requestAnimationFrame(step);
        };
        raf.current = requestAnimationFrame(step);
      }
    }, 100);
  };

  const clampViewport = (x: number, y: number, zoom: number) => {
    const z = Math.max(0.1, Math.min(4, zoom));
    const limit = 10000;
    return {
      x: Math.max(-limit, Math.min(limit, x)),
      y: Math.max(-limit, Math.min(limit, y)),
      zoom: z,
    };
  };

  const animateZoomTo = (
    node: HTMLElement,
    targetZoom: number,
    center: { x: number; y: number },
  ) => {
    const vp = api.getViewport();
    const rect = node.getBoundingClientRect();
    const cx = center.x;
    const cy = center.y;
    const projector =
      api.project ?? api.screenToFlowPosition ?? ((p: { x: number; y: number }) => p);
    const pt = projector({ x: cx, y: cy });
    const clampedTarget = Math.max(0.1, Math.min(4, targetZoom));
    targetZoomRef.current = clampedTarget;
    zoomCenterRef.current = pt;
    if (zoomRaf.current) {
      cancelAnimationFrame(zoomRaf.current);
      zoomRaf.current = null;
    }
    setNavigating(true);
    const duration = reduced ? 0 : 120;
    const start = performance.now();
    const startZoom = vp.zoom;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const z = startZoom + (clampedTarget - startZoom) * ease(t);
      const k = z / vp.zoom;
      const nx = pt.x - k * (pt.x - vp.x);
      const ny = pt.y - k * (pt.y - vp.y);
      const next = clampViewport(nx, ny, z);
      api.setViewport(next);
      if (t < 1) {
        zoomRaf.current = requestAnimationFrame(step);
      } else {
        zoomRaf.current = null;
        scheduleEnd();
      }
    };
    step(performance.now());
    if (duration > 0) zoomRaf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const node = el.current;
    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      if (!node) return;
      if (e.ctrlKey) {
        e.preventDefault();
        pinchActive.current = true;
        setNavigating(true);
        const rect = node.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const vp = api.getViewport();
        const step = 0.08;
        const dir = e.deltaY < 0 ? 1 : -1;
        const targetZoom = vp.zoom * (1 + dir * step);
        animateZoomTo(node, targetZoom, { x: cx, y: cy });
        return;
      }
      if (settings.enableWheelPan !== false) {
        e.preventDefault();
        setNavigating(true);
        const vp = api.getViewport();
        const dx = ((e.deltaX || 0) * settings.panSensitivity) / vp.zoom;
        const dy = ((e.deltaY || 0) * settings.panSensitivity) / vp.zoom;
        const next = clampViewport(vp.x - dx, vp.y - dy, vp.zoom);
        api.setViewport(next);
        vx.current = Math.max(
          -settings.maxMomentumSpeed,
          Math.min(settings.maxMomentumSpeed, vx.current + dx),
        );
        vy.current = Math.max(
          -settings.maxMomentumSpeed,
          Math.min(settings.maxMomentumSpeed, vy.current + dy),
        );
        scheduleEnd();
      } else {
        e.preventDefault();
        setNavigating(true);
        const rect = node.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const vp = api.getViewport();
        const step = 0.08;
        const dir = e.deltaY < 0 ? 1 : -1;
        const targetZoom = vp.zoom * (1 + dir * step);
        animateZoomTo(node, targetZoom, { x: cx, y: cy });
      }
    };

    const onGestureStart = (e: Event) => {
      pinchActive.current = true;
      setNavigating(true);
    };
    const onGestureChange = (e: Event) => {
      const ge = e as any;
      if (typeof ge.scale !== 'number') return;
      const vp = api.getViewport();
      const targetZoom = Math.max(0.1, Math.min(4, vp.zoom * ge.scale));
      const rect = node.getBoundingClientRect();
      const center = { x: rect.width / 2, y: rect.height / 2 };
      animateZoomTo(node, targetZoom, center);
    };
    const onGestureEnd = () => {
      pinchActive.current = false;
      scheduleEnd();
    };

    const getTouchDistance = (t1: Touch, t2: Touch) => {
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.hypot(dx, dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        pinchActive.current = true;
        setNavigating(true);
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        pinchBaseDistance.current = getTouchDistance(t1, t2);
        pinchBaseZoom.current = api.getViewport().zoom;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pinchActive.current || e.touches.length < 2) return;
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = getTouchDistance(t1, t2);
      const baseDist = pinchBaseDistance.current || dist;
      const baseZoom = pinchBaseZoom.current || api.getViewport().zoom;
      const scale = dist / baseDist;
      const threshold = 0.02;
      if (Math.abs(scale - 1) < threshold) return;
      const rect = node.getBoundingClientRect();
      const cx = (t1.clientX + t2.clientX) / 2 - rect.left;
      const cy = (t1.clientY + t2.clientY) / 2 - rect.top;
      const targetZoom = baseZoom * scale;
      animateZoomTo(node, targetZoom, { x: cx, y: cy });
    };

    const onTouchEnd = () => {
      pinchActive.current = false;
      pinchBaseDistance.current = null;
      pinchBaseZoom.current = null;
      scheduleEnd();
    };

    node.addEventListener('wheel', onWheel, { passive: false });
    node.addEventListener('gesturestart', onGestureStart as any);
    node.addEventListener('gesturechange', onGestureChange as any);
    node.addEventListener('gestureend', onGestureEnd as any);
    node.addEventListener('touchstart', onTouchStart as any, { passive: true });
    node.addEventListener('touchmove', onTouchMove as any, { passive: false });
    node.addEventListener('touchend', onTouchEnd as any);

    return () => {
      stopRaf();
      if (endTimer.current) window.clearTimeout(endTimer.current);
      node.removeEventListener('wheel', onWheel as any);
      node.removeEventListener('gesturestart', onGestureStart as any);
      node.removeEventListener('gesturechange', onGestureChange as any);
      node.removeEventListener('gestureend', onGestureEnd as any);
      node.removeEventListener('touchstart', onTouchStart as any);
      node.removeEventListener('touchmove', onTouchMove as any);
      node.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [
    el,
    api,
    settings.panSensitivity,
    settings.zoomSensitivity,
    settings.inertiaFriction,
    settings.maxMomentumSpeed,
  ]);

  return { navigating };
}
