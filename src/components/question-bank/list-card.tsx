"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuestionListSummary } from "@/services/question-lists/list-mine";
import type { Dictionary } from "@/dictionaries";

interface ListCardProps {
  list: QuestionListSummary;
  href: string;
  lang: string;
  dict: Dictionary["questionBank"]["index"];
}

export function ListCard({ list, href, lang, dict }: ListCardProps) {
  const progress = list.questionCount === 0 ? 0 : (list.answeredCount / list.questionCount) * 100;
  const createdAt = new Date(list.createdAt).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US");

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">
          <Link href={href} className="hover:underline">
            {list.name}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {dict.created.replace("{{date}}", createdAt)}
        </CardDescription>
      </CardHeader>

      <CardContent className="grow space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{dict.questions}:</span>
            </div>
            <span className="font-medium text-yellow-400">{list.questionCount}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{dict.answered}:</span>
            </div>
            <span className="font-medium text-yellow-400">
              {list.answeredCount}/{list.questionCount}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </CardContent>

      <CardFooter className="mt-auto gap-2 border-t pt-4">
        <Button asChild variant="outline" className="flex-1">
          <Link href={href}>{dict.open}</Link>
        </Button>
        {list.questionCount > 0 && (
          <Button asChild className="flex-1">
            <Link href={`${href}?practice=1`}>
              <Play className="mr-2 h-4 w-4" />
              {dict.practice}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
