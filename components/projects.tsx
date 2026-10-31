"use client";

import SectionHeading from "./section-heading";
import type { Project as ProjectItem } from "@/lib/content/schema";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";
import { useI18n } from "./i18n-provider";

type ProjectsProps = {
  projects: readonly ProjectItem[];
};

export default function Projects({ projects }: ProjectsProps) {
  const { ref } = useSectionInView("Projects");
  const { t } = useI18n();

  return (
    <section ref={ref} id="projects" className="mb-24 scroll-mt-28 sm:mb-32">
      <SectionHeading>{t.projects.heading}</SectionHeading>
      <div>
        {projects.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
