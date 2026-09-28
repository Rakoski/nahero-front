"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getStudentDashboardSummary } from "@/services/student-practice-attempts/get-dashboard-summary";
import { useLocale } from "@/providers/locale-provider";
import { handlePaywallError, isPaymentRequiredError } from "@/utils/paywall-utils";

export const STUDENT_DASHBOARD_SUMMARY_KEY = ["student", "dashboard-summary"] as const;

export function useStudentDashboardSummary() {
  const { lang } = useLocale();
  const router = useRouter();

  const query = useQuery({
    queryKey: STUDENT_DASHBOARD_SUMMARY_KEY,
    queryFn: getStudentDashboardSummary,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      !isPaymentRequiredError(error) && failureCount < 3,
  });

  const { error } = query;

  useEffect(() => {
    if (error) handlePaywallError(error, lang, router, "dashboard");
  }, [error, lang, router]);

  return { ...query, isPaywalled: isPaymentRequiredError(error) };
}
