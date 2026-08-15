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
  const canonical = `${getSiteUrl()}/${lang}/login`;
  return {
    title: dict.metadata.login.title,
    description: dict.metadata.login.description,
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export default function LoginLayout({ children }: Props) {
  return children;
}
