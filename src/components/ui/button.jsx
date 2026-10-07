import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-primary-foreground hover-elevate",
  outline: "border border-border bg-card hover-elevate",
  ghost: "hover-elevate",
  destructive: "bg-red-500/90 text-white hover-elevate",
};
const sizes = { default: "h-10 px-4 text-sm", sm: "h-8 px-3 text-xs", lg: "h-12 px-6 text-[15px] rounded-lg" };

export const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all active-elevate-2 disabled:opacity-50 disabled:pointer-events-none",
      variants[variant], sizes[size], className
    )}
    {...props}
  />
));
Button.displayName = "Button";
