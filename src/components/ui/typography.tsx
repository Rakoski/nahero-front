import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ElementType } from "react";

const typographyStyles = cva("", {
  variants: {
    variant: {
      h1: "text-4xl md:text-6xl font-extrabold tracking-tight",
      h2: "text-3xl md:text-4xl font-bold tracking-tight",
      h3: "text-2xl md:text-3xl font-semibold tracking-tight",
      h4: "text-xl md:text-2xl font-semibold tracking-tight",
      h5: "text-lg md:text-xl font-semibold",
      h6: "text-base md:text-lg font-semibold",
      p: "text-base font-normal leading-relaxed",
      span: "text-sm font-normal",
      blockquote: "text-lg italic border-l-4 pl-4",
      div: "text-xl text-muted-foreground",
      strong: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      em: "text-sm text-muted-foreground",
    },
    font: {
      sans: "font-sans",
      mono: "font-mono",
    },
    styling: {
      default: "text-foreground",
      title: "text-foreground font-bold",
      gradient:
        "text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-yellow-500 font-bold",
      subtitle: "text-muted-foreground",
      paragraph: "text-foreground",
      emphasis: "text-foreground font-bold",
      muted: "text-muted-foreground",
      accent: "text-yellow-600",
    },
  },
  defaultVariants: {
    variant: "p",
    font: "sans",
    styling: "default",
  },
});

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyStyles> {}

const Typography = ({
  variant,
  font,
  styling,
  className,
  ...props
}: TypographyProps) => {
  const Component: ElementType = variant || "p";
  return (
    <Component
      className={cn(typographyStyles({ variant, font, styling }), className)}
      {...props}
    />
  );
};

export { Typography, typographyStyles };
export type { TypographyProps };
