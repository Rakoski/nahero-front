import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "pt" }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const canonical = `${getSiteUrl()}/${lang}/practice-exams`;
  return {
    title: dict.metadata.practiceExams.title,
    description: dict.metadata.practiceExams.description,
    alternates: { canonical },
    openGraph: {
      title: dict.metadata.practiceExams.title,
      description: dict.metadata.practiceExams.description,
      url: canonical,
    },
  };
}

export default function PracticeExamsLayout({ children }: Props) {
  return children;
}
