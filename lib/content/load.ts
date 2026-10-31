import "server-only";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import sharp from "sharp";
import { parse } from "yaml";
import { z } from "zod";
import {
  experienceSchema,
  placeSchema,
  placeTags,
  profileSchema,
  projectSchema,
  skillGroupSchema,
  tripSchema,
  type Experience,
  type Place,
  type PlaceSource,
  type PlaceTag,
  type ProjectSource,
  type ResolvedImage,
  type SiteContent,
  type Trip,
} from "./schema";

const contentDir = path.join(process.cwd(), "content");
const publicDir = path.join(process.cwd(), "public");

class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`content/${file}: ${message}`);
    this.name = "ContentError";
  }
}

function entryLabel(data: unknown, index: number) {
  const entry = Array.isArray(data) ? (data[index] as Record<string, unknown> | undefined) : undefined;
  const label = entry?.id ?? entry?.title ?? entry?.name;
  return typeof label === "string" ? `entry "${label}"` : `entry #${index + 1}`;
}

function describeIssues(error: z.ZodError, data: unknown) {
  return error.issues
    .map(({ path: issuePath, message }) => {
      const [first, ...rest] = issuePath;
      const location =
        typeof first === "number"
          ? [entryLabel(data, first), ...rest].join(" → ")
          : issuePath.join(" → ");
      return `  • ${location || "file"}: ${message}`;
    })
    .join("\n");
}

async function readContent<Schema extends z.ZodType>(file: string, schema: Schema) {
  const text = await readFile(path.join(contentDir, file), "utf8");
  let data: unknown;
  try {
    data = parse(text);
  } catch (error) {
    throw new ContentError(file, `is not valid YAML.\n${(error as Error).message}`);
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ContentError(file, `has invalid content:\n${describeIssues(result.error, data)}`);
  }
  return result.data as z.output<Schema>;
}

function assertUniqueIds(file: string, items: readonly { id: string }[]) {
  const seen = new Set<string>();
  for (const { id } of items) {
    if (seen.has(id)) throw new ContentError(file, `the id "${id}" is used more than once.`);
    seen.add(id);
  }
}

async function resolveImage(src: string): Promise<ResolvedImage> {
  try {
    const { width, height } = await sharp(path.join(publicDir, src)).metadata();
    if (!width || !height) throw new Error("could not read the image size");
    return { src, width, height };
  } catch (error) {
    throw new ContentError("projects.yaml", `image "${src}" could not be read: ${(error as Error).message}`);
  }
}

async function resolveProject({ image, ...project }: ProjectSource) {
  return { ...project, image: image ? await resolveImage(image) : null };
}

const experienceTag: Record<Experience["kind"], PlaceTag> = {
  work: "worked",
  education: "studied",
};

function resolvePlaces(sources: PlaceSource[], experiences: Experience[], trips: Trip[]): Place[] {
  assertUniqueIds("places.yaml", sources);
  assertUniqueIds("trips.yaml", trips);
  const placeIds = new Set(sources.map((place) => place.id));
  const assertPlace = (file: string, owner: string, placeId: string) => {
    if (!placeIds.has(placeId)) {
      throw new ContentError(file, `"${owner}" refers to place "${placeId}", which is not in content/places.yaml.`);
    }
  };
  for (const item of experiences) {
    if (item.place) assertPlace("experience.yaml", item.id, item.place);
  }
  for (const trip of trips) {
    for (const placeId of trip.places) assertPlace("trips.yaml", trip.id, placeId);
  }

  return sources.map(({ countryCode, coordinates, ...place }) => {
    if (!countryCode || !coordinates) {
      throw new ContentError(
        "places.yaml",
        `"${place.name}" is missing ${!coordinates ? "coordinates" : "countryCode"}. Run "npm run places:geocode" to fill it in automatically.`
      );
    }
    const related = experiences.filter((item) => item.place === place.id);
    const placeTrips = trips.filter((trip) => trip.places.includes(place.id));
    const tags = new Set<PlaceTag>([...place.tags, ...related.map((item) => experienceTag[item.kind])]);
    if (tags.size === 0 && placeTrips.length > 0) tags.add("visited");
    if (tags.size === 0) {
      throw new ContentError(
        "places.yaml",
        `"${place.name}" has no tags and is not part of any trip or experience, so the map cannot place it in a category.`
      );
    }

    return {
      ...place,
      countryCode,
      coordinates,
      tags: placeTags.filter((tag) => tags.has(tag)),
      experiences: related.map(({ id, kind, title, organization, start, end }) => ({
        id,
        kind,
        title,
        organization,
        start,
        end,
      })),
      trips: placeTrips.map(({ id, name, start, end }) => ({ id, name, start, end })),
    };
  });
}

export const loadContent = cache(async (): Promise<SiteContent> => {
  const errors: string[] = [];
  const collect = <T,>(promise: Promise<T>) =>
    promise.catch((error: Error) => {
      errors.push(error.message);
      return null;
    });

  const [profile, experiences, projectSources, skillGroups, placeSources, trips] = await Promise.all([
    collect(readContent("profile.yaml", profileSchema)),
    collect(readContent("experience.yaml", z.array(experienceSchema))),
    collect(readContent("projects.yaml", z.array(projectSchema))),
    collect(readContent("skills.yaml", z.array(skillGroupSchema))),
    collect(readContent("places.yaml", z.array(placeSchema))),
    collect(readContent("trips.yaml", z.array(tripSchema))),
  ]);
  if (
    errors.length > 0 ||
    !profile ||
    !experiences ||
    !projectSources ||
    !skillGroups ||
    !placeSources ||
    !trips
  ) {
    throw new Error(errors.join("\n\n"));
  }

  assertUniqueIds("experience.yaml", experiences);
  await access(path.join(publicDir, profile.resume.file)).catch(() => {
    throw new ContentError("profile.yaml", `resume file "${profile.resume.file}" was not found in public/.`);
  });

  return {
    profile,
    experiences,
    projects: await Promise.all(projectSources.map(resolveProject)),
    skillGroups,
    places: resolvePlaces(placeSources, experiences, trips),
    trips: [...trips].sort((a, b) => b.start.localeCompare(a.start)),
  };
});
