import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps extends VariantProps<typeof buttonVariants> {
  href: string;
  label: string;
  className?: string;
}

export function BackButton({
  href,
  label,
  variant = "outline",
  size,
  className,
}: BackButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
    >
      <Link href={href}>
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
