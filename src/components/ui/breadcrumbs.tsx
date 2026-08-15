import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsDict = {
  home: string;
  aria: string;
};

interface BreadcrumbsProps {
  lang: string;
  items: BreadcrumbItem[];
  dict: BreadcrumbsDict;
}

export function Breadcrumbs({ lang, items, dict }: BreadcrumbsProps) {
  const siteUrl = getSiteUrl();
  const homeHref = `/${lang}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.home,
        item: `${siteUrl}${homeHref}`,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.label,
        ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <nav
        aria-label={dict.aria}
        className="flex items-center text-sm text-stone-400"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li className="flex items-center">
            <Link
              href={homeHref}
              className="flex items-center gap-1 hover:text-yellow-500 transition-colors"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">{dict.home}</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1">
                <ChevronRight
                  className="h-3.5 w-3.5 text-stone-600"
                  aria-hidden="true"
                />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-yellow-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "text-stone-200 font-medium" : ""}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
