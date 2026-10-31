"use client";

import { useRef } from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import { useElementMeasure, useElementWidth } from "@/lib/hooks";

export type FilterOption<Value extends string> = {
  value: Value;
  label: string;
  dotClassName?: string;
};

type FilterTabsProps<Value extends string> = {
  label: string;
  layoutId: string;
  options: readonly FilterOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

const GAP_PX = 4;
const FRAME_PX = 10;
const tabClassName = "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap pointer-coarse:py-2.5";

const widestChild = (element: HTMLElement) =>
  Math.max(0, ...[...element.children].map((child) => (child as HTMLElement).offsetWidth));

function TabContent({ option }: { option: FilterOption<string> }) {
  return (
    <span className="relative flex items-center justify-center gap-2">
      {option.dotClassName && <span className={`size-2 rounded-full ${option.dotClassName}`} aria-hidden />}
      {option.label}
    </span>
  );
}

function balancedLayout(count: number, available: number, cellWidth: number) {
  if (!available || !cellWidth) return null;
  const perRow = Math.max(1, Math.floor((available - FRAME_PX + GAP_PX) / (cellWidth + GAP_PX)));
  const rows = Math.ceil(count / perRow);
  if (rows === 1) return null;
  const columns = Math.ceil(count / rows);
  return { maxWidth: columns * cellWidth + (columns - 1) * GAP_PX + FRAME_PX, cellWidth };
}

export default function FilterTabs<Value extends string>({
  label,
  layoutId,
  options,
  value,
  onChange,
}: FilterTabsProps<Value>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const available = useElementWidth(wrapperRef);
  const cellWidth = useElementMeasure(measureRef, widestChild);
  const layout = balancedLayout(options.length, available, cellWidth);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="pointer-events-none invisible absolute size-0 overflow-hidden" aria-hidden>
        <div ref={measureRef} className="flex w-max">
          {options.map((option) => (
            <span key={option.value} className={tabClassName}>
              <TabContent option={option} />
            </span>
          ))}
        </div>
      </div>
      <div
        className={clsx(
          "mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 surface-glass p-1",
          layout ? "rounded-3xl" : "rounded-full"
        )}
        style={layout ? { maxWidth: layout.maxWidth } : undefined}
        role="group"
        aria-label={label}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={clsx(
              tabClassName,
              "text-slate-600 transition-colors hover:text-slate-900 aria-pressed:text-slate-900 dark:text-slate-300 dark:hover:text-white dark:aria-pressed:text-white"
            )}
            style={layout ? { width: layout.cellWidth } : undefined}
          >
            {value === option.value && (
              <motion.span
                layoutId={layoutId}
                layoutDependency={value}
                className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/15"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <TabContent option={option} />
          </button>
        ))}
      </div>
    </div>
  );
}
