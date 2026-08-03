import { FadeIn } from "@/components/ui/fade-in";

interface HowItWorksProps {
  dict: {
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
    <section className="py-24">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            {dict.title_start}{" "}
            <span className="text-yellow-600">{dict.title_highlight}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.subtitle}</p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {dict.steps.map((step, index) => (
            <FadeIn key={index} delay={index * 0.1} className="h-full">
              <div className="h-full rounded-xl border border-border bg-card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600/10 text-xl font-bold text-yellow-600">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
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
