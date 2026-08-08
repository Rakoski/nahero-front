import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { Routes } from "@/routes/routes";

interface Props extends VariantProps<typeof buttonVariants> {
  lang: "en" | "pt";
  label: string;
  className?: string;
}

export function BackToPracticeExamsButton({
  lang,
  label,
  variant = "ghost",
  size,
  className,
}: Props) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={`/${lang}${Routes.PracticeExams}`}>
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
