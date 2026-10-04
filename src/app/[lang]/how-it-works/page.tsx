import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";
import { FadeIn } from "@/components/ui/fade-in";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveLocale } from "@/lib/locale";
import { OG_IMAGE } from "@/lib/og-image";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);
  const dict = await getDictionary(lang);
  const canonical = `${getSiteUrl()}/${lang}/how-it-works`;
  return {
    title: dict.metadata.howItWorks.title,
    description: dict.metadata.howItWorks.description,
    alternates: { canonical },
    openGraph: {
      title: dict.metadata.howItWorks.title,
      description: dict.metadata.howItWorks.description,
      url: canonical,
      images: [OG_IMAGE],
    },
  };
}

export default async function HowItWorksPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);
  const dict = await getDictionary(lang);
  const page = dict.howItWorksPage;

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <Breadcrumbs lang={lang} items={[{ label: page.title }]} dict={dict.breadcrumbs} />

        <FadeIn>
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-bold md:text-5xl">{page.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{page.subtitle}</p>
          </div>
        </FadeIn>

        <ol className="mt-12 space-y-4">
          {page.steps.map((step, index) => {
            const isPremium = step.plan === "premium";

            return (
              <FadeIn key={step.title} delay={index * 0.05}>
                <li>
                  <Card className={cn(isPremium && "border-yellow-500/40")}>
                    <CardContent className="flex items-start gap-4 p-6">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold",
                          isPremium ? "bg-yellow-500/15 text-yellow-500" : "bg-muted text-foreground",
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold">{step.title}</h2>
                          <Badge
                            variant="outline"
                            className={cn(isPremium && "border-yellow-500/50 text-yellow-500")}
                          >
                            {isPremium ? page.premium_label : page.free_label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              </FadeIn>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={`/${lang}${Routes.PracticeExams}`}>{page.cta_start}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href={`/${lang}${Routes.Premium}`}>{page.cta_plans}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
