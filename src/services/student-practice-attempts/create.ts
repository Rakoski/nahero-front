import { api } from "../../lib/api-manager";
import { handleError } from "@/utils/error-utils";

export async function createStudentPracticeAttempt(practiceExamId: number) {
  try {
    const response = await api.post<number>("/student-practice-attempts", {
      practiceExamId,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    return null;
  } catch (error) {
    handleError(error);
    return null;
  }
}
