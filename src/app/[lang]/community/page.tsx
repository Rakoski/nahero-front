import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquareHeart } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { getDictionary } from "@/dictionaries";
import { getSiteUrl } from "@/lib/site-url";
import { resolveLocale } from "@/lib/locale";
import { OG_IMAGE } from "@/lib/og-image";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, CREATOR_EMAIL, DISCORD_URL } from "@/constants/contact";
import { Routes } from "@/routes/routes";

type Props = {
  params: Promise<{ lang: string }>;
};

type CommunityLink = {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
  featured?: boolean;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);
  const dict = await getDictionary(lang);
  const canonical = `${getSiteUrl()}/${lang}${Routes.Community}`;
  return {
    title: dict.metadata.community.title,
    description: dict.metadata.community.description,
    alternates: { canonical },
    openGraph: {
      title: dict.metadata.community.title,
      description: dict.metadata.community.description,
      url: canonical,
      images: [OG_IMAGE],
    },
  };
}

function LinkCard({ link }: { link: CommunityLink }) {
  const Icon = link.icon;
  const className = cn(
    "group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.99]",
    link.featured
      ? "border-[#5865F2] bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/20 hover:bg-[#4752C4]"
      : "border-border bg-card hover:border-yellow-600/60 hover:bg-yellow-600/5",
  );

  const content = (
    <>
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          link.featured ? "bg-white/15" : "bg-yellow-600/10 text-yellow-600",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold">{link.label}</span>
        <span
          className={cn(
            "text-sm",
            link.featured ? "text-white/80" : "text-muted-foreground",
          )}
        >
          {link.description}
        </span>
      </span>
      <ArrowUpRight
        className={cn(
          "h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          link.featured ? "text-white/80" : "text-muted-foreground",
        )}
      />
    </>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

export default async function CommunityPage({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = resolveLocale(langParam);
  const dict = await getDictionary(lang);
  const t = dict.community;

  const links: CommunityLink[] = [
    {
      href: DISCORD_URL,
      label: t.discord.label,
      description: t.discord.description,
      icon: SiDiscord,
      external: true,
      featured: true,
    },
    {
      href: `mailto:${CONTACT_EMAIL}`,
      label: t.email.label,
      description: CONTACT_EMAIL,
      icon: Mail,
    },
    {
      href: `mailto:${CREATOR_EMAIL}`,
      label: t.creator.label,
      description: CREATOR_EMAIL,
      icon: MessageSquareHeart,
    },
  ];

  return (
    <section className="bg-black px-4 py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-yellow-600/40 bg-black">
            <Image src="/favicon.ico" width={44} height={44} alt="NaHero logo" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-yellow-500">NaHero</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
        </div>

        <ul className="mt-8 flex w-full flex-col gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <LinkCard link={link} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
