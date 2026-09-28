"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { getInProgressStudentPracticeAttempt } from "@/services/student-practice-attempts/get-in-progress";

export const IN_PROGRESS_ATTEMPT_KEY = [
  QUERIES.STUDENT_PRACTICE_ATTEMPTS.GET_IN_PROGRESS,
] as const;

export function useInProgressAttempt(enabled = true) {
  return useQuery({
    queryKey: IN_PROGRESS_ATTEMPT_KEY,
    queryFn: getInProgressStudentPracticeAttempt,
    enabled,
    retry: false,
    staleTime: 30 * 1000,
  });
}
