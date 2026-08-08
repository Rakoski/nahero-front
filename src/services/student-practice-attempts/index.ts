import { createStudentPracticeAttempt } from "./create";
import { finishStudentPracticeAttempt } from "./finish";
import { abandonStudentPracticeAttempt } from "./abandon";
import { timeOutStudentPracticeAttempt } from "./timeout";
import { getStudentPracticeAttemptResult } from "./get-result";
import { getStudentPracticeAttemptHistory } from "./get-history";
import { getStudentDashboardSummary } from "./get-dashboard-summary";

export const studentPracticeAttemptsService = {
  createStudentPracticeAttempt,
  finishStudentPracticeAttempt,
  abandonStudentPracticeAttempt,
  timeOutStudentPracticeAttempt,
  getStudentPracticeAttemptResult,
  getStudentPracticeAttemptHistory,
  getStudentDashboardSummary,
};
