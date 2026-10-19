import { getQuestionBankFilters } from "./get-filters";
import { listQuestionBank } from "./list";
import { getQuestionBankQuestion } from "./get-question";
import { answerQuestionBankQuestion } from "./answer-question";

export const questionBankService = {
  getQuestionBankFilters,
  listQuestionBank,
  getQuestionBankQuestion,
  answerQuestionBankQuestion,
};
