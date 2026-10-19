import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { PageResponse } from "@/lib/dtos";
import type { InstructorQuestion } from "./types";

export async function listInstructorQuestions(
  practiceExamId: number,
  page: number,
): Promise<PageResponse<InstructorQuestion>> {
  const response = await api.get<PageResponse<InstructorQuestion>>(NAHERO_API.INSTRUCTOR.QUESTIONS(practiceExamId), {
    params: { page, size: 10 },
  });

  return response.data;
}
