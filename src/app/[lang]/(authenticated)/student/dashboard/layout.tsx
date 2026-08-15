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
    title: dict.metadata.dashboard.title,
    description: dict.metadata.dashboard.description,
    robots: { index: false, follow: false },
  };
}

export default function DashboardLayout({ children }: Props) {
  return children;
}
