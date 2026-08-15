import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "pt" }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.history.title,
    description: dict.metadata.history.description,
    robots: { index: false, follow: false },
  };
}

export default function HistoryLayout({ children }: Props) {
  return children;
}
