"use client";

import { AnimatePresence, motion } from "motion/react";
import { flagEmoji } from "@/lib/geo";
import type { Place } from "@/lib/content/schema";
import { PlaceChip } from "./place-tags";

type CountryGroup = {
  country: string;
  countryCode: string;
  total: number;
  regions: { name: string | null; places: Place[] }[];
};

function groupByCountry(places: readonly Place[]): CountryGroup[] {
  const countries = new Map<string, CountryGroup>();
  for (const place of places) {
    const country = countries.get(place.countryCode) ?? {
      country: place.country,
      countryCode: place.countryCode,
      total: 0,
      regions: [],
    };
    const regionName = place.region ?? null;
    let region = country.regions.find((item) => item.name === regionName);
    if (!region) {
      region = { name: regionName, places: [] };
      country.regions.push(region);
    }
    region.places.push(place);
    country.total += 1;
    countries.set(place.countryCode, country);
  }

  return [...countries.values()]
    .map((country) => ({
      ...country,
      regions: country.regions.sort(
        (a, b) => b.places.length - a.places.length || (a.name ?? "").localeCompare(b.name ?? "")
      ),
    }))
    .sort((a, b) => b.total - a.total || a.country.localeCompare(b.country));
}

type PlaceListProps = {
  places: readonly Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function PlaceList({ places, selectedId, onSelect }: PlaceListProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout" initial={false}>
        {groupByCountry(places).map((group) => (
          <motion.section
            key={group.countryCode}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-black/5 bg-white/60 p-4 shadow-sm backdrop-blur-sm sm:p-5 dark:border-white/10 dark:bg-white/5"
            aria-label={group.country}
          >
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span aria-hidden>{flagEmoji(group.countryCode)}</span>
              {group.country}
              <span className="ml-auto font-mono text-xs font-normal text-slate-500 tabular-nums dark:text-slate-400">
                {group.total}
              </span>
            </h3>
            <div className="space-y-3">
              {group.regions.map((region) => (
                <div key={region.name ?? "other"}>
                  {region.name && (
                    <p className="mb-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                      {region.name}
                    </p>
                  )}
                  <ul className="flex flex-wrap gap-1.5">
                    {region.places.map((place) => (
                      <li key={place.id}>
                        <PlaceChip
                          place={place}
                          selected={selectedId === place.id}
                          onClick={() => onSelect(place.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  );
}
