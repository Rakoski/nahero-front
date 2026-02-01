"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  QuestionCard,
  QuestionNavigation,
  NavigationButtons,
  SubmitDialog,
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
import type { ListQuestionsByStudentResponse } from "@/lib/dtos";

type ExamAttemptDict = {
  title: string;
  time_remaining: string;
  question_of: string;
  select_answer: string;
  select_answers: string;
  single_choice: string;
  multiple_choice: string;
  multiple_choice_many: string;
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
      cancel: string;
      submit: string;
    };
  };
};

interface Props {
  params: Promise<{ lang: "en" | "pt"; slug: string }>;
}

function mapApiQuestionToQuestion(
  apiQuestion: ListQuestionsByStudentResponse,
  index: number,
  alternatives: { id: number; imageUrl?: string; content: string }[]
): Question {
  return {
    id: parseInt(apiQuestion.id) || index,
    text: apiQuestion.content,
    type: apiQuestion.questionType.id === 1 ? "single" : "multiple",
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [startedAt] = useState(new Date());

  useEffect(() => {
    params.then((p) => {
      setAttemptId(p.slug);
    });
  }, [params]);

  const {
    questions: apiQuestions,
    isLoadingQuestions,
    alternatives,
    isLoadingAlternatives,
    answers: attemptAnswers,
    updateAnswer,
    finishExam,
    isFinishingExam,
    finishExamResult,
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

  const questions = useMemo(
    () =>
      apiQuestions.map((q, idx) =>
        mapApiQuestionToQuestion(q, idx, alternatives[q.id] || [])
      ),
    [apiQuestions, alternatives]
  );

  const timeLimit = apiQuestions[0]?.timeLimit || 3600;

  const [timeRemaining, setTimeRemaining] = useState(
    calculateRemainingTime(startedAt, timeLimit)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateRemainingTime(startedAt, timeLimit);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt, timeLimit]);

  useEffect(() => {
    params.then(async (p) => {
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.examAttempt);
    });
  }, [params]);

  const currentQuestion = questions[currentQuestionIndex];
  const { unanswered } = getQuestionStats(questions.length, answers);

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
      answers
    );
    setAnswers(newAnswers);

    // Update the answers in the hook (convert to string for API)
    const answer = newAnswers.find((a) => a.questionId === questionId);
    if (answer) {
      const apiQuestion = apiQuestions.find(
        (q) => parseInt(q.id) === questionId
      );
      if (apiQuestion) {
        updateAnswer(
          apiQuestion.id, // Use original string ID from API
          answer.selectedOptions.map(String) // Convert to string array
        );
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

    const result = await finishExam();

    if (result) router.push(`${Routes.PracticeExams}/${attemptId}/results`);
  };

  const handleTimeUp = () => {
    handleSubmitConfirm();
  };

  if (!dict || isLoadingQuestions || isLoadingAlternatives || !attemptId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">
            No questions found for this exam.
          </p>
          <button
            onClick={() => router.push(Routes.PracticeExams)}
            className="text-primary hover:underline"
          >
            Return to practice exams
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
        dict={dict.dialogs.confirm_submit}
      />
    </div>
  );
}
