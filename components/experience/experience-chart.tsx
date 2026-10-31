"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { FiMaximize2, FiMinus, FiPlus } from "react-icons/fi";
import { formatDateRange, monthLabel, toMonthIndex } from "@/lib/dates";
import { useCurrentMonthIndex, useElementWidth } from "@/lib/hooks";
import type { Experience } from "@/lib/content/schema";
import { experienceKindStyles } from "./experience-kind";

const MAX_PX_PER_MONTH = 96;
const MONTH_LINE_PX = 14;
const MONTH_LABEL_PX = 34;
const FULL_YEAR_LABEL_PX = 44;
const ZOOM_STEP = 2;
const EASE = [0.4, 0, 0.2, 1] as const;

type ExperienceChartProps = {
  items: readonly Experience[];
  onSelect: (id: string) => void;
};

type Domain = {
  start: number;
  end: number;
  presentEnd: number;
};

function buildDomain(items: readonly Experience[], currentMonth: number | null): Domain {
  const latestKnownMonth = Math.max(...items.map((item) => toMonthIndex(item.end ?? item.start)));
  const presentEnd = Math.max(currentMonth ?? latestKnownMonth, latestKnownMonth) + 1;
  const startYear = Math.floor(Math.min(...items.map((item) => toMonthIndex(item.start))) / 12);
  const endYear = Math.ceil(
    Math.max(...items.map((item) => (item.end ? toMonthIndex(item.end) + 1 : presentEnd))) / 12
  );

  return {
    start: startYear * 12,
    end: Math.max(endYear, startYear + 1) * 12,
    presentEnd,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const zoomButtonClassName =
  "flex size-7 items-center justify-center rounded-full pointer-coarse:size-10 text-slate-600 transition-colors hover:bg-slate-900/5 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white";

export default function ExperienceChart({ items, onSelect }: ExperienceChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportWidth = useElementWidth(scrollRef);
  const domain = buildDomain(items, useCurrentMonthIndex());
  const monthCount = domain.end - domain.start;
  const maxZoom = viewportWidth ? Math.max(1, (MAX_PX_PER_MONTH * monthCount) / viewportWidth) : 1;

  const [requestedZoom, setRequestedZoom] = useState(1);
  const zoom = Math.min(requestedZoom, maxZoom);
  const zoomRef = useRef(zoom);
  const zoomAnimationRef = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const zoomTo = useCallback(
    (target: number, { anchorX, animated = true }: { anchorX?: number; animated?: boolean } = {}) => {
      const element = scrollRef.current;
      if (!element) return;

      const from = Math.min(zoomRef.current, maxZoom);
      const to = clamp(target, 1, maxZoom);
      const anchor = anchorX ?? element.clientWidth / 2;
      const anchorRatio = (element.scrollLeft + anchor) / (element.clientWidth * from);

      const apply = (value: number) => {
        zoomRef.current = value;
        flushSync(() => setRequestedZoom(value));
        element.scrollLeft = anchorRatio * element.clientWidth * value - anchor;
      };

      zoomAnimationRef.current?.stop();
      if (!animated || shouldReduceMotion) {
        apply(to);
        return;
      }
      zoomAnimationRef.current = animate(from, to, { duration: 0.35, ease: EASE, onUpdate: apply });
    },
    [maxZoom, shouldReduceMotion]
  );

  useEffect(() => () => zoomAnimationRef.current?.stop(), []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const anchorFor = (clientX: number) => clientX - element.getBoundingClientRect().left;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomTo(zoomRef.current * Math.exp(-event.deltaY * 0.01), {
        anchorX: anchorFor(event.clientX),
        animated: false,
      });
    };

    let pinch: { distance: number; zoom: number } | null = null;
    const touchDistance = (touches: TouchList) =>
      Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        pinch = { distance: touchDistance(event.touches), zoom: zoomRef.current };
      }
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const midpointX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      zoomTo((pinch.zoom * touchDistance(event.touches)) / pinch.distance, {
        anchorX: anchorFor(midpointX),
        animated: false,
      });
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) pinch = null;
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd);
    element.addEventListener("touchcancel", onTouchEnd);
    return () => {
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [zoomTo]);

  const pxPerMonth = (viewportWidth * zoom) / monthCount;
  const showMonthLines = pxPerMonth >= MONTH_LINE_PX;
  const showMonthLabels = pxPerMonth >= MONTH_LABEL_PX;
  const showFullYears = pxPerMonth * 12 >= FULL_YEAR_LABEL_PX;
  const toPercent = (monthIndex: number) => ((monthIndex - domain.start) / monthCount) * 100;
  const ticks = Array.from({ length: monthCount + 1 }, (_, i) => domain.start + i).filter(
    (month) => month % 12 === 0 || showMonthLines
  );
  const isZoomed = zoom > 1.001;

  return (
    <div className="rounded-2xl border border-black/5 bg-white/60 p-4 shadow-sm backdrop-blur-sm sm:p-6 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
          Pinch or Ctrl + scroll to zoom
        </p>
        <div className="ml-auto flex items-center gap-0.5 rounded-full border border-black/5 bg-white/70 p-0.5 dark:border-white/10 dark:bg-white/5">
          <button
            type="button"
            className={zoomButtonClassName}
            onClick={() => zoomTo(zoom / ZOOM_STEP)}
            disabled={!isZoomed}
            aria-label="Zoom out"
          >
            <FiMinus />
          </button>
          <span className="w-11 text-center font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
            {zoom.toFixed(1)}×
          </span>
          <button
            type="button"
            className={zoomButtonClassName}
            onClick={() => zoomTo(zoom * ZOOM_STEP)}
            disabled={zoom >= maxZoom - 0.001}
            aria-label="Zoom in"
          >
            <FiPlus />
          </button>
          <button
            type="button"
            className={zoomButtonClassName}
            onClick={() => zoomTo(1)}
            disabled={!isZoomed}
            aria-label="Fit timeline to view"
          >
            <FiMaximize2 className="text-[0.8rem]" />
          </button>
        </div>
      </div>

      <div className="flex">
        <ul className="hidden w-40 shrink-0 pt-6 pr-4 sm:block" aria-hidden>
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex h-12 min-w-0 flex-col justify-center"
              >
                <p className="truncate text-sm font-semibold">{item.shortName ?? item.organization}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.title}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div
          ref={scrollRef}
          className="min-w-0 flex-1 touch-pan-x touch-pan-y overflow-x-auto overscroll-x-contain rounded-md [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
          tabIndex={isZoomed ? 0 : -1}
          role="region"
          aria-label="Experience timeline"
        >
          <div className="relative" style={{ width: `${zoom * 100}%` }}>
            <div className="relative h-6 font-mono text-[0.7rem] text-slate-500 tabular-nums sm:text-xs dark:text-slate-400" aria-hidden>
              <AnimatePresence initial={false}>
                {ticks
                  .filter((month) => month % 12 === 0 || showMonthLabels)
                  .map((month) => {
                    const isYear = month % 12 === 0;
                    const alignment =
                      month === domain.start ? "" : month === domain.end ? "-translate-x-full" : "-translate-x-1/2";
                    return (
                      <motion.span
                        key={month}
                        className={`absolute top-0 whitespace-nowrap ${alignment} ${isYear ? "font-medium text-slate-600 dark:text-slate-300" : ""}`}
                        initial={{ opacity: 0, left: `${toPercent(month)}%` }}
                        animate={{ opacity: 1, left: `${toPercent(month)}%` }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      >
                        {isYear
                          ? showFullYears
                            ? Math.floor(month / 12)
                            : `'${String(Math.floor(month / 12) % 100).padStart(2, "0")}`
                          : monthLabel(month % 12)}
                      </motion.span>
                    );
                  })}
              </AnimatePresence>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <AnimatePresence initial={false}>
                  {ticks.map((month) => (
                    <motion.span
                      key={month}
                      className={`absolute inset-y-0 w-px ${month % 12 === 0 ? "bg-slate-200 dark:bg-white/10" : "bg-slate-100 dark:bg-white/5"}`}
                      initial={{ opacity: 0, left: `${toPercent(month)}%` }}
                      animate={{ opacity: 1, left: `${toPercent(month)}%` }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <ul>
                <AnimatePresence initial={false}>
                  {items.map((item, index) => {
                    const style = experienceKindStyles[item.kind];
                    const start = toMonthIndex(item.start);
                    const end = item.end ? toMonthIndex(item.end) + 1 : domain.presentEnd;
                    const left = toPercent(start);
                    const width = toPercent(end) - left;
                    const description = `${item.title}, ${item.organization}, ${formatDateRange(item.start, item.end)}`;

                    return (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="relative flex h-16 flex-col sm:h-12"
                      >
                        <div className="sticky left-0 w-fit max-w-[80vw] pt-2 sm:hidden" aria-hidden>
                          <p className="truncate text-sm font-semibold">
                            {item.shortName ?? item.organization}
                            <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">{item.title}</span>
                          </p>
                        </div>
                        <div className="relative flex-1">
                          <motion.button
                            type="button"
                            onClick={() => onSelect(item.id)}
                            aria-label={description}
                            title={description}
                            className={`absolute inset-y-0 my-auto h-3.5 min-w-3 origin-left cursor-pointer rounded-full shadow-sm before:absolute before:-inset-y-3 before:inset-x-0 before:content-[''] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${style.bar}`}
                            initial={{ scaleX: 0, left: `${left}%`, width: `${width}%` }}
                            animate={{ left: `${left}%`, width: `${width}%`, transition: { duration: 0.5, ease: EASE } }}
                            whileInView={{ scaleX: 1, transition: { duration: 0.7, delay: 0.08 * index, ease: "easeOut" } }}
                            viewport={{ once: true }}
                          >
                            {item.end === null && (
                              <span className="absolute -right-1 inset-y-0 my-auto flex size-3">
                                <span className={`absolute inline-flex size-full rounded-full opacity-75 motion-safe:animate-ping ${style.dot}`} />
                                <span className={`relative inline-flex size-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${style.dot}`} />
                              </span>
                            )}
                          </motion.button>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
