import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { AnswerRequest } from "@/lib/dtos";

export interface TimeOutStudentPracticeAttemptRequestPayload {
  attemptId: string | number;
  answers: AnswerRequest[];
}

export async function timeOutStudentPracticeAttempt(
  request: TimeOutStudentPracticeAttemptRequestPayload,
): Promise<void> {
  try {
    const url = NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.TIMEOUT(request.attemptId);

    await api.put(url, {
      answers: request.answers,
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
}
