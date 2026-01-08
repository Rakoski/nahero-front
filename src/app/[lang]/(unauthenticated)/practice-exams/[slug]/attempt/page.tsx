"use client";

import { useState, useEffect } from "react";
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
} from "./utils";
import { MOCK_EXAM_ATTEMPT } from "./mock-data";
import { Routes } from "@/routes/routes";

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
  params: Promise<{ lang: "en" | "pt"; id: string }>;
}

export default function ExamAttemptPage({ params }: Props) {
  const router = useRouter();
  const [dict, setDict] = useState<ExamAttemptDict | null>(null);
  const [examAttempt] = useState(MOCK_EXAM_ATTEMPT);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    calculateRemainingTime(examAttempt.startedAt, examAttempt.timeLimit)
  );

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateRemainingTime(
        examAttempt.startedAt,
        examAttempt.timeLimit
      );
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examAttempt.startedAt, examAttempt.timeLimit]);

  useEffect(() => {
    params.then(async (p) => {
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.examAttempt);
    });
  }, [params]);

  const currentQuestion = examAttempt.questions[currentQuestionIndex];
  const { unanswered } = getQuestionStats(
    examAttempt.questions.length,
    answers
  );

  const handleAnswerChange = (questionId: number, optionId: number) => {
    const question = examAttempt.questions.find((q) => q.id === questionId);
    if (!question) return;

    const newAnswers = toggleOption(
      questionId,
      optionId,
      question.type === "single",
      answers
    );
    setAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < examAttempt.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleSubmitConfirm = async () => {
    try {
      setIsSubmitting(true);
      setShowSubmitDialog(false);

      // TODO: Submit to API
      // await api.post(`/practice-exams/attempts/${examAttempt.id}/submit`, { answers });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to results page
      router.push(`${Routes.PracticeExams}/${examAttempt.examId}/results`);
    } catch (error) {
      console.error("Failed to submit exam:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    handleSubmitConfirm();
  };

  if (!dict) {
    return null;
  }

  return (
    <div className="bg-background text-xl">
      <div className="container mx-auto">
        <div className="mx-auto">
          <QuestionNavigation
            questions={examAttempt.questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
            dict={{
              ...dict,
              timeRemaining: dict.time_remaining,
            }}
          />

          <div className="px-4 py-8">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={examAttempt.questions.length}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              dict={dict}
            />
          </div>

          <div className="px-4 pb-8">
            <NavigationButtons
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={examAttempt.questions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmitClick}
              isSubmitting={isSubmitting}
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
