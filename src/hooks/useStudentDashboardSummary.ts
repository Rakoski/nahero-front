"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentDashboardSummary } from "@/services/student-practice-attempts/get-dashboard-summary";

export const STUDENT_DASHBOARD_SUMMARY_KEY = ["student", "dashboard-summary"] as const;

export function useStudentDashboardSummary() {
  return useQuery({
    queryKey: STUDENT_DASHBOARD_SUMMARY_KEY,
    queryFn: getStudentDashboardSummary,
    staleTime: 5 * 60 * 1000,
  });
}
