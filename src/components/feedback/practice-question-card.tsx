"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAnswerPracticeQuestion } from "@/hooks/useAnswerPracticeQuestion";
import type { PracticeQuestion } from "@/services/feedback/get-page";

export type PracticeQuestionDict = {
  questionNumber: string;
  chooseMany: string;
  answer: string;
  correct: string;
  incorrect: string;
  explanation: string;
};

interface PracticeQuestionCardProps {
  question: PracticeQuestion;
  number: number;
  dict: PracticeQuestionDict;
}

export function PracticeQuestionCard({ question, number, dict }: PracticeQuestionCardProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const { mutate, data: result, isPending } = useAnswerPracticeQuestion();
  const isMultiple = question.type === "MULTIPLE_CHOICE";
  const answered = result !== undefined;

  const toggle = (alternativeId: number) => {
    if (answered) return;
    setSelected((current) =>
      isMultiple
        ? current.includes(alternativeId)
          ? current.filter((id) => id !== alternativeId)
          : [...current, alternativeId]
        : [alternativeId],
    );
  };

  const submit = () =>
    mutate({ questionId: question.questionId, alternativeIds: selected });

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-base text-muted-foreground">
          {dict.questionNumber.replace("{{number}}", String(number))}
        </CardTitle>
        <p className="leading-relaxed">{question.content}</p>
        {question.imageUrl && (
          <img src={question.imageUrl} alt="" className="mt-2 max-w-full rounded-lg sm:max-w-md" />
        )}
        {isMultiple && <p className="text-sm text-muted-foreground">{dict.chooseMany}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2" role={isMultiple ? "group" : "radiogroup"}>
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
                onClick={() => toggle(alternative.alternativeId)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg border p-3 text-left text-sm transition-colors",
                  !answered && "hover:bg-muted",
                  !answered && isSelected && "border-primary bg-primary/10",
                  answered && isCorrect && "border-green-500 bg-green-500/10",
                  isWrongPick && "border-red-500 bg-red-500/10",
                )}
              >
                {answered && isCorrect && <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />}
                {isWrongPick && <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />}
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

        {answered ? (
          <div className="space-y-3">
            <p className={cn("font-semibold", result.correct ? "text-green-500" : "text-red-500")}>
              {result.correct ? dict.correct : dict.incorrect}
            </p>
            {result.explanation && (
              <div className="rounded-lg bg-muted p-4 text-sm">
                <h4 className="mb-2 font-semibold">{dict.explanation}</h4>
                <p className="leading-relaxed">{result.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={submit} disabled={selected.length === 0 || isPending} className="w-full sm:w-auto">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {dict.answer}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
