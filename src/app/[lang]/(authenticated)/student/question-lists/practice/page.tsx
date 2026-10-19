"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InlineError, PremiumBanner } from "@/components/shared";
import { PracticeQuestionCard } from "@/components/feedback/practice-question-card";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useQuestionBankQuestion } from "@/hooks/useQuestionBank";
import { useAnswerStudyQuestion } from "@/hooks/useAnswerStudyQuestion";
import { isPaymentRequiredError } from "@/utils/paywall-utils";
import type { Dictionary } from "@/dictionaries";

type QuestionBankDict = Dictionary["questionBank"];

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function QuestionListPracticePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <PracticeRunner />
    </Suspense>
  );
}

function PracticeStep({
  questionId,
  listId,
  dict,
  onAnswered,
}: {
  questionId: number;
  listId: number | null;
  dict: QuestionBankDict;
  onAnswered: (correct: boolean) => void;
}) {
  const { dict: dictionary } = useLocale();
  const { data: question, isLoading, error } = useQuestionBankQuestion(questionId);
  const { mutation, error: answerError } = useAnswerStudyQuestion(listId, onAnswered);

  if (isLoading) return <Spinner />;

  if (isPaymentRequiredError(error)) {
    return <PremiumBanner dict={dictionary.shared.premiumBanner.questionBank} from="question-lists" />;
  }

  if (error || !question) {
    return (
      <div className="space-y-2 rounded-lg border p-6 text-center">
        <InlineError error={error} />
        {!error && <p className="text-sm text-muted-foreground">{dict.drawer.loadError}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {question.practiceExam.title}
        {question.domain && ` · ${question.domain.name}`}
      </p>
      <PracticeQuestionCard question={question} dict={dict.drawer} mutation={mutation} />
      <InlineError error={answerError} />
    </div>
  );
}

function PracticeRunner() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.questionBank;
  const searchParams = useSearchParams();

  const questionIds = useMemo(() => {
    const ids = (searchParams.get("ids") ?? "")
      .split(",")
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0);
    return [...new Set(ids)];
  }, [searchParams]);
  const listParam = Number(searchParams.get("list"));
  const listId = Number.isInteger(listParam) && listParam > 0 ? listParam : null;

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(0);

  const backHref = `/${lang}${Routes.QuestionLists}${listId !== null ? `/${listId}` : ""}`;
  const backLabel = listId !== null ? dict.practice.back : dict.practice.backToLists;
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const score = dict.practice.score.replace("{{correct}}", String(correct)).replace("{{answered}}", String(answered));

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href={backHref}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLabel}
      </Link>
    </Button>
  );

  if (questionIds.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl space-y-4 px-4 py-8">
        {backLink}
        <p className="rounded-lg border p-6 text-center text-muted-foreground">{dict.practice.empty}</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
        {backLink}
        <div className="space-y-4 rounded-lg border p-8 text-center">
          <Trophy className="mx-auto h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">{dict.practice.done}</h1>
          <p className="text-lg text-muted-foreground">{score}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setResults({});
                setIndex(0);
                setFinished(false);
                setRound((current) => current + 1);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {dict.practice.restart}
            </Button>
            <Button asChild>
              <Link href={backHref}>{backLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const questionId = questionIds[index];
  const isLast = index === questionIds.length - 1;

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      {backLink}
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold">{dict.practice.title}</h1>
          <span className="text-sm text-muted-foreground">{score}</span>
        </div>
        <Progress value={((index + 1) / questionIds.length) * 100} />
        <p className="text-sm text-muted-foreground">
          {dict.practice.progress
            .replace("{{current}}", String(index + 1))
            .replace("{{total}}", String(questionIds.length))}
        </p>
      </div>

      <PracticeStep
        key={`${round}-${questionId}`}
        questionId={questionId}
        listId={listId}
        dict={dict}
        onAnswered={(isCorrect) => setResults((current) => ({ ...current, [questionId]: isCorrect }))}
      />

      <div className="flex justify-between gap-4">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {dict.practice.previous}
        </Button>
        {isLast ? (
          <Button onClick={() => setFinished(true)}>{dict.practice.finish}</Button>
        ) : (
          <Button onClick={() => setIndex(index + 1)}>
            {dict.practice.next}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
