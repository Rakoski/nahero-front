import { FadeIn } from "@/components/ui/fade-in";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
}: SectionHeadingProps) {
  return (
    <FadeIn className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
        {highlight ? ` ${highlight}` : null}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </FadeIn>
  );
}
