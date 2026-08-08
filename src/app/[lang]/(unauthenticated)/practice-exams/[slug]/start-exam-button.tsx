"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { studentPracticeAttemptsService } from "@/services/student-practice-attempts";
import { handleError } from "@/utils/error-utils";
import { handlePaywallError } from "@/utils/paywall-utils";

interface Props {
  practiceExamId: number;
  slug: string;
  lang: "en" | "pt";
  dict: {
    start_logged_in: string;
    start_logged_out: string;
    starting: string;
  };
}

export function StartExamButton({ practiceExamId, slug, lang, dict }: Props) {
  const router = useRouter();
  const { status } = useSession();
  const [isStarting, setIsStarting] = useState(false);

  const handleClick = async () => {
    if (status !== "authenticated") {
      const callbackUrl = `/${lang}${Routes.PracticeExams}/${slug}?start=1`;
      router.push(
        `/${lang}${Routes.Login}?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
      return;
    }

    try {
      setIsStarting(true);
      const attemptId =
        await studentPracticeAttemptsService.createStudentPracticeAttempt(
          practiceExamId,
        );
      if (attemptId) {
        router.push(`/${lang}${Routes.Practice}/${attemptId}/attempt`);
      }
    } catch (error) {
      if (!handlePaywallError(error, lang, router, "practice-attempt")) {
        handleError(error);
      }
      setIsStarting(false);
    }
  };

  const label =
    status === "authenticated" ? dict.start_logged_in : dict.start_logged_out;

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      onClick={handleClick}
      disabled={isStarting}
    >
      {isStarting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isStarting ? dict.starting : label}
    </Button>
  );
}
