"use server";

import { NAHERO_API } from "@/constants/nahero-api";
import type { PracticeExamBySlugDTO } from "@/lib/dtos";

export async function getPracticeExamBySlug(
  slug: string,
): Promise<PracticeExamBySlugDTO | null> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL_JAVA;
  if (!baseURL) return null;

  const response = await fetch(
    `${baseURL}${NAHERO_API.PRACTICE_EXAMS.GET_BY_SLUG}/${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 } },
  );

  if (response.status === 404) return null;
  if (!response.ok) return null;

  return (await response.json()) as PracticeExamBySlugDTO;
}
