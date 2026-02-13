import { NAHERO_API } from "@/constants/nahero-api";
import type { ListAlternativeByQuestionResponse } from "@/lib/dtos";
import { api } from "../../lib/api-manager";

interface ListAlternativesByQuestionParams {
  questionId: number | string;
}

export const listAlternativesByQuestion = async ({
  questionId,
}: ListAlternativesByQuestionParams): Promise<
  ListAlternativeByQuestionResponse[]
> => {
  const response = await api.get<ListAlternativeByQuestionResponse[]>(
    `${NAHERO_API.ALTERNATIVES.LIST_BY_QUESTION}/${questionId}`
  );

  return response.data;
};
