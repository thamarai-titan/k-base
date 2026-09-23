import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background font-semibold hover:bg-foreground/90 shadow-sm active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm active:scale-[0.99]",
        outline:
          "border border-border bg-card/80 text-foreground hover:bg-secondary hover:border-border-hover active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 active:scale-[0.99]",
        ghost:
          "text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-[0.99]",
        link: "text-foreground underline-offset-4 hover:underline",
        primary:
          "bg-foreground text-background font-semibold hover:bg-foreground/90 shadow-sm active:scale-[0.99]",
        glow:
          "bg-foreground text-background font-semibold hover:bg-foreground/90 shadow-sm active:scale-[0.99]",
      },
      size: {
        default: "h-8 px-3.5 py-1.5",
        sm: "h-7 rounded-md px-2.5 text-xs",
        lg: "h-9 rounded-md px-5 text-sm",
        icon: "h-8 w-8",
        iconSm: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
