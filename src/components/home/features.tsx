import { Target, Timer, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "./section-heading";

interface FeaturesProps {
  dict: {
    eyebrow: string;
    title_start: string;
    title_highlight: string;
    items: readonly {
      title: string;
      description: string;
    }[];
  };
}

export function Features({ dict }: FeaturesProps) {
  const icons = [Target, Timer, Users];

  return (
    <section className="border-b border-border py-20 sm:py-24">
      <div className="container mx-auto px-4 lg:pl-14 xl:pl-20">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title_start}
          highlight={dict.title_highlight}
        />

        <div className="mt-12 grid grid-cols-1 divide-y divide-border rounded-xl border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {dict.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <FadeIn key={item.title} delay={index * 0.05} className="h-full">
                <div className="flex h-full flex-col p-8">
                  {Icon ? (
                    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white/[0.04] text-foreground/80">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  ) : null}
                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
