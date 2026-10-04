import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { Routes } from "@/routes/routes";
import { listAllPracticeExams } from "@/services/practice-exams/list-all";

const LOCALES = ["en", "pt"] as const;
const PUBLIC_ROUTES = ["", "/practice-exams", "/how-it-works", "/contact", "/faq", "/privacy"] as const;

export const revalidate = 3600;

const languageAlternates = (path: string) =>
  Object.fromEntries(
    LOCALES.map((l) => [l, `${getSiteUrl()}/${l}${path}`]),
  ) as Record<string, string>;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    PUBLIC_ROUTES.map((route) => ({
      url: `${siteUrl}/${lang}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: { languages: languageAlternates(route) },
    })),
  );

  const exams = await listAllPracticeExams();

  const examEntries: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    exams.map((exam) => {
      const route = `${Routes.PracticeExams}/${exam.slug}`;
      return {
        url: `${siteUrl}/${lang}${route}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        alternates: { languages: languageAlternates(route) },
      };
    }),
  );

  return [...staticEntries, ...examEntries];
}
