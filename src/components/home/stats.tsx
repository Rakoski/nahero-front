import { FadeIn } from "@/components/ui/fade-in";

interface StatsProps {
  dict: {
    items: readonly {
      value: string;
      label: string;
    }[];
  };
}

export function Stats({ dict }: StatsProps) {
  return (
    <section className="border-y border-border bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {dict.items.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1} className="text-center">
              <p className="text-4xl font-extrabold text-yellow-600 md:text-5xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                {item.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
