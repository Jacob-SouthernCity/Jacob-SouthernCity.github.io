import { z } from "zod";
import { iconNames } from "../icons";

type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";

export type YearMonth = `${number}-${Month}`;

const id = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase words joined by dashes, for example los-angeles");

const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use "YYYY-MM", for example "2024-08"')
  .transform((value) => value as YearMonth);

const publicPath = z.string().startsWith("/", "Use a path inside public/, starting with /");

export const profileSchema = z.object({
  name: z.string().min(1),
  nameVersions: z
    .array(
      z.object({
        label: z.string().min(1),
        name: z.string().min(1),
        lang: z.string().min(2),
      })
    )
    .min(1),
  titles: z.array(z.string().min(1)).min(1),
  bio: z.string().min(1),
  resume: z.object({
    file: publicPath,
    downloadName: z.string().endsWith(".pdf"),
  }),
  contact: z.object({
    email: z.email(),
    linkedIn: z.url(),
    gitHub: z.url(),
  }),
});

const experienceKinds = ["work", "education"] as const;

export const experienceSchema = z
  .object({
    id,
    kind: z.enum(experienceKinds),
    title: z.string().min(1),
    organization: z.string().min(1),
    shortName: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    place: id.optional(),
    gpa: z.string().min(1).optional(),
    description: z.string().min(1),
    start: yearMonth,
    end: yearMonth.nullable(),
  })
  .refine((item) => item.end === null || item.end >= item.start, {
    message: "end must be the same as or after start",
    path: ["end"],
  });

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)),
  image: publicPath.optional(),
  video: z
    .object({
      poster: z.url(),
      sources: z.array(z.object({ src: z.url(), type: z.string().min(1) })).min(1),
    })
    .optional(),
  links: z
    .array(z.object({ icon: z.enum(iconNames), url: z.url(), label: z.string().min(1) }))
    .default([]),
});

export const skillGroupSchema = z.object({
  title: z.string().min(1),
  skills: z.array(z.object({ name: z.string().min(1), icon: z.enum(iconNames) })).min(1),
});

export const placeTags = ["lived", "studied", "worked", "visited"] as const;

export const placeSchema = z.object({
  id,
  name: z.string().min(1),
  region: z.string().min(1).optional(),
  country: z.string().min(1),
  countryCode: z
    .string()
    .regex(/^[A-Za-z]{2}$/, "Use a two-letter country code, for example US")
    .transform((code) => code.toUpperCase())
    .optional(),
  coordinates: z
    .tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)])
    .optional(),
  tags: z.array(z.enum(placeTags)).default([]),
  note: z.string().min(1).optional(),
});

export const tripSchema = z
  .object({
    id,
    name: z.string().min(1),
    start: yearMonth,
    end: yearMonth,
    places: z.array(id).min(1),
  })
  .refine((trip) => trip.end >= trip.start, {
    message: "end must be the same as or after start",
    path: ["end"],
  });

export type Profile = z.infer<typeof profileSchema>;
export type ExperienceKind = (typeof experienceKinds)[number];
export type Experience = z.infer<typeof experienceSchema>;
export type ProjectSource = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type PlaceTag = (typeof placeTags)[number];
export type PlaceSource = z.infer<typeof placeSchema>;
export type Trip = z.infer<typeof tripSchema>;
type TripSummary = Pick<Trip, "id" | "name" | "start" | "end">;

export type ResolvedImage = {
  src: string;
  width: number;
  height: number;
};

export type Project = Omit<ProjectSource, "image"> & {
  image: ResolvedImage | null;
};

export type Place = Omit<PlaceSource, "countryCode" | "coordinates"> & {
  countryCode: string;
  coordinates: [number, number];
  experiences: Pick<Experience, "id" | "kind" | "title" | "organization" | "start" | "end">[];
  trips: TripSummary[];
};

export type SiteContent = {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  places: Place[];
  trips: Trip[];
};
