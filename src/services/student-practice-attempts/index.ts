import { createStudentPracticeAttempt } from "./create";
import { finishStudentPracticeAttempt } from "./finish";
import { abandonStudentPracticeAttempt } from "./abandon";
import { timeOutStudentPracticeAttempt } from "./timeout";
import { getStudentPracticeAttemptResult } from "./get-result";
import { getStudentPracticeAttemptHistory } from "./get-history";
import { getStudentDashboardSummary } from "./get-dashboard-summary";
import { getStudentPracticeAttemptState } from "./get-state";
import { getInProgressStudentPracticeAttempt } from "./get-in-progress";
import { saveStudentPracticeAttemptProgress } from "./save-progress";

export const studentPracticeAttemptsService = {
  createStudentPracticeAttempt,
  finishStudentPracticeAttempt,
  abandonStudentPracticeAttempt,
  timeOutStudentPracticeAttempt,
  getStudentPracticeAttemptResult,
  getStudentPracticeAttemptHistory,
  getStudentDashboardSummary,
  getStudentPracticeAttemptState,
  getInProgressStudentPracticeAttempt,
  saveStudentPracticeAttemptProgress,
};
