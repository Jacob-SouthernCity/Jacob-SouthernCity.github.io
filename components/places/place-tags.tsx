import clsx from "clsx";
import type { Place, PlaceTag } from "@/lib/content/schema";

export const tagStyles: Record<PlaceTag, { label: string; dot: string; rgb: [number, number, number] }> = {
  born: { label: "Born", dot: "bg-rose-500", rgb: [0.96, 0.25, 0.37] },
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
