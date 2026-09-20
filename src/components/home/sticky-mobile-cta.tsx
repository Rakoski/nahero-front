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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
      <Link
        href={`/${lang}${Routes.Register}`}
        aria-label={dict.aria}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 active:scale-[0.98]"
      >
        {dict.text}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
