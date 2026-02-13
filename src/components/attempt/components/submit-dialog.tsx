"use client";

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

export interface SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  unansweredCount: number;
  totalAnswered: number;
  dict: {
    title: string;
    description: string;
    unanswered_warning: string;
    no_answers_error: string;
    cancel: string;
    submit: string;
  };
}

export function SubmitDialog({
  open,
  onOpenChange,
  onConfirm,
  unansweredCount,
  totalAnswered,
  dict,
}: SubmitDialogProps) {
  const hasUnanswered = unansweredCount > 0;
  const hasNoAnswers = totalAnswered === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>{dict.description}</DialogDescription>
        </DialogHeader>

        {hasNoAnswers && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">
              {dict.no_answers_error}
            </p>
          </div>
        )}

        {hasUnanswered && !hasNoAnswers && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              {dict.unanswered_warning.replace(
                "{{count}}",
                unansweredCount.toString()
              )}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            {dict.cancel}
          </Button>
          <Button onClick={onConfirm} disabled={hasNoAnswers}>
            {dict.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
