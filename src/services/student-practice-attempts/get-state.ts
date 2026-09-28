import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";

export interface SavedAnswer {
  questionId: number;
  alternativeIds: number[];
}

export interface AttemptStateResponse {
  attemptId: number;
  practiceExamId: number;
  practiceExamSlug: string;
  practiceExamTitle: string;
  attemptStatus: string;
  startTime: string;
  timeLimit: number;
  remainingSeconds: number;
  lastQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  answers: SavedAnswer[];
}

export async function getStudentPracticeAttemptState(
  attemptId: string | number,
): Promise<AttemptStateResponse> {
  const response = await api.get<AttemptStateResponse>(
    NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.GET_STATE(attemptId),
  );

  return response.data;
}
