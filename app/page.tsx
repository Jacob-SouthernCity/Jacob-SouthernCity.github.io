import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import { personJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      <Intro />
      <SectionDivider />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
