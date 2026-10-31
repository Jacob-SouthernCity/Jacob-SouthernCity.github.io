"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore, type PointerEvent } from "react";
import createGlobe, { type Arc, type COBEOptions, type Marker } from "cobe";
import { useTheme } from "next-themes";
import { useReducedMotion } from "motion/react";
import { useElementWidth } from "@/lib/hooks";
import type { LatLng } from "@/lib/geo";
import {
  anglesFor,
  clusterByDistance,
  projectToScreen,
  screenRadiansPerPixel,
  type Rotation,
} from "@/lib/globe-math";

type RGB = [number, number, number];

export type GlobeMarker = {
  id: string;
  location: LatLng;
  color: RGB;
  emphasized?: boolean;
};

export type GlobeArc = {
  from: LatLng;
  to: LatLng;
};

export type GlobeSelection =
  | { kind: "marker"; id: string }
  | { kind: "cluster"; ids: string[]; location: LatLng };

type GlobeProps = {
  markers: readonly GlobeMarker[];
  arcs?: readonly GlobeArc[];
  focus: LatLng | null;
  zoom?: number;
  label: string;
  onSelect?: (selection: GlobeSelection) => void;
};

type GlobePoint = {
  key: string;
  ids: string[];
  location: LatLng;
  color: RGB;
  count: number;
  emphasized: boolean;
};

const AUTO_ROTATE_SPEED = 0.0025;
const FOCUS_EASING = 0.08;
const ZOOM_EASING = 0.06;
const MARKER_SIZE = 0.055;
const EMPHASIZED_MARKER_SIZE = 0.07;
const MUTED_MARKER_SIZE = 0.03;
const MAX_CLUSTER_GROWTH = 2.2;
const CLUSTER_RADIUS_PX = 14;
const DRAG_THRESHOLD_PX = 5;
const HIT_RADIUS_PX = { mouse: 18, touch: 28 };
const ARC_COLOR: RGB = [0.39, 0.4, 0.95];
const MAX_TILT = 0.7;
const DEFAULT_THETA = 0.25;

type GlobeTheme = Pick<COBEOptions, "dark" | "diffuse" | "mapBrightness" | "baseColor" | "glowColor">;

const themes: Record<"light" | "dark", GlobeTheme> = {
  light: {
    dark: 0,
    diffuse: 1.2,
    mapBrightness: 6,
    baseColor: [1, 1, 1],
    glowColor: [0.85, 0.87, 1],
  },
  dark: {
    dark: 1,
    diffuse: 1.4,
    mapBrightness: 9,
    baseColor: [0.42, 0.44, 0.68],
    glowColor: [0.25, 0.26, 0.52],
  },
};

let webglSupport: boolean | undefined;

function supportsWebGL() {
  if (webglSupport === undefined) {
    const probe = document.createElement("canvas");
    webglSupport = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  }
  return webglSupport;
}

const subscribeToNothing = () => () => {};

function shortestAngle(delta: number) {
  return Math.atan2(Math.sin(delta), Math.cos(delta));
}

function pointSize(point: GlobePoint, hasEmphasis: boolean) {
  if (point.emphasized) return EMPHASIZED_MARKER_SIZE;
  const base = hasEmphasis ? MUTED_MARKER_SIZE : MARKER_SIZE;
  return base * Math.min(MAX_CLUSTER_GROWTH, 1 + 0.4 * Math.sqrt(point.count - 1));
}

export default function Globe({ markers, arcs = [], focus, zoom = 1, label, onSelect }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useElementWidth(containerRef);
  const { resolvedTheme } = useTheme();
  const themeName = resolvedTheme === "dark" ? "dark" : resolvedTheme ? "light" : null;
  const shouldReduceMotion = useReducedMotion();
  const hasWebGL = useSyncExternalStore(subscribeToNothing, supportsWebGL, () => true);

  const points = useMemo<GlobePoint[]>(() => {
    const maxAngle = size ? CLUSTER_RADIUS_PX * screenRadiansPerPixel(size, zoom) : 0;
    const inputs = markers.map((marker) => ({
      item: marker,
      location: marker.location,
      pinned: Boolean(marker.emphasized),
    }));
    return clusterByDistance(inputs, maxAngle).map(({ items, location }) => {
      const [lead] = items;
      return {
        key: items.length === 1 ? lead.id : `cluster-${lead.id}`,
        ids: items.map((item) => item.id),
        location,
        color: lead.color,
        count: items.length,
        emphasized: Boolean(lead.emphasized),
      };
    });
  }, [markers, size, zoom]);

  const hasEmphasis = points.some((point) => point.emphasized);
  const pointsRef = useRef<GlobePoint[]>([]);
  const markersRef = useRef<Marker[]>([]);
  const arcsRef = useRef<Arc[]>([]);
  const markersVersionRef = useRef(0);
  const labelsRef = useRef(new Map<string, HTMLSpanElement>());
  const rotationRef = useRef<Rotation>({ phi: 0, theta: DEFAULT_THETA });
  const targetRef = useRef<Rotation | null>(null);
  const pointerRef = useRef<{ x: number; y: number; phi: number; theta: number; dragging: boolean } | null>(null);
  const reduceMotionRef = useRef(shouldReduceMotion);
  const scaleRef = useRef({ current: 1, target: 1 });
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    reduceMotionRef.current = shouldReduceMotion;
    onSelectRef.current = onSelect;
  }, [shouldReduceMotion, onSelect]);

  useEffect(() => {
    pointsRef.current = points;
    markersRef.current = points.map((point) => ({
      location: point.location,
      color: point.color,
      size: pointSize(point, hasEmphasis),
    }));
    arcsRef.current = arcs.map(({ from, to }) => ({ from, to, color: ARC_COLOR }));
    markersVersionRef.current += 1;
  }, [points, arcs, hasEmphasis]);

  useEffect(() => {
    targetRef.current = focus ? anglesFor(focus) : null;
  }, [focus]);

  useEffect(() => {
    scaleRef.current.target = zoom;
  }, [zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size || !themeName) return;

    const rotation = rotationRef.current;
    const scale = scaleRef.current;
    const globe = createGlobe(canvas, {
      ...themes[themeName],
      width: size,
      height: size,
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      phi: rotation.phi,
      theta: rotation.theta,
      mapSamples: 16000,
      markerColor: ARC_COLOR,
      markers: markersRef.current,
      arcs: arcsRef.current,
      arcColor: ARC_COLOR,
      arcWidth: 0.6,
      arcHeight: 0.15,
      markerElevation: 0,
    });

    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);

    const placeLabels = () => {
      for (const point of pointsRef.current) {
        const element = labelsRef.current.get(point.key);
        if (!element) continue;
        const { x, y, visible } = projectToScreen(point.location, rotation, scale.current, size);
        element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        element.style.opacity = visible ? "1" : "0";
      }
    };

    let uploadedMarkersVersion = -1;
    let uploadedScale = -1;
    let frame = 0;
    const render = () => {
      if (isVisible) {
        const target = targetRef.current;
        const isDragging = pointerRef.current?.dragging ?? false;
        if (target && !isDragging) {
          rotation.phi += shortestAngle(target.phi - rotation.phi) * FOCUS_EASING;
          rotation.theta += (target.theta - rotation.theta) * FOCUS_EASING;
        } else if (!isDragging && !reduceMotionRef.current) {
          rotation.phi += AUTO_ROTATE_SPEED;
        }
        scale.current = reduceMotionRef.current
          ? scale.target
          : scale.current + (scale.target - scale.current) * ZOOM_EASING;

        const markersChanged =
          uploadedMarkersVersion !== markersVersionRef.current ||
          Math.abs(uploadedScale - scale.current) > 0.005;
        if (markersChanged) {
          uploadedMarkersVersion = markersVersionRef.current;
          uploadedScale = scale.current;
        }
        globe.update({
          phi: rotation.phi,
          theta: rotation.theta,
          scale: scale.current,
          ...(markersChanged && {
            markers: markersRef.current.map((marker) => ({ ...marker, size: marker.size / scale.current })),
            arcs: arcsRef.current,
          }),
        });
        placeLabels();
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    canvas.style.opacity = "1";

    return () => {
      cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      globe.destroy();
    };
  }, [size, themeName]);

  const pointAt = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hitRadius = event.pointerType === "mouse" ? HIT_RADIUS_PX.mouse : HIT_RADIUS_PX.touch;
    let nearest: { point: GlobePoint; distance: number } | null = null;
    for (const point of pointsRef.current) {
      const screen = projectToScreen(point.location, rotationRef.current, scaleRef.current.current, size);
      if (!screen.visible) continue;
      const distance = Math.hypot(screen.x - x, screen.y - y);
      if (distance <= hitRadius && (!nearest || distance < nearest.distance)) {
        nearest = { point, distance };
      }
    }
    return nearest?.point ?? null;
  };

  const releasePointer = () => {
    pointerRef.current = null;
  };

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square w-full max-w-[28rem]">
      {!hasWebGL && (
        <p className="flex size-full items-center justify-center rounded-full border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
          The interactive globe needs WebGL, which this browser does not support. Every place is still listed here.
        </p>
      )}
      <canvas
        hidden={!hasWebGL}
        ref={canvasRef}
        role="img"
        aria-label={label}
        className="size-full cursor-grab touch-pan-y rounded-full opacity-0 transition-opacity duration-1000 active:cursor-grabbing"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.style.cursor = "";
          pointerRef.current = {
            x: event.clientX,
            y: event.clientY,
            phi: rotationRef.current.phi,
            theta: rotationRef.current.theta,
            dragging: false,
          };
        }}
        onPointerMove={(event) => {
          const pointer = pointerRef.current;
          if (!pointer) {
            if (event.pointerType === "mouse") {
              event.currentTarget.style.cursor = pointAt(event) ? "pointer" : "";
            }
            return;
          }
          const deltaX = event.clientX - pointer.x;
          const deltaY = event.clientY - pointer.y;
          if (!pointer.dragging && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD_PX) return;
          pointer.dragging = true;
          targetRef.current = null;
          rotationRef.current.phi = pointer.phi + (deltaX / size) * Math.PI;
          rotationRef.current.theta = Math.max(
            -MAX_TILT,
            Math.min(MAX_TILT, pointer.theta + (deltaY / size) * Math.PI)
          );
        }}
        onPointerUp={(event) => {
          const wasDragging = pointerRef.current?.dragging ?? true;
          releasePointer();
          if (wasDragging) return;
          const point = pointAt(event);
          if (!point) return;
          onSelectRef.current?.(
            point.count === 1
              ? { kind: "marker", id: point.ids[0] }
              : { kind: "cluster", ids: point.ids, location: point.location }
          );
        }}
        onPointerCancel={releasePointer}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden>
        {points
          .filter((point) => point.count > 1 && !hasEmphasis)
          .map((point) => (
            <span
              key={point.key}
              ref={(element) => {
                if (element) labelsRef.current.set(point.key, element);
                else labelsRef.current.delete(point.key);
              }}
              className="absolute top-0 left-0 text-[0.625rem] leading-none font-bold text-white tabular-nums opacity-0 transition-opacity duration-300 [text-shadow:0_0_3px_rgb(0_0_0/0.6)]"
            >
              {point.count}
            </span>
          ))}
      </div>
    </div>
  );
}
