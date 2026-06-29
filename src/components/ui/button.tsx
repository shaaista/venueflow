import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-lux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso/25 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-espresso-600 text-cream hover:bg-espresso-700 shadow-soft",
        sage: "bg-sage-500 text-cream hover:bg-sage-600 shadow-soft",
        amber: "bg-amber-400 text-cream hover:bg-amber-500 shadow-soft",
        outline:
          "border border-line-strong bg-surface text-cocoa hover:bg-panel hover:border-espresso-300",
        ghost: "text-cocoa-muted hover:text-cocoa hover:bg-espresso-50",
        subtle:
          "bg-panel text-cocoa hover:bg-canvas-deep border border-line",
        danger: "bg-danger text-cream hover:bg-danger/90",
        link: "text-espresso-600 underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
