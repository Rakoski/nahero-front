import { getDictionary } from "@/dictionaries";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { CTA } from "@/components/home/cta";
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
        ? "NaHero | Simulados Gratuitos AWS, Azure & Google Cloud"
        : "NaHero | Free AWS, Azure & Google Cloud Practice Exams",
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

      <CTA dict={dict.cta} lang={lang} />
    </main>
  );
}
