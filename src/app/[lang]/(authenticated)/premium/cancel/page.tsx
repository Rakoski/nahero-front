"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Routes } from "@/routes/routes";
import { resolveLocale } from "@/lib/locale";

type CancelDict = {
  title: string;
  subtitle: string;
  cta_retry: string;
  cta_exams: string;
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default function PremiumCancelPage({ params }: Props) {
  const [dict, setDict] = useState<CancelDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");

  useEffect(() => {
    params.then(async (p) => {
      setLang(resolveLocale(p.lang));
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(resolveLocale(p.lang));
      setDict(dictionary.premium.cancel as unknown as CancelDict);
    });
  }, [params]);

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <XCircle className="w-14 h-14 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">{dict.title}</CardTitle>
          <CardDescription>{dict.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 items-center">
          <Button asChild size="lg" className="w-full max-w-xs">
            <Link href={`/${lang}${Routes.Premium}`}>{dict.cta_retry}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full max-w-xs">
            <Link href={`/${lang}${Routes.PracticeExams}`}>
              {dict.cta_exams}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
