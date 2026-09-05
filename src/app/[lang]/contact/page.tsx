import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { resolveLocale } from "@/lib/locale";
import { OG_IMAGE } from "@/lib/og-image";

const SUPPORT_EMAIL = "support@nahero.site";

type Props = {
  params: Promise<{ lang: "en" | "pt" }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const canonical = `${getSiteUrl()}/${lang}/contact`;
  return {
    title: dict.metadata.contact.title,
    description: dict.metadata.contact.description,
    alternates: { canonical },
    openGraph: {
      title: dict.metadata.contact.title,
      description: dict.metadata.contact.description,
      url: canonical,
      images: [OG_IMAGE],
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-2xl px-4">
        <Breadcrumbs
          lang={lang}
          items={[{ label: dict.contact.title }]}
          dict={dict.breadcrumbs}
        />
        <div className="mt-6 text-center">
          <FadeIn>
            <h1 className="text-4xl font-bold md:text-5xl">
              {dict.contact.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              {dict.contact.subtitle}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="mt-12 border-border">
              <CardContent className="flex flex-col items-center gap-4 p-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-600/10 text-yellow-600">
                  <Mail className="h-7 w-7" />
                </span>
                <p className="text-sm text-muted-foreground">
                  {dict.contact.email_label}
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-2xl font-semibold text-yellow-600 transition-colors hover:text-yellow-500"
                >
                  {SUPPORT_EMAIL}
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  {dict.contact.response_note}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
