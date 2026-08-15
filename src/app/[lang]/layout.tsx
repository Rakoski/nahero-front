import { Providers } from "@/components/providers";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";
import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "pt");
  const siteUrl = getSiteUrl();
  const title =
    lang === "pt"
      ? "NaHero | Simulados Gratuitos AWS, Azure & Google Cloud"
      : "NaHero | Free AWS, Azure & Google Cloud Practice Exams";
  const description = dict?.hero.description;
  const canonical = `${siteUrl}/${lang}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: lang === "pt" ? "%s | NaHero" : "%s | NaHero",
    },
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en`,
        pt: `${siteUrl}/pt`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "NaHero",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "NaHero — Free cloud certification practice exams",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  const dict = await getDictionary(lang as "en" | "pt");

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="bg-stone-950 text-stone-50 antialiased flex flex-col min-h-screen">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <Providers>
          <Header dict={dict.header} lang={lang} />

          <main className="flex-1">{children}</main>

          <Footer dict={dict.footer} lang={lang} />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
