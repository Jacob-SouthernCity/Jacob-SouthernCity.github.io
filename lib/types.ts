import type { StaticImageData } from "next/image";
import type { IconType } from "react-icons";
import type { links } from "./data";

export type SectionName = (typeof links)[number]["name"];

type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";

export type YearMonth = `${number}-${Month}`;

export type ExperienceKind = "work" | "education";

export type ExperienceData = {
  id: string;
  kind: ExperienceKind;
  title: string;
  organization: string;
  shortName?: string;
  location?: string;
  gpa?: string;
  description: string;
  start: YearMonth;
  end: YearMonth | null;
};

export type ProjectLink = {
  icon: IconType;
  url: string;
  label: string;
};

export type ProjectVideo = {
  poster: string;
  sources: readonly { src: string; type: string }[];
};

export type ProjectData = {
  title: string;
  description: string;
  tags: readonly string[];
  imageUrl: StaticImageData | null;
  video?: ProjectVideo;
  links: readonly ProjectLink[];
};
