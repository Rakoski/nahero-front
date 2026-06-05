"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  QuestionCard,
  QuestionNavigation,
  NavigationButtons,
  SubmitDialog,
  LeaveExamDialog,
} from "@/components/attempt/components";
import {
  Answer,
  toggleOption,
  getQuestionStats,
  calculateRemainingTime,
  formatTime,
  Question,
} from "./utils";
import { Routes } from "@/routes/routes";
import { useAttempt } from "./useAttempt";
import { useLeaveConfirmation } from "@/hooks/useLeaveConfirmation";
import type { ListQuestionsByStudentResponse } from "@/lib/dtos";
import { AxiosError } from "axios";

type ExamAttemptDict = {
  title: string;
  loading: string;
  empty: {
    title: string;
    back: string;
  };
  error: {
    not_enough_questions: string;
    generic: string;
  };
  time_remaining: string;
  question_of: string;
  select_answer: string;
  select_answers: string;
  single_choice: string;
  multiple_choice: string;
  answered: string;
  unanswered: string;
  current: string;
  navigation: {
    previous: string;
    next: string;
    submit: string;
    submitting: string;
  };
  dialogs: {
    time_up: {
      title: string;
      description: string;
      question: string;
      continue: string;
      submit: string;
    };
    confirm_submit: {
      title: string;
      description: string;
      unanswered_warning: string;
      no_answers_error: string;
      cancel: string;
      submit: string;
    };
    confirm_leave: {
      title: string;
      description: string;
      stay: string;
      leave: string;
    };
  };
};

interface Props {
  params: Promise<{ lang: "en" | "pt"; slug: string }>;
}

function mapApiQuestionToQuestion(
  apiQuestion: ListQuestionsByStudentResponse,
  index: number,
  alternatives: { id: number; imageUrl?: string; content: string }[],
): Question {
  return {
    id: parseInt(apiQuestion.id) || index,
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

export default function ExamAttemptPage({ params }: Props) {
  const router = useRouter();
  const [dict, setDict] = useState<ExamAttemptDict | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [startedAt] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);

  const {
    questions: apiQuestions,
    isLoadingQuestions,
    questionsError,
    alternatives,
    isLoadingAlternatives,
    answers: attemptAnswers,
    answersCount,
    updateAnswer,
    finishExam,
    isFinishingExam,
    totalElements,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isFirstPage,
    isLastPage,
  } = useAttempt({
    attemptId: attemptId || "",
    pageSize: 10,
  });

  const timeLimit = apiQuestions[0]?.timeLimit || 3600;

  const isDataReady = !isLoadingQuestions && !!dict && !questionsError;
  const errorStatus =
    questionsError instanceof AxiosError
      ? questionsError.response?.status
      : undefined;

  useEffect(() => {
    params.then((p) => {
      setAttemptId(p.slug);
      setLang(p.lang);
    });
  }, [params]);

  const questions = useMemo(
    () =>
      apiQuestions.map((q, idx) =>
        mapApiQuestionToQuestion(q, idx, alternatives[q.id] || []),
      ),
    [apiQuestions, alternatives],
  );

  useEffect(() => {
    if (isDataReady) {
      const initialTime = calculateRemainingTime(startedAt, timeLimit);
      setTimeRemaining(initialTime);
    }
  }, [isDataReady, startedAt, timeLimit]);

  useEffect(() => {
    if (!isDataReady) return;

    const timer = setInterval(() => {
      const remaining = calculateRemainingTime(startedAt, timeLimit);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isDataReady, startedAt, timeLimit]);

  useEffect(() => {
    params.then(async (p) => {
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.examAttempt);
    });
  }, [params]);

  const currentQuestion = questions[currentQuestionIndex];
  const { unanswered } = getQuestionStats(questions.length, answers);

  const guardEnabled =
    !!dict &&
    !isLoadingQuestions &&
    !isLoadingAlternatives &&
    !isFinishingExam &&
    apiQuestions.length > 0;

  const { isLeaveDialogOpen, confirmLeave, cancelLeave } =
    useLeaveConfirmation(guardEnabled);

  const globalQuestionNumber = currentPage * 10 + currentQuestionIndex + 1;
  const totalQuestionsAcrossPages = totalElements;

  const isOnLastQuestionOfExam =
    isLastPage && currentQuestionIndex === questions.length - 1;
  const isOnFirstQuestionOfExam = isFirstPage && currentQuestionIndex === 0;

  const handleAnswerChange = (questionId: number, optionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const isSingleChoice = question.type === "single";
    const newAnswers = toggleOption(
      questionId,
      optionId,
      isSingleChoice,
      answers,
    );
    setAnswers(newAnswers);

    const answer = newAnswers.find((a) => a.questionId === questionId);
    if (answer) {
      const apiQuestion = apiQuestions.find(
        (q) => parseInt(q.id) === questionId,
      );
      if (apiQuestion) {
        updateAnswer(apiQuestion.id, answer.selectedOptions.map(String));
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentQuestionIndex === 0 && !isFirstPage) {
      goToPreviousPage();
      setCurrentQuestionIndex(9);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === questions.length - 1 && !isLastPage) {
      goToNextPage();
      setCurrentQuestionIndex(0);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleSubmitConfirm = async () => {
    setShowSubmitDialog(false);

    await finishExam();

    router.push(`/${lang}/student/practice/${attemptId}/attempt/results`);
  };

  const handleTimeUp = () => {
    handleSubmitConfirm();
  };

  if (questionsError && dict) {
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

  if (!isDataReady || isLoadingAlternatives || !attemptId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {dict?.loading ?? "Loading..."}
          </p>
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
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
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
        onConfirm={confirmLeave}
        dict={dict.dialogs.confirm_leave}
      />
    </div>
  );
}
