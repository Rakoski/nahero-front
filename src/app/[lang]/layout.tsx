import { Providers } from "@/components/providers";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";
import { getDictionary } from "@/dictionaries"; // <--- Import this
import { Metadata } from "next";
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "pt" }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const dict = await getDictionary(lang);
  return {
    title:
      lang === "pt"
        ? "NaHero | Simulados Gratuitos AWS, Azure & Google Cloud"
        : "NaHero | Free AWS, Azure & Google Cloud Practice Exams",
    description: dict?.hero.description,
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  const dict = await getDictionary(lang as "en" | "pt");

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="bg-stone-950 text-stone-50 antialiased flex flex-col min-h-screen">
        <Providers>
          <Header dict={dict} lang={lang} />

          <main className="flex-1">{children}</main>

          <Footer dict={dict} lang={lang} />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
