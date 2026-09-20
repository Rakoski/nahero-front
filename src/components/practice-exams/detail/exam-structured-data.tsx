import type { Locale } from "@/lib/locale";
import type { PracticeExamBySlugDTO, SampleQuestionDTO } from "@/lib/dtos";
import type { FaqItem } from "@/app/[lang]/(unauthenticated)/practice-exams/[slug]/faq-items";
import { getSiteUrl } from "@/lib/site-url";
import { Routes } from "@/routes/routes";
import { DifficultyLevels } from "@/constants/difficulty-levels";

type Props = {
  exam: PracticeExamBySlugDTO;
  sampleQuestions: SampleQuestionDTO[];
  faqItems: FaqItem[];
  difficultyLabel: string;
  lang: Locale;
};

/** Schema.org takes either shape; a lone answer reads better unwrapped. */
const unwrapSingle = <T,>(values: T[]) =>
  values.length === 1 ? values[0] : values;

const quizFor = (
  exam: PracticeExamBySlugDTO,
  sampleQuestions: SampleQuestionDTO[],
  difficultyLabel: string,
  lang: Locale,
  url: string,
) => ({
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: exam.title,
  url,
  inLanguage: lang === "pt" ? "pt-BR" : "en-US",
  description: exam.description || undefined,
  educationalLevel: difficultyLabel,
  about: { "@type": "Thing", name: exam.exam.title },
  ...(exam.numberOfQuestions
    ? { numberOfQuestions: exam.numberOfQuestions }
    : {}),
  timeRequired: `PT${exam.timeLimit}M`,
  isAccessibleForFree: exam.exam.difficultyLevel <= DifficultyLevels.EASY,
  provider: { "@type": "Organization", name: "NaHero", url: getSiteUrl() },
  hasPart: sampleQuestions.map((question) => {
    const correct = question.alternatives.filter((a) => a.isCorrect);
    const incorrect = question.alternatives.filter((a) => !a.isCorrect);

    return {
      "@type": "Question",
      eduQuestionType: "Multiple choice",
      text: question.content,
      ...(correct.length > 0
        ? {
            acceptedAnswer: unwrapSingle(
              correct.map((alternative) => ({
                "@type": "Answer",
                text: alternative.content,
                explanation: question.explanation,
              })),
            ),
          }
        : {}),
      ...(incorrect.length > 0
        ? {
            suggestedAnswer: incorrect.map((alternative) => ({
              "@type": "Answer",
              text: alternative.content,
            })),
          }
        : {}),
    };
  }),
});

const faqPageFor = (faqItems: FaqItem[], url: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

export function ExamStructuredData({
  exam,
  sampleQuestions,
  faqItems,
  difficultyLabel,
  lang,
}: Props) {
  const url = `${getSiteUrl()}/${lang}${Routes.PracticeExams}/${exam.slug}`;

  const graph = [
    quizFor(exam, sampleQuestions, difficultyLabel, lang, url),
    ...(faqItems.length > 0 ? [faqPageFor(faqItems, url)] : []),
  ];

  return (
    <>
      {graph.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
