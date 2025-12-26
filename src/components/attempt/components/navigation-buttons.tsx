"use client";

import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NavigationButtonsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  dict: {
    previous: string;
    next: string;
    submit: string;
    submitting: string;
  };
}

export function NavigationButtons({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
  dict,
}: NavigationButtonsProps) {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        variant="outline"
        className="w-32"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {dict.previous}
      </Button>

      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-48"
          size="lg"
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? dict.submitting : dict.submit}
        </Button>
      ) : (
        <Button onClick={onNext} className="w-32">
          {dict.next}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
