"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentDashboardSummary } from "@/services/student-practice-attempts/get-dashboard-summary";
import { isPaymentRequiredError } from "@/utils/paywall-utils";

export const STUDENT_DASHBOARD_SUMMARY_KEY = ["student", "dashboard-summary"] as const;

export function useStudentDashboardSummary() {
  const query = useQuery({
    queryKey: STUDENT_DASHBOARD_SUMMARY_KEY,
    queryFn: getStudentDashboardSummary,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      !isPaymentRequiredError(error) && failureCount < 3,
  });

  return { ...query, isPaywalled: isPaymentRequiredError(query.error) };
}
