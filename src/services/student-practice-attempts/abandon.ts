import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export async function abandonStudentPracticeAttempt(
  attemptId: string | number,
): Promise<void> {
  try {
    const url = NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.ABANDON(attemptId);

    await api.put(url);
  } catch (error) {
    handleError(error);
    throw error;
  }
}
