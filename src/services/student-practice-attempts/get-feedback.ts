import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface StudyPlanPriority {
  domain: string;
  why: string;
  whatToStudy: string;
}

export interface StudyPlan {
  summary: string;
  priorities: StudyPlanPriority[];
  plan: string[];
}

export interface GetFeedbackResponse {
  status?: "ready" | "pending" | "failed";
  locked: boolean;
  weakestDomain?: string;
  content?: StudyPlan;
}

export async function getStudentPracticeAttemptFeedback(
  attemptId: string | number,
  retry = false,
): Promise<GetFeedbackResponse> {
  try {
    const url = NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.GET_FEEDBACK(attemptId);

    const response = await api.get<GetFeedbackResponse>(url, {
      params: retry ? { retry: true } : undefined,
    });

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
