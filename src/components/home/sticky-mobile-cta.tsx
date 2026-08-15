import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Routes } from "@/routes/routes";

type StickyMobileCtaDict = {
  text: string;
  aria: string;
};

interface StickyMobileCtaProps {
  lang: string;
  dict: StickyMobileCtaDict;
}

export function StickyMobileCta({ lang, dict }: StickyMobileCtaProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/10 bg-stone-950/95 backdrop-blur px-4 py-3 supports-backdrop-filter:bg-stone-950/80">
      <Link
        href={`/${lang}${Routes.Register}`}
        aria-label={dict.aria}
        className="flex items-center justify-center gap-2 w-full rounded-md bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 transition-colors active:scale-[0.98]"
      >
        {dict.text}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Link>
    </div>
  );
}
