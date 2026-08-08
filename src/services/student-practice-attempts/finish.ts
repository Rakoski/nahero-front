import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { AnswerRequest } from "@/lib/dtos";

export interface FinishStudentPracticeAttemptRequestPayload {
  attemptId: string | number;
  answers: AnswerRequest[];
}

export async function finishStudentPracticeAttempt(
  request: FinishStudentPracticeAttemptRequestPayload,
): Promise<void> {
  try {
    const url = `${NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.FINISH}`;

    await api.put(url, {
      studentPracticeAttemptId: Number(request.attemptId),
      answers: request.answers,
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
}
