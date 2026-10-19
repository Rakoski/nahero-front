import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface CreateExamRequest {
  title: string;
  description?: string;
  category?: string;
  difficultyLevel: number;
}

export interface CreateExamResponse {
  id: number;
  title: string;
}

export async function createExam(request: CreateExamRequest): Promise<CreateExamResponse> {
  try {
    const response = await api.post<CreateExamResponse>(NAHERO_API.INSTRUCTOR.EXAMS, request);

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
