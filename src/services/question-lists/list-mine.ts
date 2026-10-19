import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";

export interface QuestionListSummary {
  id: number;
  name: string;
  questionCount: number;
  answeredCount: number;
  createdAt: string;
}

export async function listMyQuestionLists(): Promise<QuestionListSummary[]> {
  const response = await api.get<QuestionListSummary[]>(NAHERO_API.QUESTION_LISTS.LIST_MINE);

  return response.data;
}
