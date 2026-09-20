import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "./section-heading";

interface HowItWorksProps {
  dict: {
    eyebrow: string;
    title_start: string;
    title_highlight: string;
    subtitle: string;
    steps: readonly {
      title: string;
      description: string;
    }[];
  };
}

export function HowItWorks({ dict }: HowItWorksProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <div className="container mx-auto px-4 lg:pl-14 xl:pl-20">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title_start}
          highlight={dict.title_highlight}
          subtitle={dict.subtitle}
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {dict.steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.05} className="h-full">
              <div className="flex h-full flex-col bg-background p-6">
                <span className="font-mono text-xs tabular-nums text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
