import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const LOCALES = ["en", "pt"] as const;
const PUBLIC_ROUTES = ["", "/practice-exams", "/contact", "/faq"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return LOCALES.flatMap((lang) =>
    PUBLIC_ROUTES.map((route) => ({
      url: `${siteUrl}/${lang}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${siteUrl}/${l}${route}`])
        ),
      },
    }))
  );
}
