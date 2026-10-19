import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface DeleteQuestionRequest {
  practiceExamId: number;
  questionId: number;
}

export async function deleteInstructorQuestion({ practiceExamId, questionId }: DeleteQuestionRequest): Promise<void> {
  try {
    await api.delete(NAHERO_API.INSTRUCTOR.QUESTION(practiceExamId, questionId));
  } catch (error) {
    handleError(error);
    throw error;
  }
}
