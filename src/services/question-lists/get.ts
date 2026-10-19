import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { QuestionBankDomain, QuestionBankPracticeExam } from "@/services/question-bank/list";
import type { PracticeQuestion } from "@/services/feedback/get-page";

export interface QuestionListItem {
  questionId: number;
  preview: string;
  type: PracticeQuestion["type"];
  answered: boolean;
  practiceExam: QuestionBankPracticeExam;
  domain: QuestionBankDomain | null;
}

export interface GetQuestionListResponse {
  id: number;
  name: string;
  questionCount: number;
  answeredCount: number;
  items: QuestionListItem[];
  page: number;
  size: number;
  hasNext: boolean;
}

export async function getQuestionList(listId: number, page: number): Promise<GetQuestionListResponse> {
  const response = await api.get<GetQuestionListResponse>(NAHERO_API.QUESTION_LISTS.GET(listId), {
    params: { page },
  });

  return response.data;
}
