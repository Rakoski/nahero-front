"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  QuestionCard,
  QuestionNavigation,
  NavigationButtons,
  SubmitDialog,
  LeaveExamDialog,
} from "@/components/attempt/components";
import { Answer, formatTime, Question, remainingTimeFromAnchor } from "./utils";
import { Routes } from "@/routes/routes";
import { useAttempt } from "./useAttempt";
import { useLeaveConfirmation } from "@/hooks/useLeaveConfirmation";
import { useRegisterActiveAttempt } from "@/providers/active-attempt-provider";
import type { ListQuestionsByStudentResponse } from "@/lib/dtos";
import { AxiosError } from "axios";
import { useLocale } from "@/providers/locale-provider";

const PAGE_SIZE = 10;

function toQuestionId(
  apiQuestion: ListQuestionsByStudentResponse,
  index: number,
): number {
  return parseInt(apiQuestion.id) || index;
}

function mapApiQuestionToQuestion(
  apiQuestion: ListQuestionsByStudentResponse,
  index: number,
  alternatives: { id: number; imageUrl?: string; content: string }[],
): Question {
  return {
    id: toQuestionId(apiQuestion, index),
    text: apiQuestion.content,
    type: apiQuestion.questionType.id === 3 ? "single" : "multiple",
    options: alternatives.map((alt) => ({
      id: alt.id,
      text: alt.content,
    })),
    correctAnswers: [],
    explanation: undefined,
  };
}

export default function ExamAttemptPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.examAttempt;
  const { slug: attemptId } = useParams<{ slug: string }>();
  const router = useRouter();
  const [questionIndexOverride, setQuestionIndex] = useState<number | null>(
    null,
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [tickedTimeRemaining, setTickedTimeRemaining] = useState<number | null>(
    null,
  );

  const {
    questions: apiQuestions,
    isLoadingQuestions,
    questionsError,
    alternatives,
    isLoadingAlternatives,
    answers: attemptAnswers,
    answersCount,
    toggleAnswer,
    attemptState,
    savePosition,
    finishExam,
    isFinishingExam,
    isExamFinished,
    abandonExam,
    timeOutExam,
    totalElements,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isFirstPage,
    isLastPage,
  } = useAttempt({
    attemptId,
    pageSize: PAGE_SIZE,
  });

  const isDataReady = !isLoadingQuestions && !questionsError;
  const errorStatus =
    questionsError instanceof AxiosError
      ? questionsError.response?.status
      : undefined;

  const questions = useMemo(
    () =>
      apiQuestions.map((q, idx) =>
        mapApiQuestionToQuestion(q, idx, alternatives[q.id] || []),
      ),
    [apiQuestions, alternatives],
  );

  const answers = useMemo<Answer[]>(
    () =>
      apiQuestions
        .map((apiQuestion, idx) => ({
          questionId: toQuestionId(apiQuestion, idx),
          selectedOptions: (attemptAnswers.get(apiQuestion.id) ?? []).map(
            Number,
          ),
        }))
        .filter((answer) => answer.selectedOptions.length > 0),
    [apiQuestions, attemptAnswers],
  );

  const restoredQuestionIndex = attemptState
    ? (attemptState.lastQuestionIndex ?? 0) % PAGE_SIZE
    : 0;

  const questionIndex = questionIndexOverride ?? restoredQuestionIndex;

  const currentQuestionIndex =
    questions.length > 0 ? Math.min(questionIndex, questions.length - 1) : 0;

  const timerAnchor = useMemo(
    () =>
      attemptState
        ? { remaining: attemptState.remainingSeconds, at: Date.now() }
        : null,
    [attemptState],
  );

  const timeRemaining =
    tickedTimeRemaining ?? attemptState?.remainingSeconds ?? 0;

  useEffect(() => {
    if (!isDataReady || !timerAnchor) return;

    const timer = setInterval(() => {
      const remaining = remainingTimeFromAnchor(
        timerAnchor.remaining,
        timerAnchor.at,
      );
      setTickedTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isDataReady, timerAnchor]);

  const currentQuestion = questions[currentQuestionIndex];
  const unanswered = Math.max(0, totalElements - answersCount);

  const guardEnabled =
    !isLoadingQuestions &&
    !isLoadingAlternatives &&
    !isFinishingExam &&
    !isExamFinished &&
    apiQuestions.length > 0;

  const { isLeaveDialogOpen, confirmLeave, cancelLeave, allowNext } =
    useLeaveConfirmation(guardEnabled);

  // Logging out no longer throws the attempt away: it is auto-saved and resumable,
  // so all we have to do is let the navigation guard go.
  const releaseOnLogout = useCallback(async () => {
    allowNext();
  }, [allowNext]);

  useRegisterActiveAttempt(guardEnabled, releaseOnLogout);

  const globalQuestionNumber =
    currentPage * PAGE_SIZE + currentQuestionIndex + 1;

  const lastSavedIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!isDataReady) return;

    const index = globalQuestionNumber - 1;

    if (lastSavedIndex.current === null) {
      lastSavedIndex.current = index;
      return;
    }

    if (lastSavedIndex.current === index) return;
    lastSavedIndex.current = index;

    const timeout = setTimeout(() => savePosition(index), 600);
    return () => clearTimeout(timeout);
  }, [isDataReady, globalQuestionNumber, savePosition]);

  const totalQuestionsAcrossPages = totalElements;

  const isOnLastQuestionOfExam =
    isLastPage && currentQuestionIndex === questions.length - 1;
  const isOnFirstQuestionOfExam = isFirstPage && currentQuestionIndex === 0;

  const handleAnswerChange = (questionId: number, optionId: number) => {
    const index = questions.findIndex((q) => q.id === questionId);
    if (index === -1) return;

    toggleAnswer(
      apiQuestions[index].id,
      String(optionId),
      questions[index].type === "single",
    );
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setQuestionIndex(currentQuestionIndex - 1);
    } else if (currentQuestionIndex === 0 && !isFirstPage) {
      goToPreviousPage();
      setQuestionIndex(PAGE_SIZE - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === questions.length - 1 && !isLastPage) {
      goToNextPage();
      setQuestionIndex(0);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setQuestionIndex(index);
  };

  const handleNextPage = () => {
    goToNextPage();
    setQuestionIndex(0);
  };

  const handlePreviousPage = () => {
    goToPreviousPage();
    setQuestionIndex(0);
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleSubmitConfirm = async () => {
    setShowSubmitDialog(false);

    await finishExam();

    router.push(`/${lang}/student/practice/${attemptId}/attempt/results`);
  };

  const handleTimeUp = async () => {
    await timeOutExam();
    router.push(`/${lang}/student/practice/${attemptId}/attempt/results`);
  };

  const handleKeepAndLeave = () => {
    confirmLeave();
  };

  const handleDiscardAndLeave = async () => {
    try {
      await abandonExam();
    } finally {
      confirmLeave();
    }
  };

  if (questionsError) {
    const message =
      errorStatus === 422
        ? dict.error.not_enough_questions
        : dict.error.generic;

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{message}</p>
          <button
            onClick={() => router.push(Routes.PracticeExams)}
            className="text-primary hover:underline"
          >
            {dict.empty.back}
          </button>
        </div>
      </div>
    );
  }

  if (!isDataReady || isLoadingAlternatives) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{dict.empty.title}</p>
          <button
            onClick={() => router.push(Routes.PracticeExams)}
            className="text-primary hover:underline"
          >
            {dict.empty.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-xl">
      <div className="container mx-auto">
        <div className="mx-auto">
          <QuestionNavigation
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
            totalElements={totalElements}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            dict={{
              ...dict,
              timeRemaining: dict.time_remaining,
            }}
          />

          <div className="px-4 py-8">
            <QuestionCard
              question={currentQuestion}
              questionNumber={globalQuestionNumber}
              totalQuestions={totalQuestionsAcrossPages}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              dict={dict}
            />
          </div>

          <p className="px-4 pb-2 text-center text-sm text-muted-foreground">
            {dict.autosave_hint}
          </p>

          <div className="px-4 pb-8">
            <NavigationButtons
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              isLastQuestion={isOnLastQuestionOfExam}
              isFirstQuestion={isOnFirstQuestionOfExam}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmitClick}
              isSubmitting={isFinishingExam}
              dict={dict.navigation}
            />
          </div>
        </div>
      </div>

      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        onConfirm={handleSubmitConfirm}
        unansweredCount={unanswered}
        totalAnswered={answersCount}
        dict={dict.dialogs.confirm_submit}
      />

      <LeaveExamDialog
        open={isLeaveDialogOpen}
        onOpenChange={(open) => {
          if (!open) cancelLeave();
        }}
        onKeepAndLeave={handleKeepAndLeave}
        onDiscardAndLeave={handleDiscardAndLeave}
        dict={dict.dialogs.confirm_leave}
      />
    </div>
  );
}
