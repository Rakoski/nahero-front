"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwitchAttemptDialog } from "@/components/attempt/components";
import { Routes } from "@/routes/routes";
import { useStartAttempt } from "@/hooks/useStartAttempt";
import { useInProgressAttempt } from "@/hooks/useInProgressAttempt";
import { InlineError } from "@/components/shared";

interface Props {
  practiceExamId: number;
  slug: string;
  lang: "en" | "pt";
  dict: {
    start_logged_in: string;
    start_logged_out: string;
    starting: string;
    resume: string;
  };
  switchDict: {
    title: string;
    description: string;
    attempts_note: string;
    resume: string;
    discard_and_start: string;
    cancel: string;
  };
}

export function StartExamButton({
  practiceExamId,
  slug,
  lang,
  dict,
  switchDict,
}: Props) {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { data: inProgress } = useInProgressAttempt(isAuthenticated);
  const {
    startAttempt,
    isStarting,
    startError,
    hasConflict,
    discardAndStart,
    dismissConflict,
  } = useStartAttempt(lang);

  const isResumable = inProgress?.practiceExamId === practiceExamId;

  const handleClick = async () => {
    if (!isAuthenticated) {
      const callbackUrl = `/${lang}${Routes.PracticeExams}/${slug}?start=1`;
      router.push(
        `/${lang}${Routes.Login}?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
      return;
    }

    await startAttempt(practiceExamId);
  };

  const label = !isAuthenticated
    ? dict.start_logged_out
    : isResumable
      ? dict.resume
      : dict.start_logged_in;

  return (
    <>
      <Button
        size="lg"
        className="h-12 w-full px-10 text-base font-semibold sm:w-auto sm:min-w-64"
        onClick={handleClick}
        disabled={isStarting}
      >
        {isStarting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {!isStarting && isResumable && <Play className="mr-2 h-5 w-5" />}
        {isStarting ? dict.starting : label}
      </Button>
      <InlineError error={startError} className="mt-3" />

      <SwitchAttemptDialog
        open={hasConflict}
        onOpenChange={(open) => {
          if (!open) dismissConflict();
        }}
        onDiscardAndStart={discardAndStart}
        isStarting={isStarting}
        lang={lang}
        inProgress={
          inProgress
            ? {
                attemptId: inProgress.attemptId,
                practiceExamTitle: inProgress.practiceExamTitle,
              }
            : null
        }
        dict={switchDict}
      />
    </>
  );
}
