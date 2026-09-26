"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Routes } from "@/routes/routes";
import { studentPracticeAttemptsService } from "@/services/student-practice-attempts";
import { handleError } from "@/utils/error-utils";
import { handlePaywallError } from "@/utils/paywall-utils";
import { isAttemptInProgressConflict } from "@/utils/attempt-utils";
import { IN_PROGRESS_ATTEMPT_KEY } from "@/hooks/useInProgressAttempt";

/**
 * Starts (or resumes) an attempt for a practice exam.
 *
 * The API resumes the running attempt when it belongs to the same practice exam, and
 * refuses with a conflict when it belongs to another one — that conflict surfaces here as
 * `hasConflict`, so the caller can ask the student whether to discard the old attempt.
 */
export function useStartAttempt(lang: "en" | "pt") {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isStarting, setIsStarting] = useState(false);
  const [conflictPracticeExamId, setConflictPracticeExamId] = useState<
    number | null
  >(null);

  const startAttempt = useCallback(
    async (practiceExamId: number, discardInProgress = false) => {
      try {
        setIsStarting(true);

        const attemptId =
          await studentPracticeAttemptsService.createStudentPracticeAttempt(
            practiceExamId,
            { discardInProgress },
          );

        if (!attemptId) {
          setIsStarting(false);
          return;
        }

        setConflictPracticeExamId(null);
        queryClient.invalidateQueries({ queryKey: IN_PROGRESS_ATTEMPT_KEY });
        router.push(`/${lang}${Routes.Practice}/${attemptId}/attempt`);
      } catch (error) {
        setIsStarting(false);

        if (isAttemptInProgressConflict(error)) {
          setConflictPracticeExamId(practiceExamId);
          return;
        }

        if (!handlePaywallError(error, lang, router, "practice-attempt")) {
          handleError(error);
        }
      }
    },
    [lang, queryClient, router],
  );

  const discardAndStart = useCallback(() => {
    if (conflictPracticeExamId === null) return;
    startAttempt(conflictPracticeExamId, true);
  }, [conflictPracticeExamId, startAttempt]);

  const dismissConflict = useCallback(
    () => setConflictPracticeExamId(null),
    [],
  );

  return {
    startAttempt,
    isStarting,
    hasConflict: conflictPracticeExamId !== null,
    discardAndStart,
    dismissConflict,
  };
}
