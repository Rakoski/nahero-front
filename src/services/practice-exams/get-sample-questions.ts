"use server";

import { NAHERO_API } from "@/constants/nahero-api";
import type { Locale } from "@/lib/locale";
import type { SampleQuestionDTO } from "@/lib/dtos";

/**
 * Public preview questions for an exam page. Server-only: the response carries
 * the correct alternative, which is exactly what we want in the HTML here.
 */
export async function getSampleQuestions(
  slug: string,
  lang: Locale,
): Promise<SampleQuestionDTO[]> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL_JAVA;
  if (!baseURL) return [];

  try {
    const response = await fetch(
      `${baseURL}${NAHERO_API.PRACTICE_EXAMS.GET_SAMPLE_QUESTIONS(slug)}`,
      {
        headers: { "Accept-Language": lang === "pt" ? "pt-BR" : "en-US" },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as SampleQuestionDTO[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
