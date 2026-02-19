import { createStudentPracticeAttempt } from "./create";
import { finishStudentPracticeAttempt } from "./finish";
import { getStudentPracticeAttemptResult } from "./get-result";
import { getStudentPracticeAttemptHistory } from "./get-history";

export const studentPracticeAttemptsService = {
  createStudentPracticeAttempt,
  finishStudentPracticeAttempt,
  getStudentPracticeAttemptResult,
  getStudentPracticeAttemptHistory,
};
