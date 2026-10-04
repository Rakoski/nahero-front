import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { DomainScore } from "@/services/student-practice-attempts/get-result";

export interface FeedbackExamOption {
  slug: string;
  title: string;
}

export interface FeedbackAttemptSummary {
  attemptId: number;
  endTime: string;
  score: number;
  total: number;
  passed: boolean;
}

export interface PracticeAlternative {
  alternativeId: number;
  content: string;
  imageUrl: string | null;
}

export interface PracticeQuestion {
  questionId: number;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "OBJECTIVE";
  content: string;
  imageUrl: string | null;
  alternatives: PracticeAlternative[];
}

export interface GetFeedbackPageResponse {
  exams: FeedbackExamOption[];
  practiceExam?: FeedbackExamOption;
  weakestDomain?: string;
  latestAttemptId?: number;
  attempts?: FeedbackAttemptSummary[];
  domains?: DomainScore[];
  practiceQuestions?: PracticeQuestion[];
}

export async function getFeedbackPage(
  practiceExamSlug?: string | null,
): Promise<GetFeedbackPageResponse> {
  const response = await api.get<GetFeedbackPageResponse>(
    NAHERO_API.FEEDBACK.GET_PAGE,
    { params: practiceExamSlug ? { practiceExamSlug } : undefined },
  );

  return response.data;
}
