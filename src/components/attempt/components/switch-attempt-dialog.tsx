"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Routes } from "@/routes/routes";

export interface SwitchAttemptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscardAndStart: () => void;
  isStarting?: boolean;
  lang: "en" | "pt";
  inProgress: { attemptId: number; practiceExamTitle: string } | null;
  dict: {
    title: string;
    description: string;
    attempts_note: string;
    resume: string;
    discard_and_start: string;
    cancel: string;
  };
}

/**
 * Shown when the student asks to start a practice exam while another attempt is still
 * running. Starting the new one discards the old one, so the choice is theirs to make.
 */
export function SwitchAttemptDialog({
  open,
  onOpenChange,
  onDiscardAndStart,
  isStarting,
  lang,
  inProgress,
  dict,
}: SwitchAttemptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>
            {dict.description.replace(
              "{{title}}",
              inProgress?.practiceExamTitle ?? "",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            {dict.attempts_note}
          </p>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            {dict.cancel}
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            {inProgress && (
              <Button variant="outline" asChild>
                <Link
                  href={`/${lang}${Routes.Practice}/${inProgress.attemptId}/attempt`}
                >
                  {dict.resume}
                </Link>
              </Button>
            )}
            <Button onClick={onDiscardAndStart} disabled={isStarting}>
              {dict.discard_and_start}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
