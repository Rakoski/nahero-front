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
  const canonical = `${getSiteUrl()}/${lang}/password-recovery/definition`;
  return {
    title: dict.metadata.passwordRecoveryDefinition.title,
    description: dict.metadata.passwordRecoveryDefinition.description,
    alternates: { canonical },
    robots: { index: false, follow: false },
  };
}

export default function PasswordRecoveryDefinitionLayout({ children }: Props) {
  return children;
}
