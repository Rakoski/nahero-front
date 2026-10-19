"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/dictionaries";
import type { PracticeResults } from "./usePracticeSession";

const PAGE_SIZE = 10;
const ROW_SIZE = 5;

interface PracticeNavigationProps {
  questionIds: number[];
  index: number;
  results: PracticeResults;
  score: string;
  dict: Dictionary["questionBank"];
  onSelect: (index: number) => void;
}

export function PracticeNavigation({ questionIds, index, results, score, dict, onSelect }: PracticeNavigationProps) {
  const page = Math.floor(index / PAGE_SIZE);
  const lastPage = Math.floor((questionIds.length - 1) / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const pageIds = questionIds.slice(pageStart, pageStart + PAGE_SIZE);
  const rows = [pageIds.slice(0, ROW_SIZE), pageIds.slice(ROW_SIZE)].filter((row) => row.length > 0);

  const buttonClass = (questionId: number, position: number) => {
    const result = results[questionId];
    const isCurrent = position === index;
    return cn(
      "h-10 w-10 shrink-0 cursor-pointer border p-0 text-sm font-semibold transition-all md:h-12 md:w-12 md:text-xl",
      result?.correct && "border-green-500 bg-green-500/15 text-green-500 hover:bg-green-500/25",
      result && !result.correct && "border-red-500 bg-red-500/15 text-red-500 hover:bg-red-500/25",
      !result && isCurrent && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
      result && isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background",
    );
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground md:text-base">{score}</span>
        <span className="text-lg font-medium md:text-xl">
          {index + 1} / {questionIds.length}
        </span>
      </div>

      <div className="flex w-full items-center justify-center gap-1 md:gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 shrink-0 p-0 md:h-10 md:w-10"
          disabled={page === 0}
          aria-label={dict.practice.previousPage}
          onClick={() => onSelect((page - 1) * PAGE_SIZE)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col gap-1.5 md:flex-row md:gap-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1.5 md:gap-2">
              {row.map((questionId, offset) => {
                const position = pageStart + rowIndex * ROW_SIZE + offset;
                return (
                  <Button
                    key={questionId}
                    variant="outline"
                    size="sm"
                    aria-current={position === index ? "step" : undefined}
                    aria-label={dict.drawer.questionNumber.replace("{{number}}", String(position + 1))}
                    className={buttonClass(questionId, position)}
                    onClick={() => onSelect(position)}
                  >
                    {position + 1}
                  </Button>
                );
              })}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 shrink-0 p-0 md:h-10 md:w-10"
          disabled={page === lastPage}
          aria-label={dict.practice.nextPage}
          onClick={() => onSelect((page + 1) * PAGE_SIZE)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
