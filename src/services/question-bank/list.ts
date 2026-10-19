import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { PracticeQuestion } from "@/services/feedback/get-page";

export type QuestionBankStatus = "RESOLVED" | "UNRESOLVED";

export interface QuestionBankFilter {
  practiceExamId?: number;
  domainId?: number;
  status?: QuestionBankStatus;
}

export interface ListQuestionBankParams extends QuestionBankFilter {
  page: number;
}

export interface QuestionBankPracticeExam {
  id: number;
  slug: string;
  title: string;
}

export interface QuestionBankDomain {
  id: number;
  name: string;
}

export interface QuestionBankItem {
  id: number;
  preview: string;
  type: PracticeQuestion["type"];
  answered: boolean;
  practiceExam: QuestionBankPracticeExam;
  domain: QuestionBankDomain | null;
}

export interface ListQuestionBankResponse {
  items: QuestionBankItem[];
  page: number;
  size: number;
  hasNext: boolean;
}

export async function listQuestionBank(params: ListQuestionBankParams): Promise<ListQuestionBankResponse> {
  const response = await api.get<ListQuestionBankResponse>(NAHERO_API.QUESTION_BANK.LIST, { params });

  return response.data;
}
