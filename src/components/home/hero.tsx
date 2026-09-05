import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { Routes } from "../../routes/routes";

interface HeroProps {
  lang: "en" | "pt";
  dict: {
    title_start: string;
    title_highlight: string;
    description: string;
    btn_primary: string;
    btn_secondary: string;
    image_alt: string;
  };
}

export function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/certifications2.jpeg"
          alt=""
          role="presentation"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-background/30 z-0" />

      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center z-10">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-12">
              {dict.title_start}{" "}
              <span className="text-yellow-600">{dict.title_highlight}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {dict.description}
            </p>
          </FadeIn>

          <FadeIn
            delay={0.3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
            >
              <Link href={`/${lang}/${Routes.PracticeExams}`}>
                {dict.btn_primary}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-400"
            >
              <Link href={`/${lang}/${Routes.Register}`}>
                {dict.btn_secondary}
              </Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
