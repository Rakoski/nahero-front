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
    title: dict.metadata.subscription.title,
    description: dict.metadata.subscription.description,
    robots: { index: false, follow: false },
  };
}

export default function SubscriptionLayout({ children }: Props) {
  return children;
}
