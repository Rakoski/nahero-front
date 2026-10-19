"use client";

import { Check, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QuestionBankQuestion } from "@/services/question-bank/get-question";
import type { AnswerPracticeQuestionResponse } from "@/services/feedback/answer-practice-question";
import type { Dictionary } from "@/dictionaries";

interface PracticeQuestionProps {
  question: QuestionBankQuestion;
  number: number;
  total: number;
  selected: number[];
  result: AnswerPracticeQuestionResponse | undefined;
  dict: Dictionary["questionBank"];
  onToggle: (alternativeId: number, multiple: boolean) => void;
}

export function PracticeQuestion({ question, number, total, selected, result, dict, onToggle }: PracticeQuestionProps) {
  const isMultiple = question.type === "MULTIPLE_CHOICE";
  const answered = result !== undefined;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <CardTitle className="text-2xl">{dict.drawer.questionNumber.replace("{{number}}", String(number))}</CardTitle>
            <span className="text-base text-muted-foreground">{dict.practice.of.replace("{{total}}", String(total))}</span>
          </div>
          <Badge variant="outline" className="text-sm">
            {isMultiple ? dict.drawer.chooseMany : dict.practice.singleChoice}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {question.practiceExam.title}
          {question.domain && ` · ${question.domain.name}`}
        </p>
        <p className="text-lg leading-relaxed text-foreground">{question.content}</p>
        {question.imageUrl && <img src={question.imageUrl} alt="" className="max-w-full rounded-lg sm:max-w-md" />}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3" role={isMultiple ? "group" : "radiogroup"}>
          {question.alternatives.map((alternative) => {
            const isSelected = selected.includes(alternative.alternativeId);
            const isCorrect = result?.correctAlternativeIds.includes(alternative.alternativeId) ?? false;
            const isWrongPick = answered && isSelected && !isCorrect;

            return (
              <button
                key={alternative.alternativeId}
                type="button"
                role={isMultiple ? "checkbox" : "radio"}
                aria-checked={isSelected}
                disabled={answered}
                onClick={() => onToggle(alternative.alternativeId, isMultiple)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  !answered && "cursor-pointer hover:border-primary hover:bg-accent",
                  !answered && (isSelected ? "border-primary bg-primary/10 font-medium" : "border-border bg-card"),
                  answered && isCorrect && "border-green-500 bg-green-500/10",
                  isWrongPick && "border-red-500 bg-red-500/10",
                  answered && !isCorrect && !isWrongPick && "border-border bg-card opacity-60",
                )}
              >
                {answered && isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                ) : isWrongPick ? (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                ) : (
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors",
                      isMultiple ? "rounded" : "rounded-full",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/50",
                    )}
                  >
                    {isSelected &&
                      (isMultiple ? (
                        <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                      ))}
                  </span>
                )}
                <span className="flex-1">
                  {alternative.content}
                  {alternative.imageUrl && (
                    <img src={alternative.imageUrl} alt="" className="mt-2 max-w-full rounded sm:max-w-xs" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {result && (
          <div className="space-y-3" aria-live="polite">
            <p className={cn("text-lg font-semibold", result.correct ? "text-green-500" : "text-red-500")}>
              {result.correct ? dict.drawer.correct : dict.drawer.incorrect}
            </p>
            {result.explanation && (
              <div className="rounded-lg bg-muted p-4 text-base">
                <h4 className="mb-2 font-semibold">{dict.drawer.explanation}</h4>
                <p className="leading-relaxed">{result.explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
