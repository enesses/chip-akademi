import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm transition-colors",
      "placeholder:text-muted-foreground/70 outline-none hover:border-foreground/25 focus-visible:border-primary",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
