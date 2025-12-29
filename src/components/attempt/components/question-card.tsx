"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Question,
  Answer,
  isOptionSelected,
  getSelectionText,
} from "../../../app/[lang]/(unauthenticated)/practice-exams/[slug]/attempt/utils";

export interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answers: Answer[];
  onAnswerChange: (questionId: number, optionId: number) => void;
  dict: {
    title: string;
    question_of: string;
    select_answer: string;
    select_answers: string;
    single_choice: string;
    multiple_choice: string;
    multiple_choice_many: string;
  };
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answers,
  onAnswerChange,
  dict,
}: QuestionCardProps) {
  const isSingleChoice = question.type === "single";
  const selectionText = getSelectionText(question, dict);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl">
              {dict.title} {questionNumber}
            </CardTitle>
            <span className="text-muted-foreground text-base">
              {dict.question_of} {totalQuestions}
            </span>
          </div>
          <Badge variant="outline" className="text-sm">
            {selectionText}
          </Badge>
        </div>
        <p className="text-lg text-foreground leading-relaxed">
          {question.text}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground mb-4">
          {isSingleChoice ? dict.select_answer : dict.select_answers}
        </p>

        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = isOptionSelected(
              question.id,
              option.id,
              answers
            );

            return (
              <button
                key={option.id}
                onClick={() => onAnswerChange(question.id, option.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all",
                  "hover:border-primary hover:bg-accent",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isSelected
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start gap-3 cursor-pointer">
                  <div
                    className={cn(
                      "shrink-0 w-5 h-5 rounded mt-0.5 border-2 transition-colors",
                      isSingleChoice ? "rounded-full" : "rounded",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/50"
                    )}
                  >
                    {isSelected && (
                      <div className="w-full h-full flex items-center justify-center">
                        {isSingleChoice ? (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 text-primary-foreground"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="flex-1">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
