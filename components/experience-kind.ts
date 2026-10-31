import type { IconType } from "react-icons";
import { FaBriefcase } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import type { ExperienceKind } from "@/lib/types";

type ExperienceKindStyle = {
  label: string;
  icon: IconType;
  bar: string;
  dot: string;
  accentText: string;
};

export const experienceKindStyles: Record<ExperienceKind, ExperienceKindStyle> = {
  work: {
    label: "Work",
    icon: FaBriefcase,
    bar: "bg-linear-to-r from-indigo-500 to-indigo-400",
    dot: "bg-indigo-500",
    accentText: "text-indigo-600 dark:text-indigo-300",
  },
  education: {
    label: "Education",
    icon: LuGraduationCap,
    bar: "bg-linear-to-r from-teal-500 to-teal-400",
    dot: "bg-teal-500",
    accentText: "text-teal-700 dark:text-teal-300",
  },
};
