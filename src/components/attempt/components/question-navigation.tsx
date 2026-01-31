"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Question,
  Answer,
  getQuestionStatus,
  QuestionStatus,
} from "../../../app/[lang]/(unauthenticated)/practice-exams/[slug]/attempt/utils";

export interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  onQuestionSelect: (index: number) => void;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  totalElements?: number;
  currentPage?: number;
  totalPages?: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  dict: {
    answered: string;
    unanswered: string;
    current: string;
    timeRemaining: string;
  };
}

export function QuestionNavigation({
  questions,
  currentQuestionIndex,
  answers,
  onQuestionSelect,
  timeRemaining,
  formatTime,
  totalElements,
  currentPage: apiCurrentPage,
  totalPages: apiTotalPages,
  onNextPage,
  onPreviousPage,
  dict,
}: QuestionNavigationProps) {
  const visibleQuestions = questions;

  const totalQuestionsCount = totalElements ?? questions.length;

  const globalQuestionNumber =
    (apiCurrentPage ?? 0) * 10 + currentQuestionIndex + 1;

  const getButtonClasses = (status: QuestionStatus): string => {
    if (status === "current") {
      const answered = answers.some(
        (a) => a.questionId === questions[currentQuestionIndex].id
      );
      if (answered) {
        return "bg-[#9e751d] border-[#773712] text-[#5e410c] font-semibold";
      }
      return "bg-[#8f673a] border-[#b96d3a] text-[#4d3407] font-semibold";
    }
    if (status === "answered") {
      return "bg-[#fdbd32] border-[#8f6019] text-[#5e410c] font-semibold";
    }
    return "bg-background border-border text-foreground hover:bg-accent font-semibold";
  };

  const handlePrevPage = () => {
    if (onPreviousPage && apiCurrentPage && apiCurrentPage > 0) {
      onPreviousPage();
    }
  };

  const handleNextPage = () => {
    if (
      onNextPage &&
      apiTotalPages &&
      apiCurrentPage !== undefined &&
      apiCurrentPage < apiTotalPages - 1
    ) {
      onNextPage();
    }
  };

  const canGoPrevious = apiCurrentPage !== undefined && apiCurrentPage > 0;
  const canGoNext =
    apiCurrentPage !== undefined &&
    apiTotalPages !== undefined &&
    apiCurrentPage < apiTotalPages - 1;

  return (
    <div className="flex flex-col gap-4 px-4 py-3 border-b border-border bg-background">
      <div className="flex items-center justify-between w-full md:grid md:grid-cols-3 md:items-center">
        <div className="flex justify-start">
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base text-muted-foreground whitespace-nowrap">
              {dict.timeRemaining}
            </span>
            <span className="font-bold text-lg md:text-xl">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="hidden md:block" />

        <div className="flex justify-end">
          <div className="font-medium text-lg md:text-xl">
            <span className="text-muted-foreground md:text-foreground">
              {globalQuestionNumber} / {totalQuestionsCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 md:gap-3 w-full">
        <Button
          onClick={handlePrevPage}
          disabled={!canGoPrevious}
          variant="outline"
          size="sm"
          className="h-9 w-9 md:h-10 md:w-10 p-0 shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col gap-1.5 md:flex-row md:gap-2">
          <div className="flex gap-1.5 md:gap-2 justify-center">
            {visibleQuestions.slice(0, 5).map((question, idx) => {
              const globalIndex = (apiCurrentPage ?? 0) * 10 + idx;
              const status = getQuestionStatus(
                question.id,
                questions[currentQuestionIndex].id,
                answers
              );

              return (
                <Button
                  key={question.id}
                  onClick={() => onQuestionSelect(idx)}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-10 w-10 md:h-12 md:w-12 p-0 border transition-all shrink-0 text-sm md:text-xl cursor-pointer",
                    getButtonClasses(status)
                  )}
                >
                  {globalIndex + 1}
                </Button>
              );
            })}
          </div>
          <div className="flex gap-1.5 md:gap-2 justify-center">
            {visibleQuestions.slice(5, 10).map((question, idx) => {
              const globalIndex = (apiCurrentPage ?? 0) * 10 + idx + 5;
              const status = getQuestionStatus(
                question.id,
                questions[currentQuestionIndex].id,
                answers
              );

              return (
                <Button
                  key={question.id}
                  onClick={() => onQuestionSelect(idx + 5)}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-10 w-10 md:h-12 md:w-12 p-0 border transition-all shrink-0 text-sm md:text-xl cursor-pointer",
                    getButtonClasses(status)
                  )}
                >
                  {globalIndex + 1}
                </Button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={handleNextPage}
          disabled={!canGoNext}
          variant="outline"
          size="sm"
          className="h-9 w-9 md:h-10 md:w-10 p-0 shrink-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
