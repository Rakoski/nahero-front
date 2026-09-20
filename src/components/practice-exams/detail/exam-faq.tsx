import { ChevronDown } from "lucide-react";
import type { Dictionary } from "@/dictionaries";
import type { FaqItem } from "@/app/[lang]/(unauthenticated)/practice-exams/[slug]/faq-items";

type Props = {
  items: FaqItem[];
  dict: Dictionary["practiceExamDetail"]["faq"];
};

/**
 * Native <details> rather than the Radix accordion: the answers have to sit in
 * the HTML whether or not anything is expanded.
 */
export function ExamFaq({ items, dict }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-6 border-t pt-8">
      <h2 className="text-2xl font-bold tracking-tight">{dict.heading}</h2>

      <div className="divide-y rounded-lg border">
        {items.map((item) => (
          <details key={item.question} className="group px-4 py-3" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              <h3 className="text-base">{item.question}</h3>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
