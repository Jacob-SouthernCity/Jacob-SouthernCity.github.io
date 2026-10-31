"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, animate, motion, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { FiMaximize2, FiMinus, FiPlus } from "react-icons/fi";
import { formatDateRange, monthLabel, toMonthIndex } from "@/lib/dates";
import { useCurrentMonthIndex, useElementMeasure } from "@/lib/hooks";
import type { Experience } from "@/lib/content/schema";
import { experienceKindStyles } from "./experience-kind";
import { useI18n } from "../i18n-provider";

const MAX_PX_PER_MONTH = 96;
const MONTH_LINE_PX = 14;
const MONTH_LABEL_PX = 30;
const FULL_YEAR_LABEL_PX = 44;
const ZOOM_STEP = 2;
const EASE = [0.4, 0, 0.2, 1] as const;
const LONG_PRESS_MS = 400;
const TOOLTIP_HALF_WIDTH_PX = 120;
const TOOLTIP_EDGE_PX = 8;
const LABEL_SIDE_THRESHOLD_PERCENT = 70;

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

function horizontalPadding(element: HTMLElement) {
  const style = getComputedStyle(element);
  return {
    left: parseFloat(style.paddingLeft),
    right: parseFloat(style.paddingRight),
  };
}

function contentWidth(element: HTMLElement) {
  const padding = horizontalPadding(element);
  return element.clientWidth - padding.left - padding.right;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type Tooltip = {
  id: string;
  x: number;
  y: number;
};

function ExperienceTooltip({ item, x, y }: { item: Experience; x: number; y: number }) {
  const style = experienceKindStyles[item.kind];
  const { locale } = useI18n();
  return (
    <motion.div
      className="pointer-events-none absolute z-20 w-60 -translate-x-1/2 -translate-y-full pb-2"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      aria-hidden
    >
      <div className="rounded-xl border border-black/5 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-800/95">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <span className={`size-2 shrink-0 rounded-full ${style.dot}`} />
          <span className="truncate">{item.organization}</span>
        </p>
        <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">{item.title}</p>
        <p className="mt-1 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
          {formatDateRange(item.start, item.end, locale)}
          {item.location && ` · ${item.location}`}
        </p>
      </div>
    </motion.div>
  );
}

const zoomButtonClassName =
  "flex size-7 items-center justify-center rounded-full pointer-coarse:size-10 text-slate-600 transition-colors hover:bg-slate-900/5 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white";

export default function ExperienceChart({ items, onSelect }: ExperienceChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const { locale, t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const longPressRef = useRef<{ timer: number; fired: boolean } | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const viewportWidth = useElementMeasure(scrollRef, contentWidth);
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
      const width = contentWidth(element);
      const offset = horizontalPadding(element).left;
      const anchor = anchorX ?? element.clientWidth / 2;
      const anchorRatio = (element.scrollLeft + anchor - offset) / (width * from);

      const apply = (value: number) => {
        zoomRef.current = value;
        flushSync(() => setRequestedZoom(value));
        element.scrollLeft = anchorRatio * width * value - anchor + offset;
      };

      zoomAnimationRef.current?.stop();
      if (!animated || shouldReduceMotion) {
        apply(to);
        return;
      }
      zoomAnimationRef.current = animate(from, to, {
        duration: 0.35,
        ease: EASE,
        onUpdate: apply,
      });
    },
    [maxZoom, shouldReduceMotion]
  );

  useEffect(
    () => () => {
      zoomAnimationRef.current?.stop();
      if (longPressRef.current) window.clearTimeout(longPressRef.current.timer);
    },
    []
  );

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
        pinch = {
          distance: touchDistance(event.touches),
          zoom: zoomRef.current,
        };
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

    const onScroll = () => setTooltip(null);

    element.addEventListener("scroll", onScroll, { passive: true });
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd);
    element.addEventListener("touchcancel", onTouchEnd);
    return () => {
      element.removeEventListener("scroll", onScroll);
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
  const months = Array.from({ length: monthCount }, (_, i) => domain.start + i);
  const years = months.filter((month) => month % 12 === 0).map((month) => month / 12);
  const ticks = [...months, domain.end].filter((month) => month % 12 === 0 || showMonthLines);
  const isZoomed = zoom > 1.001;
  const tooltipItem = tooltip ? items.find((item) => item.id === tooltip.id) : undefined;

  const showTooltip = (id: string, bar: HTMLElement) => {
    const card = cardRef.current;
    const scroller = scrollRef.current;
    if (!card || !scroller) return;
    const cardRect = card.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    const scrollRect = scroller.getBoundingClientRect();
    const visibleLeft = Math.max(barRect.left, scrollRect.left);
    const visibleRight = Math.min(barRect.right, scrollRect.right);
    const minX = TOOLTIP_HALF_WIDTH_PX + TOOLTIP_EDGE_PX;
    setTooltip({
      id,
      x: clamp((visibleLeft + visibleRight) / 2 - cardRect.left, minX, Math.max(minX, cardRect.width - minX)),
      y: barRect.top - cardRect.top,
    });
  };

  const hideTooltip = () => setTooltip(null);

  const cancelLongPress = () => {
    if (longPressRef.current) window.clearTimeout(longPressRef.current.timer);
  };

  return (
    <div
      ref={cardRef}
      className="surface-glass relative rounded-2xl p-4 sm:p-6"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
          {t.experience.chartHint}
        </p>
        <div className="ml-auto flex items-center gap-0.5 rounded-full border border-black/5 bg-white/70 p-0.5 dark:border-white/10 dark:bg-white/5">
          <button
            type="button"
            className={zoomButtonClassName}
            onClick={() => zoomTo(zoom / ZOOM_STEP)}
            disabled={!isZoomed}
            aria-label={t.experience.zoomOut}
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
            aria-label={t.experience.zoomIn}
          >
            <FiPlus />
          </button>
          <button
            type="button"
            className={zoomButtonClassName}
            onClick={() => zoomTo(1)}
            disabled={!isZoomed}
            aria-label={t.experience.fitTimeline}
          >
            <FiMaximize2 className="text-[0.8rem]" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="touch-pan-x touch-pan-y overflow-x-auto overscroll-x-contain rounded-md px-2 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
        tabIndex={isZoomed ? 0 : -1}
        role="region"
        aria-label={t.experience.timelineLabel}
      >
        <div className="relative" style={{ width: `${zoom * 100}%` }}>
          <div
            className="font-mono text-[0.7rem] text-slate-500 tabular-nums sm:text-xs dark:text-slate-400"
            aria-hidden
          >
            <div className="relative h-6">
              {years.map((year) => (
                <motion.div
                  key={year}
                  className="absolute inset-y-0"
                  initial={false}
                  animate={{
                    left: `${toPercent(year * 12)}%`,
                    width: `${(12 / monthCount) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span className="sticky left-0 inline-block pl-1 font-medium whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {showFullYears ? year : `'${String(year % 100).padStart(2, "0")}`}
                  </span>
                </motion.div>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {showMonthLabels && (
                <motion.div
                  className="relative h-5 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "1.25rem", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {months.map((month) => (
                    <span
                      key={month}
                      className={`absolute top-0 -translate-x-1/2 whitespace-nowrap ${month % 12 === 0 ? "font-medium text-slate-600 dark:text-slate-300" : ""}`}
                      style={{ left: `${toPercent(month + 0.5)}%` }}
                    >
                      {monthLabel(month % 12, locale)}
                    </span>
                  ))}
                </motion.div>
              )}
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
                  const description = [
                    item.title,
                    item.organization,
                    formatDateRange(item.start, item.end, locale),
                    item.location,
                  ]
                    .filter(Boolean)
                    .join(", ");
                  const labelOnLeft = toPercent(end) > LABEL_SIDE_THRESHOLD_PERCENT;
                  const isDimmed = tooltip !== null && tooltip.id !== item.id;

                  return (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="relative h-6"
                    >
                      <span
                        className={`pointer-events-none absolute inset-y-0 flex items-center transition-[opacity,left,right] duration-500 ${isDimmed ? "opacity-35" : ""}`}
                        style={
                          labelOnLeft
                            ? { right: `calc(${100 - left}% + 0.5rem)` }
                            : { left: `calc(${left + width}% + 0.5rem)` }
                        }
                        aria-hidden
                      >
                        <motion.span
                          className="text-xs font-medium whitespace-nowrap text-slate-500 dark:text-slate-400"
                          initial={{ opacity: 0, x: labelOnLeft ? 6 : -6 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.08 * index + 0.45 }}
                        >
                          {item.shortName ?? item.organization}
                        </motion.span>
                      </span>
                      <motion.button
                        type="button"
                        onClick={() => {
                          const wasLongPress = longPressRef.current?.fired;
                          longPressRef.current = null;
                          if (!wasLongPress) onSelect(item.id);
                        }}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") showTooltip(item.id, event.currentTarget);
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType === "mouse") hideTooltip();
                        }}
                        onPointerDown={(event) => {
                          if (event.pointerType === "mouse") return;
                          cancelLongPress();
                          const bar = event.currentTarget;
                          longPressRef.current = {
                            fired: false,
                            timer: window.setTimeout(() => {
                              if (longPressRef.current) longPressRef.current.fired = true;
                              showTooltip(item.id, bar);
                            }, LONG_PRESS_MS),
                          };
                        }}
                        onPointerUp={(event) => {
                          if (event.pointerType === "mouse") return;
                          cancelLongPress();
                          if (longPressRef.current?.fired) hideTooltip();
                        }}
                        onPointerCancel={() => {
                          cancelLongPress();
                          hideTooltip();
                        }}
                        onContextMenu={(event) => event.preventDefault()}
                        onFocus={(event) => {
                          if (event.currentTarget.matches(":focus-visible")) showTooltip(item.id, event.currentTarget);
                        }}
                        onBlur={hideTooltip}
                        aria-label={description}
                        className={`absolute inset-y-0 my-auto h-4 min-w-4 origin-left cursor-pointer touch-manipulation rounded-full shadow-sm select-none [-webkit-touch-callout:none] before:absolute before:-inset-y-1 before:inset-x-0 before:content-[''] transition-[filter,opacity] duration-200 hover:brightness-110 ${isDimmed ? "opacity-35" : ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${style.bar}`}
                        initial={{
                          scaleX: 0,
                          left: `${left}%`,
                          width: `${width}%`,
                        }}
                        animate={{
                          left: `${left}%`,
                          width: `${width}%`,
                          transition: { duration: 0.5, ease: EASE },
                        }}
                        whileInView={{
                          scaleX: 1,
                          transition: {
                            duration: 0.7,
                            delay: 0.08 * index,
                            ease: "easeOut",
                          },
                        }}
                        viewport={{ once: true }}
                      >
                        {item.end === null && (
                          <span className="absolute inset-y-0 right-1 my-auto flex size-2">
                            <span className="absolute inline-flex size-full rounded-full bg-white/80 motion-safe:animate-ping" />
                            <span className="relative inline-flex size-2 rounded-full bg-white" />
                          </span>
                        )}
                      </motion.button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {tooltip && tooltipItem && (
          <ExperienceTooltip key={tooltip.id} item={tooltipItem} x={tooltip.x} y={tooltip.y} />
        )}
      </AnimatePresence>
    </div>
  );
}
