import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "./section-heading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQProps {
  dict: {
    eyebrow: string;
    title_start: string;
    title_highlight: string;
    items: readonly {
      question: string;
      answer: string;
    }[];
  };
}

export function FAQ({ dict }: FAQProps) {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-b border-border py-20 sm:py-24"
    >
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:pl-14 xl:pl-20">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title_start}
          highlight={dict.title_highlight}
        />

        <FadeIn>
          <Accordion type="single" collapsible className="w-full">
            {dict.items.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
