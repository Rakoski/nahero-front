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
    <section className="border-b border-border">
      <div className="container mx-auto px-4 lg:pl-14 xl:pl-20">
        <div className="grid grid-cols-2 divide-x divide-y divide-border border-x border-border sm:divide-y-0 lg:grid-cols-4">
          {dict.items.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.05}>
              <div className="px-6 py-8">
                <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
