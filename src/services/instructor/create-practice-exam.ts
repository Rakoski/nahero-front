import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface CreatePracticeExamRequest {
  examId: number;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  numberOfQuestions: number;
}

export interface CreatePracticeExamResponse {
  id: number;
  slug: string;
}

export async function createPracticeExam(request: CreatePracticeExamRequest): Promise<CreatePracticeExamResponse> {
  try {
    const response = await api.post<CreatePracticeExamResponse>(NAHERO_API.INSTRUCTOR.PRACTICE_EXAMS, request);

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
