import { ExternalLink } from "lucide-react";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";
import type { PracticeExamBySlugDTO } from "@/lib/dtos";
import type { ExamContent } from "@/content/exams/types";

type Props = {
  exam: PracticeExamBySlugDTO;
  content: ExamContent;
  dict: Dictionary["practiceExamDetail"]["about"];
  lang: Locale;
};

export function ExamAbout({ exam, content, dict, lang }: Props) {
  const facts = [
    content.code && { label: dict.exam_code, value: content.code },
  ].filter(Boolean) as { label: string; value: string }[];

  // The code alone is already in the page title, so it does not carry a section
  // on its own. This only renders once there is editorial content behind it.
  if (!content.domains?.length) return null;

  return (
    <section className="space-y-6 border-t pt-8">
      <h2 className="text-2xl font-bold tracking-tight">
        {dict.heading.replaceAll(
          "{{certification}}",
          content.code ?? exam.exam.title,
        )}
      </h2>

      {facts.length > 0 && (
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-lg border p-4">
              <dt className="text-sm text-muted-foreground">{fact.label}</dt>
              <dd className="mt-1 font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{dict.domains_heading}</h3>
        <ul className="space-y-2">
          {content.domains?.map((domain) => (
            <li
              key={domain.name.en}
              className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
            >
              <span>{domain.name[lang]}</span>
              {domain.weight !== undefined && (
                <span className="shrink-0 font-medium text-yellow-500">
                  {domain.weight}%
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {content.officialUrl && (
        <p className="text-sm text-muted-foreground">
          <a
            href={content.officialUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 font-medium text-yellow-600 hover:underline"
          >
            {dict.official_link}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <span className="ml-2">{dict.disclaimer}</span>
        </p>
      )}
    </section>
  );
}
