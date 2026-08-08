import { FadeIn } from "@/components/ui/fade-in";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQProps {
  dict: {
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
    <section id="faq" className="scroll-mt-24 py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            {dict.title_start}{" "}
            <span className="text-yellow-600">{dict.title_highlight}</span>
          </h2>
        </FadeIn>

        <FadeIn>
          <Accordion type="single" collapsible className="w-full">
            {dict.items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
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
