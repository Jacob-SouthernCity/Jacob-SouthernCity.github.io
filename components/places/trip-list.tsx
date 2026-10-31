"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { formatDateRange } from "@/lib/dates";
import { flagEmoji } from "@/lib/geo";
import type { Place, Trip } from "@/lib/content/schema";

type TripListProps = {
  trips: readonly Trip[];
  placesById: ReadonlyMap<string, Place>;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function TripList({ trips, placesById, selectedId, onSelect }: TripListProps) {
  return (
    <ol className="space-y-3">
      {trips.map((trip, index) => {
        const stops = trip.places.map((id) => placesById.get(id)).filter((place) => place !== undefined);
        const countryCodes = [...new Set(stops.map((place) => place.countryCode))];
        const isSelected = selectedId === trip.id;

        return (
          <motion.li
            key={trip.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
          >
            <button
              type="button"
              onClick={() => onSelect(trip.id)}
              aria-pressed={isSelected}
              className={clsx(
                "w-full rounded-2xl border p-4 text-left shadow-sm backdrop-blur-sm transition-colors sm:p-5",
                isSelected
                  ? "border-indigo-300 bg-indigo-50/80 dark:border-indigo-400/50 dark:bg-indigo-500/15"
                  : "border-black/5 bg-white/60 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-semibold">{trip.name}</span>
                <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                  {formatDateRange(trip.start, trip.end)}
                </span>
              </span>
              <span className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span aria-hidden>{countryCodes.map(flagEmoji).join(" ")}</span>
                {stops.length} {stops.length === 1 ? "stop" : "stops"}
              </span>
              <span
                className={clsx(
                  "mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300",
                  isSelected ? "block" : "line-clamp-1"
                )}
              >
                {stops.map((place) => place.name).join(" → ")}
              </span>
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
}
