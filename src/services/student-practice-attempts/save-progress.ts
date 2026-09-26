import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";

export interface SaveAttemptProgressPayload {
  attemptId: string | number;
  questionId?: number;
  alternativeIds?: number[];
  lastQuestionIndex?: number;
}

/**
 * Auto-save for a running attempt. Errors are intentionally propagated without a toast:
 * the caller retries on the next answer, and a failed save must not interrupt the exam.
 */
export async function saveStudentPracticeAttemptProgress({
  attemptId,
  questionId,
  alternativeIds,
  lastQuestionIndex,
}: SaveAttemptProgressPayload): Promise<void> {
  await api.put(NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.SAVE_PROGRESS(attemptId), {
    questionId,
    alternativeIds,
    lastQuestionIndex,
  });
}
