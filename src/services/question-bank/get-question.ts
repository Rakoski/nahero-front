import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { PracticeQuestion } from "@/services/feedback/get-page";
import type { QuestionBankDomain, QuestionBankPracticeExam } from "./list";

interface GetQuestionBankQuestionResponse {
  id: number;
  content: string;
  imageUrl: string | null;
  type: PracticeQuestion["type"];
  answered: boolean;
  practiceExam: QuestionBankPracticeExam;
  domain: QuestionBankDomain | null;
  alternatives: { id: number; content: string; imageUrl: string | null }[];
}

export interface QuestionBankQuestion extends PracticeQuestion {
  answered: boolean;
  practiceExam: QuestionBankPracticeExam;
  domain: QuestionBankDomain | null;
}

export async function getQuestionBankQuestion(questionId: number): Promise<QuestionBankQuestion> {
  const response = await api.get<GetQuestionBankQuestionResponse>(
    NAHERO_API.QUESTION_BANK.GET_QUESTION(questionId),
  );
  const { id, alternatives, ...rest } = response.data;

  return {
    ...rest,
    questionId: id,
    alternatives: alternatives.map((alternative) => ({
      alternativeId: alternative.id,
      content: alternative.content,
      imageUrl: alternative.imageUrl,
    })),
  };
}
