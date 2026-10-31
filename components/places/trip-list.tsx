"use client";

import { useState } from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import { formatDateRange } from "@/lib/dates";
import { flagEmoji } from "@/lib/geo";
import type { Place, Trip } from "@/lib/content/schema";
import { useI18n } from "../i18n-provider";

const TRIPS_SHOWN_PER_YEAR = 2;

type TripListProps = {
  trips: readonly Trip[];
  placesById: ReadonlyMap<string, Place>;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function groupByYear(trips: readonly Trip[]) {
  const years = new Map<string, Trip[]>();
  for (const trip of trips) {
    const year = trip.start.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), trip]);
  }
  return [...years].map(([year, yearTrips]) => ({ year, trips: yearTrips }));
}

type TripCardProps = {
  trip: Trip;
  placesById: ReadonlyMap<string, Place>;
  selected: boolean;
  onSelect: (id: string) => void;
};

function TripCard({ trip, placesById, selected, onSelect }: TripCardProps) {
  const stops = trip.places.map((id) => placesById.get(id)).filter((place) => place !== undefined);
  const countryCodes = [...new Set(stops.map((place) => place.countryCode))];
  const { locale, t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onSelect(trip.id)}
      aria-pressed={selected}
      className={clsx(
        "w-full rounded-2xl border p-4 text-left shadow-sm transition-colors sm:p-5",
        selected
          ? "border-indigo-300 bg-indigo-50/80 dark:border-indigo-400/50 dark:bg-indigo-500/15"
          : "border-slate-200/80 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:hover:bg-slate-800/80"
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold">{trip.name}</span>
        <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
          {formatDateRange(trip.start, trip.end, locale)}
        </span>
      </span>
      <span className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span aria-hidden>{countryCodes.map(flagEmoji).join(" ")}</span>
        {t.places.stops(stops.length)}
      </span>
      <span
        className={clsx(
          "mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300",
          selected ? "block" : "line-clamp-1"
        )}
      >
        {stops.map((place) => place.name).join(" → ")}
      </span>
    </button>
  );
}

export default function TripList({ trips, placesById, selectedId, onSelect }: TripListProps) {
  const [expandedYears, setExpandedYears] = useState<ReadonlySet<string>>(new Set());
  const { t } = useI18n();

  const toggleYear = (year: string) => {
    setExpandedYears((current) => {
      const next = new Set(current);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {groupByYear(trips).map(({ year, trips: yearTrips }, groupIndex) => {
        const isExpanded = expandedYears.has(year);
        const hiddenCount = yearTrips.length - TRIPS_SHOWN_PER_YEAR;
        const shownTrips = isExpanded ? yearTrips : yearTrips.slice(0, TRIPS_SHOWN_PER_YEAR);

        return (
          <motion.section
            key={year}
            aria-labelledby={`trips-${year}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(groupIndex * 0.06, 0.3) }}
          >
            <h3 id={`trips-${year}`} className="mb-3 flex items-baseline gap-2">
              <span className="font-mono text-sm font-semibold text-slate-700 tabular-nums dark:text-slate-200">
                {year}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t.places.tripCount(yearTrips.length)}
              </span>
            </h3>
            <ol className="space-y-3">
              {shownTrips.map((trip) => (
                <motion.li
                  key={trip.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <TripCard trip={trip} placesById={placesById} selected={selectedId === trip.id} onSelect={onSelect} />
                </motion.li>
              ))}
            </ol>
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => toggleYear(year)}
                aria-expanded={isExpanded}
                className="mt-2 rounded-full px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {isExpanded ? t.places.showFewerTrips : t.places.showMoreTrips(hiddenCount, year)}
              </button>
            )}
          </motion.section>
        );
      })}
    </div>
  );
}
