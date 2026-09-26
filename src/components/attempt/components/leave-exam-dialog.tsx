"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface LeaveExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeepAndLeave: () => void;
  onDiscardAndLeave: () => void;
  dict: {
    title: string;
    description: string;
    stay: string;
    leave_keep: string;
    leave_discard: string;
  };
}

export function LeaveExamDialog({
  open,
  onOpenChange,
  onKeepAndLeave,
  onDiscardAndLeave,
  dict,
}: LeaveExamDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {dict.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <Save className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary">{dict.description}</p>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button onClick={onDiscardAndLeave} variant="ghost">
            {dict.leave_discard}
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              {dict.stay}
            </Button>
            <Button onClick={onKeepAndLeave}>{dict.leave_keep}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
