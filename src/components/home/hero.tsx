import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";

interface HeroProps {
  dict: {
    title_start: string;
    title_highlight: string;
    description: string;
    btn_primary: string;
    btn_secondary: string;
    image_alt: string;
  };
}

export function Hero({ dict }: HeroProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left z-10">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              {dict.title_start}{" "}
              <span className="text-yellow-600">{dict.title_highlight}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0">
              {dict.description}
            </p>
          </FadeIn>

          <FadeIn
            delay={0.3}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
            >
              <Link href="/register">{dict.btn_primary}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
            >
              <Link href="/practice-exams">{dict.btn_secondary}</Link>
            </Button>
          </FadeIn>
        </div>

        <div className="flex-1 relative w-full h-[300px] md:h-[500px]">
          <FadeIn delay={0.4} className="w-full h-full relative">
            <Image
              src="/file.svg" // Added '/' for safety
              alt={dict.image_alt} // Use the dictionary here!
              fill
              className="object-contain"
              priority
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
