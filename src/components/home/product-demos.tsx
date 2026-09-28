import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "./section-heading";
import { DashboardDemo, type DashboardDemoDict } from "./dashboard-demo";
import { PlansDemo, type PlansDemoDict } from "./plans-demo";

interface ProductDemosProps {
  dict: {
    eyebrow: string;
    title_start: string;
    title_highlight: string;
    subtitle: string;
    dashboard: DashboardDemoDict;
    plans: PlansDemoDict;
  };
}

export function ProductDemos({ dict }: ProductDemosProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <div className="container mx-auto px-4 lg:pl-14 xl:pl-20">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title_start}
          highlight={dict.title_highlight}
          subtitle={dict.subtitle}
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-10">
          <FadeIn className="flex flex-col gap-5">
            <div>
              <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                {dict.dashboard.tag}
              </span>
              <h3 className="mt-3 text-xl font-semibold">
                {dict.dashboard.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {dict.dashboard.description}
              </p>
            </div>
            <DashboardDemo dict={dict.dashboard} />
          </FadeIn>

          <FadeIn delay={0.05} className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-semibold">{dict.plans.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {dict.plans.description}
              </p>
            </div>
            <PlansDemo dict={dict.plans} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
