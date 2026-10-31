import { contactLinks, experiencesData } from "./data";

const currentRole = experiencesData.find((item) => item.kind === "work" && item.end === null);
const schools = [
  ...new Set(experiencesData.filter((item) => item.kind === "education").map((item) => item.organization)),
];

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jingze Ma",
  alternateName: ["Jacob Ma", "马璟泽"],
  url: "https://www.majingze.com",
  jobTitle: currentRole?.title,
  worksFor: currentRole && { "@type": "Organization", name: currentRole.organization },
  alumniOf: schools.map((name) => ({ "@type": "CollegeOrUniversity", name })),
  sameAs: [contactLinks.linkedIn, contactLinks.gitHub],
};

export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
