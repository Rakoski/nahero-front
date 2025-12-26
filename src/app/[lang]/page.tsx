import { getDictionary } from "@/dictionaries";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { CTA } from "@/components/home/cta";

type Props = {
  params: Promise<{ lang: "en" | "pt" }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return (
    <main className="flex flex-col min-h-screen">
      <Hero dict={dict.hero} lang={lang} />

      <Features dict={dict.features} />

      <CTA dict={dict.cta} lang={lang} />
    </main>
  );
}
