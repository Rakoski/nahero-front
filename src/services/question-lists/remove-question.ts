import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface RemoveQuestionListQuestionRequest {
  listId: number;
  questionId: number;
}

export async function removeQuestionListQuestion({
  listId,
  questionId,
}: RemoveQuestionListQuestionRequest): Promise<void> {
  try {
    await api.delete(NAHERO_API.QUESTION_LISTS.REMOVE_QUESTION(listId, questionId));
  } catch (error) {
    handleError(error);
    throw error;
  }
}
