"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatDateRange } from "@/lib/dates";
import { flagEmoji } from "@/lib/geo";
import type { Place, Trip, YearMonth } from "@/lib/content/schema";
import { PlaceChip, TagDots } from "./place-tags";

type SelectionCardProps = {
  place: Place | null;
  trip: Trip | null;
  stops: readonly Place[];
  clusterPlaces: readonly Place[];
  onSelectPlace: (id: string) => void;
  hint: string;
};

const cardClassName =
  "surface-glass rounded-2xl p-4";

function DatedRow({ label, start, end }: { label: string; start: YearMonth; end: YearMonth | null }) {
  return (
    <li className="flex flex-wrap justify-between gap-x-3">
      <span>{label}</span>
      <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
        {formatDateRange(start, end)}
      </span>
    </li>
  );
}

export default function SelectionCard({
  place,
  trip,
  stops,
  clusterPlaces,
  onSelectPlace,
  hint,
}: SelectionCardProps) {
  const key = place
    ? `place-${place.id}`
    : trip
      ? `trip-${trip.id}`
      : clusterPlaces.length > 0
        ? `cluster-${clusterPlaces.map((item) => item.id).join("-")}`
        : "hint";

  return (
    <div className="mt-4 min-h-28" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {place ? (
            <div className={cardClassName}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">
                  <span aria-hidden>{flagEmoji(place.countryCode)} </span>
                  {place.name}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    {place.region && `, ${place.region}`}, {place.country}
                  </span>
                </p>
                <TagDots tags={place.tags} />
              </div>
              {place.note && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{place.note}</p>}
              {(place.experiences.length > 0 || place.trips.length > 0) && (
                <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {place.experiences.map((item) => (
                    <DatedRow key={item.id} label={`${item.title} · ${item.organization}`} start={item.start} end={item.end} />
                  ))}
                  {place.trips.map((item) => (
                    <DatedRow key={item.id} label={item.name} start={item.start} end={item.end} />
                  ))}
                </ul>
              )}
            </div>
          ) : trip ? (
            <div className={cardClassName}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="font-semibold">{trip.name}</p>
                <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                  {formatDateRange(trip.start, trip.end)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {stops.map((stop) => stop.name).join(" → ")}
              </p>
            </div>
          ) : clusterPlaces.length > 0 ? (
            <div className={cardClassName}>
              <p className="font-semibold">
                {clusterPlaces.length} places nearby
                <span className="font-normal text-slate-500 dark:text-slate-400"> · pick one</span>
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {clusterPlaces.map((item) => (
                  <li key={item.id}>
                    <PlaceChip place={item} onClick={() => onSelectPlace(item.id)} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">{hint}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
