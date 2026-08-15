import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";
import { FadeIn } from "@/components/ui/fade-in";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Props = {
  params: Promise<{ lang: "en" | "pt" }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const canonical = `${getSiteUrl()}/${lang}/privacy`;
  return {
    title: dict.metadata.privacy.title,
    description: dict.metadata.privacy.description,
    alternates: { canonical },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <Breadcrumbs
          lang={lang}
          items={[{ label: dict.privacy.title }]}
          dict={dict.breadcrumbs}
        />
        <FadeIn>
          <h1 className="mt-6 text-4xl font-bold md:text-5xl">
            {dict.privacy.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {dict.privacy.placeholder}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link
              href={`/${lang}/contact`}
              className="text-yellow-600 hover:text-yellow-500 underline"
            >
              {dict.privacy.contact_link}
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
