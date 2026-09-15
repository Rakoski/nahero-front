"use client";

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
import { useLocale } from "@/providers/locale-provider";

export default function PremiumCancelPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.premium.cancel;

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
