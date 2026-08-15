import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";
import { authOptions } from "@/lib/auth";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Certifications } from "@/components/home/certifications";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { StickyMobileCta } from "@/components/home/sticky-mobile-cta";
import { resolveLocale } from "@/lib/locale";

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
  const canonical = `${getSiteUrl()}/${lang}`;
  return {
    title: dict.metadata.home.title,
    description: dict.metadata.home.description,
    alternates: { canonical },
    openGraph: {
      title: dict.metadata.home.title,
      description: dict.metadata.home.description,
      url: canonical,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);

  const dict = await getDictionary(lang);
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user;

  return (
    <main className="flex flex-col min-h-screen">
      <Hero dict={dict.hero} lang={lang} isAuthenticated={isAuthenticated} />

      {!isAuthenticated && <Stats dict={dict.stats} />}

      <Features dict={dict.features} />

      {!isAuthenticated && (
        <>
          <HowItWorks dict={dict.howItWorks} />
          <Certifications dict={dict.certifications} />
          <Testimonials dict={dict.testimonials} />
        </>
      )}

      <FAQ dict={dict.faq} />

      {!isAuthenticated && <CTA dict={dict.cta} lang={lang} />}
      {!isAuthenticated && (
        <StickyMobileCta dict={dict.stickyCta} lang={lang} />
      )}
    </main>
  );
}
