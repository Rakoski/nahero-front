import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";
import { resolveLocale } from "@/lib/locale";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);
  const dict = await getDictionary(lang);
  const canonical = `${getSiteUrl()}/${lang}/register`;
  return {
    title: dict.metadata.register.title,
    description: dict.metadata.register.description,
    alternates: { canonical },
  };
}

export default function RegisterLayout({ children }: Props) {
  return children;
}
