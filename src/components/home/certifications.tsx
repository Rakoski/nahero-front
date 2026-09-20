import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

interface CertificationsProps {
  dict: {
    eyebrow: string;
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
    <section className="border-b border-border py-20 sm:py-24">
      <div className="container mx-auto px-4 lg:pl-14 xl:pl-20">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title_start}
          highlight={dict.title_highlight}
          subtitle={dict.subtitle}
        />

        <div className="mt-12 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {dict.items.map((item, index) => {
            const isAvailable = item.status === "available";
            return (
              <FadeIn key={item.name} delay={index * 0.05}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-5">
                  <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.provider}
                  </span>
                  <span className="flex-1 text-sm font-medium">{item.name}</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
                      isAvailable
                        ? "border-brand/30 bg-brand/10 text-brand"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isAvailable ? "bg-brand" : "bg-muted-foreground/50",
                      )}
                    />
                    {isAvailable ? dict.available_label : dict.soon_label}
                  </span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
