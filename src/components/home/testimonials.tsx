import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "./section-heading";

interface TestimonialsProps {
  dict: {
    eyebrow: string;
    title_start: string;
    title_highlight: string;
    subtitle: string;
    items: readonly {
      quote: string;
      name: string;
      role: string;
    }[];
  };
}

export function Testimonials({ dict }: TestimonialsProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <div className="container mx-auto px-4 lg:pl-14 xl:pl-20">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title_start}
          highlight={dict.title_highlight}
          subtitle={dict.subtitle}
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {dict.items.map((item, index) => (
            <FadeIn key={item.name} delay={index * 0.05} className="h-full">
              <figure className="flex h-full flex-col bg-background p-6">
                <blockquote className="flex-1 text-sm leading-relaxed text-pretty">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/[0.03] text-xs font-medium text-muted-foreground"
                  >
                    {item.name.charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
