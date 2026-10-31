import { notFound } from "next/navigation";
import Experience from "@/components/experience/experience-section";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import Places from "@/components/places/places-section";
import Contact from "@/components/contact";
import { loadContent } from "@/lib/content/load";
import { isLocale } from "@/lib/i18n/config";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await loadContent(locale);

  return (
    <main className="flex flex-col items-center px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPersonJsonLd(content)) }}
      />
      <Intro profile={content.profile} />
      <Experience experiences={content.experiences} />
      <Projects projects={content.projects} />
      <Skills skillGroups={content.skillGroups} />
      <Places places={content.places} trips={content.trips} />
      <Contact contact={content.profile.contact} />
    </main>
  );
}
