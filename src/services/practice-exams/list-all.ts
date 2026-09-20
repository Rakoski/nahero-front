"use server";

import { NAHERO_API } from "@/constants/nahero-api";
import type {
  PracticeExamDTO,
  PracticeExamsPageableResponse,
} from "@/lib/dtos";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

/**
 * Every published practice exam, walked page by page. Used by the sitemap, so
 * it hits the backend directly instead of going through the browser proxy.
 */
export async function listAllPracticeExams(): Promise<PracticeExamDTO[]> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL_JAVA;
  if (!baseURL) return [];

  const exams: PracticeExamDTO[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    let data: PracticeExamsPageableResponse;

    try {
      const response = await fetch(
        `${baseURL}${NAHERO_API.PRACTICE_EXAMS.LIST}?page=${page}&size=${PAGE_SIZE}`,
        { next: { revalidate: 3600 } },
      );
      if (!response.ok) break;
      data = (await response.json()) as PracticeExamsPageableResponse;
    } catch {
      break;
    }

    const content = data?.content ?? [];
    exams.push(...content);

    if (data?.last !== false || content.length === 0) break;
  }

  return exams;
}
