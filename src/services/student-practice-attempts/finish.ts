import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { AnswerRequest } from "@/lib/dtos";

export interface FinishStudentPracticeAttemptRequestPayload {
  attemptId: string | number;
  answers: AnswerRequest[];
}

export interface FinishStudentPracticeAttemptResponse {
  id: number;
  score: number;
  passed: boolean;
  completedAt: string;
}

/**
 * Finish a student practice attempt
 * @param request - Contains attemptId and answers array
 * @returns Response with attempt results
 */
export async function finishStudentPracticeAttempt(
  request: FinishStudentPracticeAttemptRequestPayload
): Promise<FinishStudentPracticeAttemptResponse | null> {
  try {
    const url = `${NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.FINISH}/finish`;

    const response = await api.put<FinishStudentPracticeAttemptResponse>(url, {
      studentPracticeAttemptId: Number(request.attemptId),
      answers: request.answers,
    });

    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}
