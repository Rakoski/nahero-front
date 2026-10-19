import { createQuestionList } from "./create";
import { listMyQuestionLists } from "./list-mine";
import { getQuestionList } from "./get";
import { deleteQuestionList } from "./delete";
import { addQuestionListQuestions } from "./add-questions";
import { removeQuestionListQuestion } from "./remove-question";
import { answerQuestionListQuestion } from "./answer-question";

export const questionListsService = {
  createQuestionList,
  listMyQuestionLists,
  getQuestionList,
  deleteQuestionList,
  addQuestionListQuestions,
  removeQuestionListQuestion,
  answerQuestionListQuestion,
};
