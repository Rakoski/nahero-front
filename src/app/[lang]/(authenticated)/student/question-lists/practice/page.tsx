"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineError, PremiumBanner } from "@/components/shared";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { isPaymentRequiredError } from "@/utils/paywall-utils";
import { usePracticeSession } from "./usePracticeSession";
import { PracticeNavigation } from "./practice-navigation";
import { PracticeQuestion } from "./practice-question";

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

  const session = usePracticeSession(questionIds, listId);
  const { index, question, selected, result, finished } = session;

  const backHref = `/${lang}${Routes.QuestionLists}${listId !== null ? `/${listId}` : ""}`;
  const backLabel = listId !== null ? dict.practice.back : dict.practice.backToLists;
  const score = dict.practice.score
    .replace("{{correct}}", String(session.correctCount))
    .replace("{{answered}}", String(session.answeredCount));

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
            <Button variant="outline" onClick={session.restart}>
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

  const isLast = index === questionIds.length - 1;
  const answered = result !== undefined;
  const goNext = () => (isLast ? session.finish() : session.goTo(index + 1));

  const renderQuestion = () => {
    if (question.isLoading) return <Spinner />;

    if (isPaymentRequiredError(question.error)) {
      return <PremiumBanner dict={dictionary.shared.premiumBanner.questionBank} from="question-lists" />;
    }

    if (question.error || !question.data) {
      return (
        <div className="space-y-2 rounded-lg border p-6 text-center">
          <InlineError error={question.error} />
          {!question.error && <p className="text-sm text-muted-foreground">{dict.drawer.loadError}</p>}
        </div>
      );
    }

    return (
      <PracticeQuestion
        question={question.data}
        number={index + 1}
        total={questionIds.length}
        selected={selected}
        result={result}
        dict={dict}
        onToggle={session.toggle}
      />
    );
  };

  return (
    <div className="bg-background text-base md:text-xl">
      <div className="container mx-auto">
        <div className="px-4 pt-4">{backLink}</div>

        <PracticeNavigation
          questionIds={questionIds}
          index={index}
          results={session.results}
          score={score}
          dict={dict}
          onSelect={session.goTo}
        />

        <div className="px-4 py-8">{renderQuestion()}</div>

        <div className="px-4 pb-8">
          <InlineError error={session.answerError} className="mb-4" />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex gap-2 *:flex-1 sm:*:flex-none">
              <Button
                variant="outline"
                className="sm:w-32"
                disabled={index === 0}
                onClick={() => session.goTo(index - 1)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {dict.practice.previous}
              </Button>
              {!answered && (
                <Button variant="outline" className="sm:w-32" onClick={goNext}>
                  {isLast ? dict.practice.finish : dict.practice.next}
                  {!isLast && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>

            {answered ? (
              <Button size="lg" className="w-full sm:w-48" onClick={goNext}>
                {isLast ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {dict.practice.finish}
                  </>
                ) : (
                  <>
                    {dict.practice.next}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full sm:w-48"
                disabled={selected.length === 0 || session.isAnswering || !question.data}
                onClick={session.answer}
              >
                {session.isAnswering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dict.drawer.answer}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
