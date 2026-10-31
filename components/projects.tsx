"use client";

import SectionHeading from "./section-heading";
import type { Project as ProjectItem } from "@/lib/content/schema";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";

type ProjectsProps = {
  projects: readonly ProjectItem[];
};

export default function Projects({ projects }: ProjectsProps) {
  const { ref } = useSectionInView("Projects");

  return (
    <section ref={ref} id="projects" className="mb-24 scroll-mt-28 sm:mb-32">
      <SectionHeading>Projects</SectionHeading>
      <div>
        {projects.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
