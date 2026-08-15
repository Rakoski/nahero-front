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
