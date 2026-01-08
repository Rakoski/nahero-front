import { api } from "../../lib/api-manager";

export async function createStudentPracticeAttempt(practiceExamId: number) {
  const response = await api.post<number>("/student-practice-attempts", {
    practiceExamId,
  });

  if (response.status === 200) {
    return response.data;
  }
  return null;
}
