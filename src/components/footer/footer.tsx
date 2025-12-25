import Link from "next/link";

interface FooterProps {
  lang: string;
  dict: any;
}

export function Footer({ dict, lang }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10 bg-stone-900/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* NaHero Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold text-yellow-500">NaHero</h3>
            <p className="text-sm text-stone-400 max-w-xs">
              {dict.footer?.description ||
                "Free practice exam platform for all students preparing for certifications."}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              © 2025 NaHero. All rights reserved.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-stone-200">
              {dict.footer?.quick_links || "Quick Links"}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href={`/${lang}/exams`}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.footer?.practice_exams || "Practice Exams"}
              </Link>
              <Link
                href={`/${lang}/certifications`}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.footer?.certifications || "Certifications"}
              </Link>
              <Link
                href={`/${lang}/`}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.footer?.how_it_works || "How it works"}
              </Link>
            </nav>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-stone-200">
              {dict.footer?.resources || "Resources"}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href={`/${lang}/faq`}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.footer?.faq || "FAQ"}
              </Link>
              <Link
                href={`/${lang}/support`}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.footer?.support || "Support"}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="text-sm text-stone-400 hover:text-yellow-500 transition-colors"
              >
                {dict.footer?.contact || "Contact"}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
