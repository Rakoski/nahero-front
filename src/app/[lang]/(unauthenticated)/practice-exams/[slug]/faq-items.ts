import type { Dictionary } from "@/dictionaries";
import type { PracticeExamBySlugDTO } from "@/lib/dtos";

export type FaqItem = { question: string; answer: string };

const fill = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
    template,
  );

/**
 * Every practice exam is free and unlimited at every level, so the answers no
 * longer branch on difficulty. Premium buys the explanations, the history and
 * the dashboard, which is what the answers point at instead.
 */
export function buildFaqItems(
  exam: PracticeExamBySlugDTO,
  dict: Dictionary["practiceExamDetail"]["faq"],
): FaqItem[] {
  const questions = exam.numberOfQuestions;

  const items: FaqItem[] = [
    {
      question: fill(dict.free_question, { title: exam.title }),
      answer: dict.free_answer,
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
      answer: dict.retake_answer,
    },
    {
      question: dict.real_questions_question,
      answer: dict.real_questions_answer,
    },
  );

  return items;
}
