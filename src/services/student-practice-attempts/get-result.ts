import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface DomainScore {
  domain: string;
  correct: number;
  total: number;
}

export interface GetResultResponse {
  passed: boolean;
  score: number;
  answers: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: string;
  endTime: string;
  timeLimit: number;
  timeSpentInMinutes: number;
  passingPercentageScore: number;
  attemptStatus: string;
  numberOfQuestions: number;
  domains: DomainScore[] | null;
  weakestDomain: string | null;
  practiceExamSlug: string;
  practiceExamTitle: string;
}

export async function getStudentPracticeAttemptResult(
  attemptId: string | number,
): Promise<GetResultResponse> {
  try {
    const url = `${NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.GET_RESULT}/${attemptId}/result`;

    const response = await api.get<GetResultResponse>(url);

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
