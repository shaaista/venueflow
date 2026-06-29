import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-line-strong bg-panel text-cocoa-muted",
        espresso: "border-espresso-200 bg-espresso-50 text-espresso-600",
        sage: "border-sage-200 bg-sage-50 text-sage-600",
        amber: "border-amber-200 bg-amber-50 text-amber-600",
        success: "border-sage-200 bg-sage-50 text-success",
        warning: "border-amber-200 bg-amber-50 text-warning",
        danger: "border-danger/20 bg-danger/5 text-danger",
        outline: "border-line-strong bg-transparent text-cocoa-faint",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}
