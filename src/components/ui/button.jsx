import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-foreground text-background hover:bg-foreground/85",
  accent: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-card-border bg-card text-foreground hover:border-foreground/35",
  ghost: "text-foreground hover:bg-muted",
  destructive: "bg-red-500 text-white hover:bg-red-500/90",
};
const sizes = { default: "h-10 px-4 text-sm", sm: "h-8 px-3 text-xs", lg: "h-11 px-5 text-[15px]" };

export const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors active:translate-y-px disabled:opacity-50 disabled:pointer-events-none",
      variants[variant], sizes[size], className
    )}
    {...props}
  />
));
Button.displayName = "Button";
