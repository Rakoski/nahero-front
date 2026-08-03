import { Quote } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialsProps {
  dict: {
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
    <section className="py-24">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            {dict.title_start}{" "}
            <span className="text-yellow-600">{dict.title_highlight}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.subtitle}</p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {dict.items.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1} className="h-full">
              <Card className="h-full border-border">
                <CardContent className="flex h-full flex-col gap-6 p-8">
                  <Quote className="h-8 w-8 text-yellow-600" />
                  <p className="flex-1 text-lg leading-relaxed">{item.quote}</p>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
