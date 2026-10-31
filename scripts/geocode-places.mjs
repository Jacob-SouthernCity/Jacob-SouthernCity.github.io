import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { isMap, isSeq, parseDocument } from "yaml";

const placesFile = fileURLToPath(new URL("../content/places.yaml", import.meta.url));
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "majingze.com-places-geocoder/1.0 (+https://www.majingze.com)";
const REQUEST_INTERVAL_MS = 1100;
const BROAD_AREAS = new Set(["country", "state", "state_district", "province", "region", "county"]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function search(query) {
  const url = new URL(NOMINATIM_URL);
  url.search = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "5",
    addressdetails: "1",
    "accept-language": "en",
  }).toString();

  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) throw new Error(`OpenStreetMap returned ${response.status}`);
  return response.json();
}

function pickResult(results, region) {
  const candidates = region
    ? results.filter((result) => Object.values(result.address ?? {}).includes(region))
    : results;
  return candidates.find((result) => !BROAD_AREAS.has(result.addresstype)) ?? candidates[0] ?? null;
}

async function geocode(name, region, country) {
  let match = null;
  if (region) {
    match = pickResult(await search([name, region, country].filter(Boolean).join(", ")), region);
    if (!match) await sleep(REQUEST_INTERVAL_MS);
  }
  match ??= pickResult(await search([name, country].filter(Boolean).join(", ")));
  if (!match) return null;

  return {
    coordinates: [Number(Number(match.lat).toFixed(4)), Number(Number(match.lon).toFixed(4))],
    countryCode: match.address?.country_code?.toUpperCase(),
  };
}

const document = parseDocument(await readFile(placesFile, "utf8"));
if (!isSeq(document.contents)) throw new Error("content/places.yaml must be a list of places.");

let updated = 0;
let failed = 0;
for (const place of document.contents.items) {
  if (!isMap(place)) continue;
  const name = place.get("name");
  const needsCoordinates = !place.has("coordinates");
  const needsCountryCode = !place.has("countryCode");
  if (!needsCoordinates && !needsCountryCode) continue;

  if (updated + failed > 0) await sleep(REQUEST_INTERVAL_MS);
  try {
    const result = await geocode(name, place.get("region"), place.get("country"));
    if (!result) {
      failed += 1;
      console.warn(`✗ ${name}: no match found; add coordinates by hand or make the name more specific.`);
      continue;
    }
    if (needsCountryCode && result.countryCode) place.set("countryCode", result.countryCode);
    if (needsCoordinates) {
      const coordinates = document.createNode(result.coordinates);
      coordinates.flow = true;
      place.set("coordinates", coordinates);
    }
    updated += 1;
    console.log(`✓ ${name}: ${result.coordinates.join(", ")} (${result.countryCode ?? "no country code"})`);
  } catch (error) {
    failed += 1;
    console.warn(`✗ ${name}: ${error.message}`);
  }
}

if (updated > 0) await writeFile(placesFile, document.toString({ lineWidth: 0, flowCollectionPadding: false }));
console.log(
  updated + failed === 0
    ? "Every place already has coordinates and a country code."
    : `Updated ${updated} place(s)${failed ? `, ${failed} need attention` : ""}.`
);
process.exitCode = failed > 0 ? 1 : 0;
