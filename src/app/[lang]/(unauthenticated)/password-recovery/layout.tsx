import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang === "pt" ? "pt" : "en");
  const canonical = `${getSiteUrl()}/${lang}/password-recovery`;
  return {
    title: dict.metadata.passwordRecovery.title,
    description: dict.metadata.passwordRecovery.description,
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export default function PasswordRecoveryLayout({ children }: Props) {
  return children;
}
