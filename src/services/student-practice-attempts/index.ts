import { createStudentPracticeAttempt } from "./create";
import { finishStudentPracticeAttempt } from "./finish";
import { getStudentPracticeAttemptResult } from "./get-result";
import { getStudentPracticeAttemptHistory } from "./get-history";
import { getStudentDashboardSummary } from "./get-dashboard-summary";

export const studentPracticeAttemptsService = {
  createStudentPracticeAttempt,
  finishStudentPracticeAttempt,
  getStudentPracticeAttemptResult,
  getStudentPracticeAttemptHistory,
  getStudentDashboardSummary,
};
