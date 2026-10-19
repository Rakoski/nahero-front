import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { InstructorPracticeExam } from "./types";

export async function getInstructorPracticeExam(practiceExamId: number): Promise<InstructorPracticeExam> {
  const response = await api.get<InstructorPracticeExam>(NAHERO_API.INSTRUCTOR.PRACTICE_EXAM(practiceExamId));

  return response.data;
}
