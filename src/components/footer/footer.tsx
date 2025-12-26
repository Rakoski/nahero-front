import Link from "next/link";

type FooterDict = {
  description: string;
  quick_links: string;
  practice_exams: string;
  certifications: string;
  how_it_works: string;
  resources: string;
  faq: string;
  support: string;
  contact: string;
};

interface FooterProps {
  lang: string;
  dict: FooterDict;
}

const buildPath = (lang: string, route: string) => {
  return `/${lang}${route}`.replace(/\/+/g, "/");
};

export function Footer({ dict, lang }: FooterProps) {
  return (
    <footer className=" w-full border-t border-white/10 bg-stone-900/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col gap-3 md:items-center md:text-center">
            <h3 className="text-xl font-bold text-yellow-500">NaHero</h3>
            <p className="text-sm text-stone-400 max-w-xs">
              {dict.description}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              © 2025 NaHero. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-center md:text-center">
            <h3 className="text-lg font-semibold text-stone-200">
              {dict.quick_links}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href={buildPath(lang, "/exams")}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.practice_exams}
              </Link>
              <Link
                href={buildPath(lang, "/certifications")}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.certifications}
              </Link>
              <Link
                href={buildPath(lang, "/")}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.how_it_works}
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3 md:items-center md:text-center">
            <h3 className="text-lg font-semibold text-stone-200">
              {dict.resources}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href={buildPath(lang, "/faq")}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.faq}
              </Link>
              <Link
                href={buildPath(lang, "/support")}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.support}
              </Link>
              <Link
                href={buildPath(lang, "/contact")}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.contact}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
