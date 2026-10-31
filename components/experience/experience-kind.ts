import type { IconType } from "react-icons";
import { FaBriefcase } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import type { ExperienceKind } from "@/lib/content/schema";

type ExperienceKindStyle = {
  icon: IconType;
  bar: string;
  dot: string;
  accentText: string;
};

export const experienceKindStyles: Record<ExperienceKind, ExperienceKindStyle> = {
  work: {
    icon: FaBriefcase,
    bar: "bg-indigo-500",
    dot: "bg-indigo-500",
    accentText: "text-indigo-600 dark:text-indigo-300",
  },
  education: {
    icon: LuGraduationCap,
    bar: "bg-teal-500",
    dot: "bg-teal-500",
    accentText: "text-teal-700 dark:text-teal-300",
  },
};
