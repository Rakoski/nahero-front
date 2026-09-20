import type { Dictionary } from "@/dictionaries";
import type { PracticeExamBySlugDTO } from "@/lib/dtos";
import { DifficultyLevels } from "@/constants/difficulty-levels";

export type FaqItem = { question: string; answer: string };

const fill = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
    template,
  );

/**
 * The answers have to stay true per exam: foundational exams are unlimited and
 * free, everything above that spends the account's free attempts first.
 */
export function buildFaqItems(
  exam: PracticeExamBySlugDTO,
  dict: Dictionary["practiceExamDetail"]["faq"],
): FaqItem[] {
  const isUnlimited = exam.exam.difficultyLevel <= DifficultyLevels.EASY;
  const questions = exam.numberOfQuestions;

  const items: FaqItem[] = [
    {
      question: fill(dict.free_question, { title: exam.title }),
      answer: isUnlimited
        ? dict.free_answer_unlimited
        : dict.free_answer_limited,
    },
  ];

  if (questions) {
    items.push({
      question: dict.format_question,
      answer: fill(dict.format_answer, {
        questions,
        minutes: exam.timeLimit,
      }),
    });
  }

  items.push(
    {
      question: dict.passing_question,
      answer: fill(dict.passing_answer, { score: exam.passingScore }),
    },
    {
      question: dict.account_question,
      answer: dict.account_answer,
    },
    {
      question: dict.retake_question,
      answer: isUnlimited
        ? dict.retake_answer_unlimited
        : dict.retake_answer_limited,
    },
    {
      question: dict.real_questions_question,
      answer: dict.real_questions_answer,
    },
  );

  return items;
}
