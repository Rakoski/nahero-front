import Link from "next/link";
import { headers } from "next/headers";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { Home, FileQuestion } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export default async function NotFoundPage() {
  // Get the pathname from the header set in Middleware
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Detect language from pathname
  const lang = pathname.startsWith("/pt") ? "pt" : "en";

  const dict = await getDictionary(lang);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <FadeIn className="text-center max-w-2xl">
        <div className="mb-8">
          <Typography
            variant="h1"
            styling="gradient"
            className="text-8xl md:text-9xl mb-4"
          >
            {dict.notFound.code}
          </Typography>
          <Typography variant="h2" className="mb-4">
            {dict.notFound.title}
          </Typography>
          <Typography variant="p" styling="subtitle" className="mb-8">
            {dict.notFound.description}
          </Typography>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
          >
            <Link href={`/${lang}`}>
              <Home className="mr-2 h-5 w-5" />
              {dict.notFound.btn_home}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
          >
            <Link href={`/${lang}/exams`}>
              <FileQuestion className="mr-2 h-5 w-5" />
              {dict.notFound.btn_exams}
            </Link>
          </Button>
        </div>
      </FadeIn>
    </main>
  );
}
