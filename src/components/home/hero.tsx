import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { QuestionDemo, type QuestionDemoDict } from "./question-demo";

interface HeroProps {
  lang: "en" | "pt";
  dict: {
    title_start: string;
    title_highlight: string;
    description: string;
    btn_primary: string;
    btn_secondary: string;
    demo: QuestionDemoDict;
  };
}

export function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[44rem] max-w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.07] blur-[110px]"
      />

      <div className="container relative mx-auto grid items-center gap-14 px-4 py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16 lg:py-28">
        <div className="max-w-xl lg:pl-10 xl:pl-16">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {dict.title_start}{" "}
            <span className="text-brand">{dict.title_highlight}</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-pretty text-muted-foreground">
            {dict.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-brand font-medium text-brand-foreground hover:bg-brand/90"
            >
              <Link href={`/${lang}${Routes.PracticeExams}`}>
                {dict.btn_primary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-medium">
              <Link href={`/${lang}${Routes.Register}`}>
                {dict.btn_secondary}
              </Link>
            </Button>
          </div>
        </div>

        <QuestionDemo dict={dict.demo} />
      </div>
    </section>
  );
}
