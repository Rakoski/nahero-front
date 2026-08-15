import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";
import { resolveLocale } from "@/lib/locale";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);
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
