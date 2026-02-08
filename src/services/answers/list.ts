import { answersService, type AnswerFilters } from "./index";

export const listAnswersByAttempt = async (
  attemptId: number,
  page: number,
  size: number = 10,
  filters?: AnswerFilters
) => {
  return answersService.listByAttempt(attemptId, page, size, filters);
};
