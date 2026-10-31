import Experience from "@/components/experience/experience-section";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import Places from "@/components/places/places-section";
import Contact from "@/components/contact";
import { loadContent } from "@/lib/content/load";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default async function Home() {
  const content = await loadContent();

  return (
    <main className="flex flex-col items-center px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPersonJsonLd(content)) }}
      />
      <Intro profile={content.profile} />
      <SectionDivider />
      <Projects projects={content.projects} />
      <Skills skillGroups={content.skillGroups} />
      <Experience experiences={content.experiences} />
      <Places places={content.places} trips={content.trips} />
      <Contact contact={content.profile.contact} />
    </main>
  );
}
