import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { PageResponse } from "@/lib/dtos";

export interface GetHistoryResponse {
  attemptId: number;
  score: number;
  timeSpentInMinutes: number | null;
  timeLimit: number;
  practiceExamTitle: string;
  passingScore: number;
}

export interface GetHistoryFilters {
  practiceExamId?: number;
  startDate?: string;
  endDate?: string;
  score?: number;
}

export async function getStudentPracticeAttemptHistory(
  filters?: GetHistoryFilters,
): Promise<GetHistoryResponse[]> {
  try {
    const url = `${NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.GET_HISTORY}`;

    const params: Record<string, string> = {};
    if (filters?.practiceExamId) {
      params.practiceExamId = filters.practiceExamId.toString();
    }
    if (filters?.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters?.endDate) {
      params.endDate = filters.endDate;
    }
    if (filters?.score !== undefined) {
      params.score = filters.score.toString();
    }

    const response = await api.get<
      GetHistoryResponse[] | PageResponse<GetHistoryResponse>
    >(url, { params });

    // Handle both paginated and direct array responses
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && "content" in response.data) {
      return response.data.content;
    }

    return [];
  } catch (error) {
    handleError(error);
    throw error;
  }
}
