import type { SiteContent } from "./content/schema";

export function buildPersonJsonLd({ profile, experiences }: SiteContent) {
  const currentRole = experiences.find((item) => item.kind === "work" && item.end === null);
  const schools = [
    ...new Set(
      experiences.filter((item) => item.kind === "education").map((item) => item.organization)
    ),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.nameVersions
      .map((version) => version.name)
      .filter((name) => name !== profile.name),
    url: "https://www.majingze.com",
    jobTitle: currentRole?.title,
    worksFor: currentRole && { "@type": "Organization", name: currentRole.organization },
    alumniOf: schools.map((name) => ({ "@type": "CollegeOrUniversity", name })),
    sameAs: [profile.contact.linkedIn, profile.contact.gitHub],
  };
}

export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
