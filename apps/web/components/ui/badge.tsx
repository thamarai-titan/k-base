import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-border bg-foreground text-background font-semibold",
        secondary:
          "border-border/60 bg-secondary text-secondary-foreground",
        destructive:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400",
        outline: "text-muted-foreground border-border bg-transparent",
        command:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-[#0d1f18] dark:text-emerald-400 font-mono",
        snippet:
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/40 dark:bg-[#0f1b2d] dark:text-blue-400 font-mono",
        note:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-[#211a0d] dark:text-amber-400 font-mono",
        tag:
          "border-border bg-secondary/70 text-muted-foreground hover:text-foreground hover:border-border font-mono cursor-pointer transition-colors",
        violet:
          "border-border bg-secondary text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
