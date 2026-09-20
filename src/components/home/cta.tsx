import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";

interface CTAProps {
  dict: {
    title: string;
    description: string;
    btn: string;
    note: string;
  };
  lang: "en" | "pt";
}

export function CTA({ dict, lang }: CTAProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 lg:pl-14 xl:pl-20">
        <FadeIn>
          <div className="relative overflow-hidden rounded-xl border border-border px-6 py-16 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-grid-sm [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-full h-64 w-[40rem] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[100px]"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {dict.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
                {dict.description}
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 bg-brand font-medium text-brand-foreground hover:bg-brand/90"
              >
                <Link href={`/${lang}${Routes.Register}`}>
                  {dict.btn}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">{dict.note}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
