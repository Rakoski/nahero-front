import { headers } from "next/headers";
import { getDictionary } from "@/dictionaries";
import { BackToPracticeExamsButton } from "@/components/practice-exams/components/back-to-practice-exams-button";

export default async function PracticeExamNotFound() {
  const hdrs = await headers();
  const pathname = hdrs.get("x-invoke-path") ?? hdrs.get("referer") ?? "";
  const lang: "en" | "pt" = pathname.includes("/pt/") ? "pt" : "en";

  const dictionary = await getDictionary(lang);
  const dict = dictionary.practiceExamDetail.not_found;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-6">
      <h1 className="text-3xl font-bold">{dict.title}</h1>
      <p className="text-muted-foreground">{dict.description}</p>
      <BackToPracticeExamsButton lang={lang} label={dict.back} variant="default" />
    </div>
  );
}
