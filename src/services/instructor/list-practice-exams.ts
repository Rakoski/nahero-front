import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { InstructorPracticeExamSummary } from "./types";

export async function listInstructorPracticeExams(): Promise<InstructorPracticeExamSummary[]> {
  const response = await api.get<InstructorPracticeExamSummary[]>(NAHERO_API.INSTRUCTOR.PRACTICE_EXAMS);

  return response.data;
}
