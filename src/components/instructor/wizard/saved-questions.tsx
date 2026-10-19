"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineError } from "@/components/shared";
import { SimplePagination } from "@/components/question-bank/simple-pagination";
import { useLocale } from "@/providers/locale-provider";
import { useDeleteInstructorQuestion, useInstructorQuestions } from "@/hooks/useInstructor";

export function SavedQuestions({ practiceExamId }: { practiceExamId: number }) {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.questions;
  const [page, setPage] = useState(0);
  const questions = useInstructorQuestions(practiceExamId, page);
  const deleteQuestion = useDeleteInstructorQuestion();

  const remove = (questionId: number) =>
    deleteQuestion.mutate(
      { practiceExamId, questionId },
      {
        onSuccess: () => {
          toast.success(dict.deleted);
          if (questions.data?.content.length === 1 && page > 0) setPage(page - 1);
        },
      },
    );

  if (questions.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!questions.data) {
    return (
      <div className="space-y-2 rounded-lg border p-4 text-center">
        <InlineError error={questions.error} />
        <p className="text-sm text-muted-foreground">{dict.savedLoadError}</p>
      </div>
    );
  }

  const { content, totalElements, last } = questions.data;

  return (
    <section className="space-y-3">
      <h3 className="font-semibold">{dict.savedTitle.replace("{{count}}", String(totalElements))}</h3>

      {content.length === 0 ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">{dict.savedEmpty}</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {content.map((question) => (
            <li key={question.id} className="flex items-start justify-between gap-3 p-3">
              <div className="min-w-0 space-y-1.5">
                <p className="text-sm break-words">{question.preview}</p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="secondary">{dict.types[question.type]}</Badge>
                  {question.domain && <Badge variant="outline">{question.domain.name}</Badge>}
                  <Badge variant="outline">{question.language.toUpperCase()}</Badge>
                  <span>
                    {dict.alternativesSummary
                      .replace("{{count}}", String(question.alternativeCount))
                      .replace("{{correct}}", String(question.correctCount))}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={dict.delete}
                disabled={deleteQuestion.isPending}
                onClick={() => remove(question.id)}
              >
                {deleteQuestion.isPending && deleteQuestion.variables?.questionId === question.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <InlineError error={deleteQuestion.error} />

      <SimplePagination
        page={page}
        hasNext={!last}
        disabled={questions.isFetching}
        dict={dictionary.instructor.wizard.pagination}
        onChange={setPage}
      />
    </section>
  );
}
