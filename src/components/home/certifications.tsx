import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CertificationsProps {
  dict: {
    title_start: string;
    title_highlight: string;
    subtitle: string;
    available_label: string;
    soon_label: string;
    items: readonly {
      provider: string;
      name: string;
      status: string;
    }[];
  };
}

export function Certifications({ dict }: CertificationsProps) {
  return (
    <section className="bg-stone-900 py-24 dark:bg-stone-50">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {dict.title_start}{" "}
            <span className="text-yellow-600">{dict.title_highlight}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.subtitle}</p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.items.map((item, index) => {
            const isAvailable = item.status === "available";
            return (
              <FadeIn key={index} delay={index * 0.1} className="h-full">
                <Card className="h-full border-border bg-stone-950 dark:bg-background">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <span className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                      {item.provider}
                    </span>
                    <h3 className="flex-1 text-lg font-semibold">{item.name}</h3>
                    {isAvailable ? (
                      <Badge className="w-fit bg-green-600 text-white hover:bg-green-600">
                        {dict.available_label}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="w-fit">
                        {dict.soon_label}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
