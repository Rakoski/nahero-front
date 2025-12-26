"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Question,
  Answer,
  getQuestionStatus,
  QuestionStatus,
} from "../../../app/[lang]/(unauthenticated)/practice-exams/[id]/attempt/utils";

export interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  onQuestionSelect: (index: number) => void;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
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
  dict,
}: QuestionNavigationProps) {
  const QUESTIONS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(
    Math.floor(currentQuestionIndex / QUESTIONS_PER_PAGE)
  );

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
  const visibleQuestions = questions.slice(startIndex, endIndex);

  const isWarning = timeRemaining < 300;

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
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="grid grid-cols-3 items-center px-4 py-3 border-b border-border">
      {/* Left: Timer - Fixed width */}
      <div className="flex justify-start">
        <div>
          <span className="mr-2">{dict.timeRemaining}</span>
          <span className="font-bold text-xl">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Center: Navigation Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          {visibleQuestions.map((question, idx) => {
            const absoluteIndex = startIndex + idx;
            const status = getQuestionStatus(
              question.id,
              questions[currentQuestionIndex].id,
              answers
            );

            return (
              <Button
                key={question.id}
                onClick={() => onQuestionSelect(absoluteIndex)}
                variant="outline"
                size="sm"
                className={cn(
                  "h-12 w-12 p-0 border transition-all shrink-0 text-xl",
                  getButtonClasses(status)
                )}
              >
                {absoluteIndex + 1}
              </Button>
            );
          })}
        </div>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-end">
        <div className="font-medium text-xl">
          <span>
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
      </div>
    </div>
  );
}
