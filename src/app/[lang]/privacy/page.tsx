import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";
import { FadeIn } from "@/components/ui/fade-in";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { resolveLocale } from "@/lib/locale";
import { CONTACT_EMAIL } from "@/constants/contact";

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
  const canonical = `${getSiteUrl()}/${lang}/privacy`;
  return {
    title: dict.metadata.privacy.title,
    description: dict.metadata.privacy.description,
    alternates: { canonical },
  };
}

function withEmail(text: string) {
  const [before, after] = text.split("{{email}}");
  if (after === undefined) return text;

  return (
    <>
      {before}
      <a href={`mailto:${CONTACT_EMAIL}`} className="text-yellow-600 underline hover:text-yellow-500">
        {CONTACT_EMAIL}
      </a>
      {after}
    </>
  );
}

export default async function PrivacyPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);
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
          <p className="mt-2 text-sm text-muted-foreground">{dict.privacy.updated}</p>
          <p className="mt-6 text-lg text-muted-foreground">{dict.privacy.intro}</p>
        </FadeIn>

        <div className="mt-10 space-y-10">
          {dict.privacy.sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted-foreground">
                  {withEmail(paragraph)}
                </p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.after && (
                <p className="leading-relaxed text-muted-foreground">{section.after}</p>
              )}
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          <Link
            href={`/${lang}/contact`}
            className="text-yellow-600 underline hover:text-yellow-500"
          >
            {dict.privacy.contact_link}
          </Link>
        </p>
      </div>
    </section>
  );
}
