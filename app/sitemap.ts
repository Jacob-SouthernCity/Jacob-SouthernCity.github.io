import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.majingze.com",
      lastModified: new Date(),
    },
  ];
}
