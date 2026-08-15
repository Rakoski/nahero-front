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
    title: dict.metadata.premium.title,
    description: dict.metadata.premium.description,
    robots: { index: false, follow: true },
  };
}

export default function PremiumLayout({ children }: Props) {
  return children;
}
