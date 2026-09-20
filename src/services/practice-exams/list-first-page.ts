"use server";

import { NAHERO_API } from "@/constants/nahero-api";
import { PRACTICE_EXAMS_PAGE_SIZE } from "@/constants/practice-exams";
import type { PracticeExamsPageableResponse } from "@/lib/dtos";

const emptyPage = (): PracticeExamsPageableResponse => ({
  content: [],
  pageable: {
    pageNumber: 0,
    pageSize: PRACTICE_EXAMS_PAGE_SIZE,
    sort: { empty: true, sorted: false, unsorted: true },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalPages: 0,
  totalElements: 0,
  size: PRACTICE_EXAMS_PAGE_SIZE,
  number: 0,
  sort: { empty: true, sorted: false, unsorted: true },
  first: true,
  numberOfElements: 0,
  empty: true,
});

/**
 * First, unfiltered page of the catalogue, fetched on the server so the exam
 * links ship in the initial HTML instead of waiting on client-side data.
 */
export async function listFirstPracticeExamsPage(): Promise<PracticeExamsPageableResponse | null> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL_JAVA;
  if (!baseURL) return null;

  try {
    const response = await fetch(
      `${baseURL}${NAHERO_API.PRACTICE_EXAMS.LIST}?page=0&size=${PRACTICE_EXAMS_PAGE_SIZE}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as PracticeExamsPageableResponse;
    return data?.content ? data : emptyPage();
  } catch {
    return null;
  }
}
