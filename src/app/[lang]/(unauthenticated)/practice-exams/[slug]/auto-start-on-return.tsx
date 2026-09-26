"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SwitchAttemptDialog } from "@/components/attempt/components";
import { useStartAttempt } from "@/hooks/useStartAttempt";
import { useInProgressAttempt } from "@/hooks/useInProgressAttempt";

interface Props {
  practiceExamId: number;
  lang: "en" | "pt";
  switchDict: {
    title: string;
    description: string;
    free_try_note: string;
    resume: string;
    discard_and_start: string;
    cancel: string;
  };
}

export function AutoStartOnReturn({
  practiceExamId,
  lang,
  switchDict,
}: Props) {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { data: inProgress } = useInProgressAttempt(isAuthenticated);
  const {
    startAttempt,
    isStarting,
    hasConflict,
    discardAndStart,
    dismissConflict,
  } = useStartAttempt(lang);
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    if (searchParams.get("start") !== "1") return;
    if (!isAuthenticated) return;

    triggered.current = true;
    startAttempt(practiceExamId);
  }, [searchParams, isAuthenticated, practiceExamId, startAttempt]);

  return (
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
  );
}
