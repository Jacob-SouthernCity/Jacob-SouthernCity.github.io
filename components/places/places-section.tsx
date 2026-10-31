"use client";

import { useMemo, useRef, useState } from "react";
import SectionHeading from "../section-heading";
import FilterTabs, { type FilterOption } from "../filter-tabs";
import Globe, { type GlobeArc, type GlobeMarker, type GlobeSelection } from "./globe";
import PlaceList from "./place-list";
import TripList from "./trip-list";
import SelectionCard from "./selection-card";
import { TagFilterChips, tagStyles, type TagFilter } from "./place-tags";
import { angularDistance, centroid, type LatLng } from "@/lib/geo";
import { useSectionInView } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import { placeTags, type Place, type Trip } from "@/lib/content/schema";

type View = "places" | "trips";
type Selection =
  | { kind: "place"; id: string }
  | { kind: "trip"; id: string }
  | { kind: "cluster"; ids: string[] }
  | null;
type ItemSelection = Extract<Selection, { id: string }>;

const PLACE_ZOOM = 1.4;
const MAX_TRIP_ZOOM = 2.2;
const MAX_CLUSTER_ZOOM = 3;
const FIT_ZOOM_FACTOR = 0.35;

function fitView(locations: readonly LatLng[], maxZoom: number) {
  const center = centroid(locations);
  const spread = Math.max(...locations.map((location) => angularDistance(center, location)));
  return { focus: center, zoom: Math.min(maxZoom, Math.max(1, FIT_ZOOM_FACTOR / Math.max(spread, 0.01))) };
}

function placesFor(ids: readonly string[], placesById: ReadonlyMap<string, Place>) {
  return ids.map((id) => placesById.get(id)).filter((place) => place !== undefined);
}

const viewOptions: readonly FilterOption<View>[] = [
  { value: "places", label: "Places" },
  { value: "trips", label: "Trips" },
];

type PlacesSectionProps = {
  places: readonly Place[];
  trips: readonly Trip[];
};

export default function PlacesSection({ places, trips }: PlacesSectionProps) {
  const { ref } = useSectionInView("Places");
  const globeRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("places");
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
  const [selection, setSelection] = useState<Selection>(null);

  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places]);

  const availableTags = useMemo(
    () => placeTags.filter((tag) => places.some((place) => place.tags.includes(tag))),
    [places]
  );

  const filteredPlaces = useMemo(
    () => (tagFilter === "all" ? places : places.filter((place) => place.tags.includes(tagFilter))),
    [places, tagFilter]
  );

  const selectedPlace = selection?.kind === "place" ? (placesById.get(selection.id) ?? null) : null;
  const selectedTrip =
    selection?.kind === "trip" ? (trips.find((trip) => trip.id === selection.id) ?? null) : null;
  const tripStops = useMemo(
    () => (selectedTrip ? placesFor(selectedTrip.places, placesById) : []),
    [selectedTrip, placesById]
  );
  const clusterPlaces = useMemo(
    () => (selection?.kind === "cluster" ? placesFor(selection.ids, placesById) : []),
    [selection, placesById]
  );

  const markers = useMemo<GlobeMarker[]>(() => {
    const emphasized = new Set(
      selection?.kind === "place"
        ? [selection.id]
        : selection?.kind === "cluster"
          ? selection.ids
          : (selectedTrip?.places ?? [])
    );
    const shown = view === "places" ? filteredPlaces : places;
    return shown.map((place) => ({
      id: place.id,
      location: place.coordinates,
      color: tagStyles[place.tags[0]].rgb,
      emphasized: emphasized.has(place.id),
    }));
  }, [view, filteredPlaces, places, selection, selectedTrip]);

  const arcs = useMemo<GlobeArc[]>(
    () =>
      tripStops.slice(1).map((stop, index) => ({
        from: tripStops[index].coordinates,
        to: stop.coordinates,
      })),
    [tripStops]
  );

  const { focus, zoom } = useMemo(() => {
    if (selectedPlace) return { focus: selectedPlace.coordinates, zoom: PLACE_ZOOM };
    if (tripStops.length > 0) return fitView(tripStops.map((stop) => stop.coordinates), MAX_TRIP_ZOOM);
    if (clusterPlaces.length > 0) {
      return fitView(clusterPlaces.map((place) => place.coordinates), MAX_CLUSTER_ZOOM);
    }
    return { focus: null, zoom: 1 };
  }, [selectedPlace, tripStops, clusterPlaces]);

  const countryCount = new Set(places.map((place) => place.countryCode)).size;

  const revealGlobeOnSmallScreens = () => {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    globeRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  const toggleSelection = (next: ItemSelection) => {
    const isSame =
      selection !== null && selection.kind !== "cluster" && selection.kind === next.kind && selection.id === next.id;
    setSelection(isSame ? null : next);
    if (!isSame) revealGlobeOnSmallScreens();
  };

  const showPlace = (id: string) => {
    if (view !== "places") setView("places");
    if (tagFilter !== "all" && !filteredPlaces.some((place) => place.id === id)) setTagFilter("all");
    setSelection({ kind: "place", id });
  };

  const handleGlobeSelect = (target: GlobeSelection) => {
    if (target.kind === "marker") showPlace(target.id);
    else setSelection({ kind: "cluster", ids: target.ids });
  };

  return (
    <section id="places" ref={ref} className="mb-24 w-full max-w-5xl scroll-mt-28 sm:mb-32">
      <SectionHeading>Places I&apos;ve been</SectionHeading>

      <p className="-mt-2 mb-6 text-center font-mono text-sm text-slate-500 tabular-nums dark:text-slate-400">
        {places.length} places · {countryCount} {countryCount === 1 ? "country" : "countries"} · {trips.length}{" "}
        {trips.length === 1 ? "trip" : "trips"}
      </p>

      <div className="mb-8">
        <FilterTabs
          label="Show places or trips"
          layoutId="places-view"
          options={viewOptions}
          value={view}
          onChange={(value) => {
            setView(value);
            setSelection(null);
          }}
        />
      </div>

      <div className="grid items-start gap-8 md:grid-cols-2">
        <div ref={globeRef} className="scroll-mt-28 md:sticky md:top-28">
          <Globe
            markers={markers}
            arcs={arcs}
            focus={focus}
            zoom={zoom}
            label={`Globe marking ${places.length} places I've been across ${countryCount} countries`}
            onSelect={handleGlobeSelect}
          />
          <SelectionCard
            place={selectedPlace}
            trip={selectedTrip}
            stops={tripStops}
            clusterPlaces={clusterPlaces}
            onSelectPlace={showPlace}
            hint={
              view === "places"
                ? "Drag the globe, tap a dot, or pick a place below."
                : "Pick a trip to see its route on the globe."
            }
          />
        </div>

        <div className="min-w-0">
          {view === "places" ? (
            <>
              <div className="mb-4">
                <TagFilterChips
                  tags={availableTags}
                  value={tagFilter}
                  onChange={(value) => {
                    setTagFilter(value);
                    setSelection(null);
                  }}
                />
              </div>
              <PlaceList
                places={filteredPlaces}
                selectedId={selectedPlace?.id ?? null}
                onSelect={(id) => toggleSelection({ kind: "place", id })}
              />
            </>
          ) : (
            <TripList
              trips={trips}
              placesById={placesById}
              selectedId={selectedTrip?.id ?? null}
              onSelect={(id) => toggleSelection({ kind: "trip", id })}
            />
          )}
        </div>
      </div>
    </section>
  );
}
