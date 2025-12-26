"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  calculateRemainingTime,
  formatTimeLong,
} from "../../../app/[lang]/(unauthenticated)/practice-exams/[id]/attempt/utils";
import { cn } from "@/lib/utils";

export interface ExamTimerProps {
  startedAt: Date;
  timeLimitMinutes: number;
  onTimeUp: () => void;
  dict: {
    time_remaining: string;
    dialogs: {
      time_up: {
        title: string;
        description: string;
        question: string;
        continue: string;
        submit: string;
      };
    };
  };
}

export function ExamTimer({
  startedAt,
  timeLimitMinutes,
  onTimeUp,
  dict,
}: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    calculateRemainingTime(startedAt, timeLimitMinutes)
  );
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateRemainingTime(startedAt, timeLimitMinutes);
      setRemainingSeconds(remaining);

      if (remaining === 0 && !hasShownDialog) {
        setShowTimeUpDialog(true);
        setHasShownDialog(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, timeLimitMinutes, hasShownDialog]);

  const handleContinue = () => {
    setShowTimeUpDialog(false);
  };

  const handleSubmit = () => {
    setShowTimeUpDialog(false);
    onTimeUp();
  };

  const isLowTime = remainingSeconds < 300; // Less than 5 minutes
  const isCritical = remainingSeconds < 60; // Less than 1 minute

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors",
          isCritical
            ? "border-destructive bg-destructive/10 text-destructive"
            : isLowTime
            ? "border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
            : "border-border bg-card"
        )}
      >
        <Clock className="h-5 w-5" />
        <div className="flex flex-col">
          <span className="text-xs font-medium">{dict.time_remaining}</span>
          <span className="text-lg font-bold tabular-nums">
            {formatTimeLong(remainingSeconds)}
          </span>
        </div>
      </div>

      <Dialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.dialogs.time_up.title}</DialogTitle>
            <DialogDescription>
              {dict.dialogs.time_up.description}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-lg font-medium">
              {dict.dialogs.time_up.question}
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button onClick={handleContinue} variant="outline">
              {dict.dialogs.time_up.continue}
            </Button>
            <Button onClick={handleSubmit}>
              {dict.dialogs.time_up.submit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
