import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export async function deleteQuestionList(listId: number): Promise<void> {
  try {
    await api.delete(NAHERO_API.QUESTION_LISTS.DELETE(listId));
  } catch (error) {
    handleError(error);
    throw error;
  }
}
