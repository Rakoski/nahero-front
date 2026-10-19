import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { QuestionBankFilter } from "@/services/question-bank/list";

export type AddQuestionListQuestionsRequest =
  | { listId: number; questionIds: number[]; filter?: never }
  | { listId: number; filter: QuestionBankFilter; questionIds?: never };

export interface AddQuestionListQuestionsResponse {
  added: number;
  limitReached: boolean;
}

export async function addQuestionListQuestions({
  listId,
  questionIds,
  filter,
}: AddQuestionListQuestionsRequest): Promise<AddQuestionListQuestionsResponse> {
  try {
    const response = await api.post<AddQuestionListQuestionsResponse>(
      NAHERO_API.QUESTION_LISTS.ADD_QUESTIONS(listId),
      filter ? { filter } : { questionIds },
    );

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
