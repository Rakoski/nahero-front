"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Routes } from "@/routes/routes";
import { studentPracticeAttemptsService } from "@/services/student-practice-attempts";
import { handleError } from "@/utils/error-utils";
import { handlePaywallError } from "@/utils/paywall-utils";

interface Props {
  practiceExamId: number;
  lang: "en" | "pt";
}

export function AutoStartOnReturn({ practiceExamId, lang }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    if (searchParams.get("start") !== "1") return;
    if (status !== "authenticated") return;

    triggered.current = true;
    (async () => {
      try {
        const attemptId =
          await studentPracticeAttemptsService.createStudentPracticeAttempt(
            practiceExamId,
          );
        if (attemptId) {
          router.replace(`/${lang}${Routes.Practice}/${attemptId}/attempt`);
        }
      } catch (error) {
        if (!handlePaywallError(error, lang, router, "practice-attempt")) {
          handleError(error);
        }
      }
    })();
  }, [searchParams, status, practiceExamId, lang, router]);

  return null;
}
