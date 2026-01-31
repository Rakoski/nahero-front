"use server";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import { NAHERO_API } from "@/constants/nahero-api";
import type { PracticeExamsPageableResponse } from "@/lib/dtos";

export interface ListPracticeExamsRequest {
  search?: string;
  category?: string;
  difficultyLevel?: number;
  size?: number;
  page?: number;
}

export async function listPracticeExams(
  request: ListPracticeExamsRequest
): Promise<PracticeExamsPageableResponse> {
  try {
    const baseURL = NAHERO_API.PRACTICE_EXAMS.LIST;

    const queryParams: URLSearchParams = new URLSearchParams();

    if (request.search && request.search.length >= 1) {
      queryParams.append("title", request.search.trim());
    }

    if (request.category && request.category !== "all") {
      queryParams.append("category", request.category);
    }

    if (request.difficultyLevel && request.difficultyLevel > 0) {
      queryParams.append("difficultyLevel", request.difficultyLevel.toString());
    }

    if (request.page !== undefined && request.page >= 0) {
      queryParams.append("page", request.page.toString());
    }

    if (request.size) {
      queryParams.append("size", request.size.toString());
    }

    const response = await api.get<PracticeExamsPageableResponse>(
      baseURL + "?" + queryParams.toString()
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    handleError(error);
  }

  return {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: request.size || 6,
      sort: { empty: true, sorted: false, unsorted: true },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalPages: 0,
    totalElements: 0,
    size: request.size || 6,
    number: 0,
    sort: { empty: true, sorted: false, unsorted: true },
    first: true,
    numberOfElements: 0,
    empty: true,
  };
}
