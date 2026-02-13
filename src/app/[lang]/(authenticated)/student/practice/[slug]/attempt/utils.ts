/**
 * Types for exam attempt functionality
 */

export interface Question {
  id: number;
  text: string;
  type: "single" | "multiple";
  options: QuestionOption[];
  correctAnswers: number[];
  explanation?: string;
}

export interface QuestionOption {
  id: number;
  text: string;
}

export interface ExamAttempt {
  id: number;
  examId: number;
  examTitle: string;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
  startedAt: Date;
}

export interface Answer {
  questionId: number;
  selectedOptions: number[];
}

export type QuestionStatus = "answered" | "unanswered" | "current";

export function getQuestionStatus(
  questionId: number,
  currentQuestionId: number,
  answers: Answer[]
): QuestionStatus {
  if (questionId === currentQuestionId) {
    return "current";
  }

  const answer = answers.find((a) => a.questionId === questionId);
  return answer && answer.selectedOptions.length > 0
    ? "answered"
    : "unanswered";
}

export function isOptionSelected(
  questionId: number,
  optionId: number,
  answers: Answer[]
): boolean {
  const answer = answers.find((a) => a.questionId === questionId);
  return answer ? answer.selectedOptions.includes(optionId) : false;
}

export function toggleOption(
  questionId: number,
  optionId: number,
  isSingleChoice: boolean,
  answers: Answer[]
): Answer[] {
  const existingAnswerIndex = answers.findIndex(
    (a) => a.questionId === questionId
  );

  if (existingAnswerIndex === -1) {
    return [
      ...answers,
      {
        questionId,
        selectedOptions: [optionId],
      },
    ];
  }

  const existingAnswer = answers[existingAnswerIndex];
  let newSelectedOptions: number[];

  if (isSingleChoice) {
    newSelectedOptions = [optionId];
  } else {
    if (existingAnswer.selectedOptions.includes(optionId)) {
      newSelectedOptions = existingAnswer.selectedOptions.filter(
        (id) => id !== optionId
      );
    } else {
      newSelectedOptions = [...existingAnswer.selectedOptions, optionId];
    }
  }

  const newAnswers = [...answers];
  newAnswers[existingAnswerIndex] = {
    ...existingAnswer,
    selectedOptions: newSelectedOptions,
  };

  return newAnswers;
}

export function calculateRemainingTime(
  startedAt: Date,
  timeLimitMinutes: number
): number {
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
  const totalSeconds = timeLimitMinutes * 60;
  const remaining = totalSeconds - elapsed;
  return Math.max(0, remaining);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatTimeLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function getQuestionStats(
  totalQuestions: number,
  answers: Answer[]
): { answered: number; unanswered: number } {
  const answered = answers.filter((a) => a.selectedOptions.length > 0).length;
  return {
    answered,
    unanswered: totalQuestions - answered,
  };
}

export function getExpectedSelections(question: Question): number {
  return question.type === "single" ? 1 : question.correctAnswers.length;
}

export function getSelectionText(
  question: Question,
  dict: {
    single_choice: string;
    multiple_choice: string;
    multiple_choice_many: string;
  }
): string {
  if (question.type === "single") {
    return dict.single_choice;
  }

  const count = question.correctAnswers.length;
  if (count === 2) {
    return dict.multiple_choice;
  }

  return dict.multiple_choice_many.replace("{{count}}", count.toString());
}
