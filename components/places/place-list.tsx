"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiChevronDown } from "react-icons/fi";
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

const MAX_REGION_PREVIEW = 3;

function regionPreview(group: CountryGroup) {
  const names = group.regions.map((region) => region.name).filter((name) => name !== null);
  if (names.length === 0) return null;
  const shown = names.slice(0, MAX_REGION_PREVIEW).join(" · ");
  const rest = names.length - MAX_REGION_PREVIEW;
  return rest > 0 ? `${shown} · +${rest}` : shown;
}

export default function PlaceList({ places, selectedId, onSelect }: PlaceListProps) {
  const selectedCountry = places.find((place) => place.id === selectedId)?.countryCode;
  const [openCountries, setOpenCountries] = useState<ReadonlySet<string>>(
    () => new Set(selectedCountry ? [selectedCountry] : [])
  );
  const [revealedCountry, setRevealedCountry] = useState(selectedCountry);

  if (selectedCountry !== revealedCountry) {
    setRevealedCountry(selectedCountry);
    if (selectedCountry && !openCountries.has(selectedCountry)) {
      setOpenCountries(new Set(openCountries).add(selectedCountry));
    }
  }

  const toggleCountry = (countryCode: string) => {
    setOpenCountries((current) => {
      const next = new Set(current);
      if (next.has(countryCode)) next.delete(countryCode);
      else next.add(countryCode);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {groupByCountry(places).map((group) => {
          const isOpen = openCountries.has(group.countryCode);
          const panelId = `places-${group.countryCode}`;
          const preview = regionPreview(group);

          return (
            <motion.section
              key={group.countryCode}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="surface overflow-hidden rounded-2xl"
              aria-label={group.country}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => toggleCountry(group.countryCode)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 sm:px-5 dark:hover:bg-white/[0.03]"
                >
                  <span className="text-xl" aria-hidden>
                    {flagEmoji(group.countryCode)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{group.country}</span>
                    {preview && !isOpen && (
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{preview}</span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {group.total}
                  </span>
                  <FiChevronDown
                    className={`shrink-0 text-slate-400 transition-[rotate] duration-300 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
