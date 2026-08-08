import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface ScorePoint {
  attemptId: number;
  endTime: string;
  score: number;
  passed: boolean;
  practiceExamTitle: string | null;
}

export interface PracticeExamPerformance {
  practiceExamId: number;
  title: string;
  attempts: number;
  bestScore: number | null;
  passRate: number;
  lastScore: number | null;
  lastEndTime: string | null;
}

export interface DailyActivity {
  date: string;
  attempts: number;
}

export interface InProgressAttempt {
  attemptId: number;
  practiceExamId: number | null;
  practiceExamTitle: string | null;
  startTime: string;
}

export interface RecentAttempt {
  attemptId: number;
  practiceExamId: number | null;
  practiceExamTitle: string | null;
  score: number | null;
  endTime: string | null;
}

export interface GetDashboardSummaryResponse {
  totalAttempts: number;
  completedAttempts: number;
  passRate: number | null;
  averageScore: number | null;
  bestScore: number | null;
  totalStudyMinutes: number;
  currentStreakDays: number;
  attemptsByStatus: Record<string, number>;
  scoreOverTime: ScorePoint[];
  byPracticeExam: PracticeExamPerformance[];
  activityLast30Days: DailyActivity[];
  currentInProgress: InProgressAttempt | null;
  lastFailed: RecentAttempt | null;
}

export async function getStudentDashboardSummary(): Promise<GetDashboardSummaryResponse> {
  try {
    const response = await api.get<GetDashboardSummaryResponse>(
      NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.GET_DASHBOARD_SUMMARY,
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
