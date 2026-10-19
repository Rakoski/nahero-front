import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";

export interface QuestionBankDomainOption {
  id: number;
  name: string;
}

export interface QuestionBankExamFilter {
  practiceExamId: number;
  slug: string;
  title: string;
  domains: QuestionBankDomainOption[];
}

export async function getQuestionBankFilters(): Promise<QuestionBankExamFilter[]> {
  const response = await api.get<QuestionBankExamFilter[]>(NAHERO_API.QUESTION_BANK.FILTERS);

  return response.data;
}
