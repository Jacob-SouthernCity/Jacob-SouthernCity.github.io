import clsx from "clsx";
import type { Place, PlaceTag } from "@/lib/content/schema";

export const tagStyles: Record<PlaceTag, { label: string; dot: string; rgb: [number, number, number] }> = {
  lived: { label: "Lived", dot: "bg-amber-500", rgb: [0.96, 0.62, 0.04] },
  studied: { label: "Studied", dot: "bg-teal-500", rgb: [0.08, 0.72, 0.65] },
  worked: { label: "Worked", dot: "bg-indigo-500", rgb: [0.39, 0.4, 0.95] },
  visited: { label: "Visited", dot: "bg-sky-500", rgb: [0.05, 0.65, 0.91] },
};

export function TagDots({ tags }: { tags: readonly PlaceTag[] }) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      {tags.map((tag) => (
        <span key={tag} className={`size-2 rounded-full ${tagStyles[tag].dot}`} aria-hidden />
      ))}
      <span className="sr-only"> ({tags.map((tag) => tagStyles[tag].label).join(", ")})</span>
    </span>
  );
}

export type TagFilter = "all" | PlaceTag;

type TagFilterChipsProps = {
  tags: readonly PlaceTag[];
  value: TagFilter;
  onChange: (value: TagFilter) => void;
};

export function TagFilterChips({ tags, value, onChange }: TagFilterChipsProps) {
  const options: { value: TagFilter; label: string; dot?: string }[] = [
    { value: "all", label: "All" },
    ...tags.map((tag) => ({ value: tag, label: tagStyles[tag].label, dot: tagStyles[tag].dot })),
  ];

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter places">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={clsx(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors pointer-coarse:py-1.5",
            value === option.value
              ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:text-white"
          )}
        >
          {option.dot && <span className={`size-1.5 rounded-full ${option.dot}`} aria-hidden />}
          {option.label}
        </button>
      ))}
    </div>
  );
}

type PlaceChipProps = {
  place: Pick<Place, "name" | "tags">;
  selected?: boolean;
  onClick: () => void;
};

export function PlaceChip({ place, selected = false, onClick }: PlaceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors pointer-coarse:py-2",
        selected
          ? "border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-400/50 dark:bg-indigo-500/20 dark:text-white"
          : "border-black/5 bg-white/70 hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      )}
    >
      {place.name}
      <TagDots tags={place.tags} />
    </button>
  );
}
