import { Target, Timer, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

interface FeaturesProps {
  dict: {
    title_start: string;
    title_highlight: string;
    items: readonly {
      title: string;
      description: string;
    }[];
  };
}

export function Features({ dict }: FeaturesProps) {
  // Map icons manually since they can't be stored in JSON
  const icons = [Target, Timer, Users];

  return (
    <section className="py-20 bg-stone-900 dark:bg-stone-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {dict.title_start}{" "}
            <span className="text-yellow-600">{dict.title_highlight}</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <FadeIn key={index} delay={index * 0.1} className="h-full">
                <div className="bg-stone-950 dark:bg-background border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="p-3 bg-yellow-900/30 dark:bg-yellow-100 rounded-lg mb-4 w-fit">
                    <Icon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
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
