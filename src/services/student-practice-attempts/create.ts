import { api } from "../../lib/api-manager";
import { handleError } from "@/utils/error-utils";
import { isPaymentRequiredError } from "@/utils/paywall-utils";
import { isAttemptInProgressConflict } from "@/utils/attempt-utils";

export interface CreateStudentPracticeAttemptOptions {
  discardInProgress?: boolean;
}

export async function createStudentPracticeAttempt(
  practiceExamId: number,
  options?: CreateStudentPracticeAttemptOptions,
) {
  try {
    const response = await api.post<number>("/student-practice-attempts", {
      practiceExamId,
      discardInProgress: options?.discardInProgress,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (!isPaymentRequiredError(error) && !isAttemptInProgressConflict(error)) {
      handleError(error);
    }
    throw error;
  }
}
