import { getDictionary } from "@/dictionaries";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: "en" | "pt" }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const dict = await getDictionary(lang);
  return {
    title:
      lang === "pt"
        ? "NaHero | Simulados Gratuitos AWS & Azure"
        : "NaHero | Free AWS & Azure Practice Exams",
    description: dict?.hero.description,
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return (
    <main className="flex flex-col min-h-screen">
      <Hero dict={dict.hero} />

      <Features dict={dict.features} />

      <section className="py-24 px-4 bg-stone-900 text-stone-50 text-center">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-500">
              {dict?.cta.title}
            </h2>
            <p className="text-xl text-stone-300 mb-10">
              {dict?.cta.description}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-yellow-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-500 hover:scale-105 shadow-lg shadow-yellow-900/20"
            >
              {dict?.cta.btn}
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
