import { Check } from "lucide-react";
import type { Dictionary } from "@/dictionaries";
import type { SampleQuestionDTO } from "@/lib/dtos";
import { cn } from "@/lib/utils";

type Props = {
  questions: SampleQuestionDTO[];
  totalQuestions: number | null;
  dict: Dictionary["practiceExamDetail"]["samples"];
};

const letter = (index: number) => String.fromCharCode(65 + index);

export function ExamSampleQuestions({
  questions,
  totalQuestions,
  dict,
}: Props) {
  if (questions.length === 0) return null;

  return (
    <section className="space-y-6 border-t pt-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{dict.heading}</h2>
        <p className="text-muted-foreground">{dict.subheading}</p>
      </div>

      <ol className="space-y-6">
        {questions.map((question, index) => (
          <li key={question.id} className="rounded-lg border p-5 space-y-4">
            <h3 className="font-medium leading-relaxed">
              <span className="mr-2 text-muted-foreground">{index + 1}.</span>
              {question.content}
            </h3>

            <ul className="space-y-2">
              {question.alternatives.map((alternative, alternativeIndex) => (
                <li
                  key={alternative.id}
                  className={cn(
                    "flex items-start gap-3 rounded-md border px-3 py-2 text-sm",
                    alternative.isCorrect &&
                      "border-green-600/50 bg-green-950/30",
                  )}
                >
                  <span className="font-mono text-muted-foreground">
                    {letter(alternativeIndex)}
                  </span>
                  <span className="flex-1">{alternative.content}</span>
                  {alternative.isCorrect && (
                    <span className="flex shrink-0 items-center gap-1 font-medium text-green-500">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {dict.correct_answer}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="rounded-md bg-stone-900/60 p-4 text-sm">
              <p className="mb-1 font-semibold">{dict.explanation}</p>
              <p className="leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {totalQuestions !== null && totalQuestions > questions.length && (
        <p className="rounded-lg border border-dashed px-4 py-3 text-center text-sm text-muted-foreground">
          {dict.cta.replaceAll("{{count}}", String(totalQuestions))}
        </p>
      )}
    </section>
  );
}
