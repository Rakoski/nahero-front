import type { ListAnsweredAnswersResponse, PageResponse } from "@/lib/dtos";
import { api } from "../../lib/api-manager";

export interface AnswerFilters {
  isCorrect?: boolean;
  questionContent?: string;
}

export const answersService = {
  listByAttempt: async (
    attemptId: number,
    page: number = 0,
    size: number = 10,
    filters?: AnswerFilters
  ): Promise<PageResponse<ListAnsweredAnswersResponse>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters?.isCorrect !== undefined) {
      params.append("isCorrect", filters.isCorrect.toString());
    }

    if (filters?.questionContent) {
      params.append("questionContent", filters.questionContent);
    }

    const response = await api.get<PageResponse<ListAnsweredAnswersResponse>>(
      `/answers/attempt/${attemptId}?${params.toString()}`
    );
    return response.data;
  },
};
