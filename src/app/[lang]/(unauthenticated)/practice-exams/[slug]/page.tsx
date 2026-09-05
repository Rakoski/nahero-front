import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Clock,
  Target,
  BookOpen,
  Tag,
  GraduationCap,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { getDictionary } from "@/dictionaries";
import { practiceExamsService } from "@/services/practice-exams";
import { DifficultyLevels } from "@/constants/difficulty-levels";
import { BackToPracticeExamsButton } from "@/components/practice-exams/components/back-to-practice-exams-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  formatTimeLimit,
  getDifficultyColors,
  getDifficultyLabel,
} from "../utils";
import { StartExamButton } from "./start-exam-button";
import { AutoStartOnReturn } from "./auto-start-on-return";
import { OG_IMAGE } from "@/lib/og-image";

interface Props {
  params: Promise<{ lang: "en" | "pt"; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(lang);
  const dict = dictionary.practiceExamDetail;

  const exam = await practiceExamsService.getPracticeExamBySlug(slug);
  if (!exam) return { title: dict.not_found.title };

  const description = dict.meta.description_template
    .replace("{{title}}", exam.title)
    .replace("{{questions}}", String(exam.numberOfQuestions ?? "—"))
    .replace("{{minutes}}", String(exam.timeLimit))
    .replace("{{score}}", String(exam.passingScore));

  return {
    title: exam.title,
    description,
    alternates: {
      canonical: `/${lang}${Routes.PracticeExams}/${exam.slug}`,
      languages: {
        en: `/en${Routes.PracticeExams}/${exam.slug}`,
        pt: `/pt${Routes.PracticeExams}/${exam.slug}`,
      },
    },
    openGraph: {
      title: exam.title,
      description,
      type: "website",
      images: [OG_IMAGE],
    },
  };
}

export default async function PracticeExamDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const exam = await practiceExamsService.getPracticeExamBySlug(slug);

  const dictionary = await getDictionary(lang);
  const dict = dictionary.practiceExamDetail;

  if (!exam) notFound();

  const difficulty = exam.exam.difficultyLevel as DifficultyLevels;
  const difficultyLabel = getDifficultyLabel(
    difficulty,
    dict.difficulty_levels,
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <AutoStartOnReturn practiceExamId={exam.id} lang={lang} />
      <Breadcrumbs
        lang={lang}
        items={[
          {
            label: dictionary.practiceExams.title,
            href: `/${lang}${Routes.PracticeExams}`,
          },
          { label: exam.title },
        ]}
        dict={dictionary.breadcrumbs}
      />
      <BackToPracticeExamsButton lang={lang} label={dict.cta.back} />
      <Badge className={cn("text-sm mb-2", getDifficultyColors(difficulty))}>
        {difficultyLabel}
      </Badge>

      <article className="space-y-6">
        <header className="text-center flex items-start gap-4">
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {exam.title}
            </h1>
            {exam.description && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {exam.description}
              </p>
            )}
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 border-y py-6">
          <Stat
            icon={<Clock className="h-5 w-5" />}
            label={dict.overview.time_limit}
            value={formatTimeLimit(exam.timeLimit)}
          />
          <Stat
            icon={<BookOpen className="h-5 w-5" />}
            label={dict.overview.questions}
            value={
              exam.numberOfQuestions !== null
                ? String(exam.numberOfQuestions)
                : "—"
            }
          />
          <Stat
            icon={<Target className="h-5 w-5" />}
            label={dict.overview.passing_score}
            value={`${exam.passingScore}%`}
          />
          <Stat
            icon={<GraduationCap className="h-5 w-5" />}
            label={dict.overview.difficulty}
            value={difficultyLabel}
          />
          {exam.exam?.title && (
            <Stat
              icon={<Tag className="h-5 w-5" />}
              label={dict.overview.category}
              value={exam.exam.title}
            />
          )}
        </section>

        <div className="flex justify-end">
          <StartExamButton
            practiceExamId={exam.id}
            slug={exam.slug}
            lang={lang}
            dict={dict.cta}
          />
        </div>
      </article>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </div>
  );
}
