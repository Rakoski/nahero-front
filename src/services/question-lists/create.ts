import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { QuestionBankFilter } from "@/services/question-bank/list";

export interface CreateQuestionListRequest {
  name: string;
  questionIds?: number[];
  filter?: QuestionBankFilter & { limit?: number };
}

export interface CreateQuestionListResponse {
  id: number;
  name: string;
  questionCount: number;
}

export async function createQuestionList(request: CreateQuestionListRequest): Promise<CreateQuestionListResponse> {
  try {
    const response = await api.post<CreateQuestionListResponse>(NAHERO_API.QUESTION_LISTS.CREATE, request);

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
