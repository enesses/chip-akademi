import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm",
      "placeholder:text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
