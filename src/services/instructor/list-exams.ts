import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { InstructorExam } from "./types";

export async function listInstructorExams(): Promise<InstructorExam[]> {
  const response = await api.get<InstructorExam[]>(NAHERO_API.INSTRUCTOR.EXAMS);

  return response.data;
}
