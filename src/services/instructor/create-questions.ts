import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { InstructorQuestionType } from "./types";

export interface QuestionInput {
  type: InstructorQuestionType;
  domainId: number;
  content: string;
  explanation?: string;
  alternatives: { content: string; isCorrect: boolean }[];
}

export interface CreateQuestionsRequest {
  practiceExamId: number;
  language: string;
  questions: QuestionInput[];
}

export interface CreateQuestionsResponse {
  created: number;
  questionIds: number[];
}

export async function createInstructorQuestions({
  practiceExamId,
  language,
  questions,
}: CreateQuestionsRequest): Promise<CreateQuestionsResponse> {
  try {
    const response = await api.post<CreateQuestionsResponse>(NAHERO_API.INSTRUCTOR.QUESTIONS(practiceExamId), {
      language,
      questions,
    });

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
