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
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
      <SectionHeading>My projects</SectionHeading>
      <div>
        {projects.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
