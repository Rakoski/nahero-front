import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";

interface CTAProps {
  dict: {
    title: string;
    description: string;
    btn: string;
  };
  lang: "en" | "pt";
}

export function CTA({ dict, lang }: CTAProps) {
  return (
    <section className="py-24 px-4 text-center">
      <div className="container mx-auto max-w-3xl">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-500 dark:text-yellow-600">
            {dict.title}
          </h2>
          <p className="text-xl text-stone-300 dark:text-stone-600 mb-10">
            {dict.description}
          </p>
          <Link
            href={`/${lang}/register`}
            className="inline-flex items-center justify-center rounded-lg bg-yellow-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-500 hover:scale-105 shadow-lg shadow-yellow-900/20"
          >
            {dict.btn}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
