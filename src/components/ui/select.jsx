import { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Ctx = createContext(null);

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </Ctx.Provider>
  );
}
export function SelectTrigger({ className, children }) {
  const { open, setOpen } = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 text-sm",
        className
      )}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
    </button>
  );
}
export function SelectValue({ placeholder }) {
  const { value } = useContext(Ctx);
  return <span className="truncate">{value || <span className="text-muted-foreground">{placeholder}</span>}</span>;
}
export function SelectContent({ className, children }) {
  const { open } = useContext(Ctx);
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg overflow-y-auto", className)}>
      {children}
    </div>
  );
}
export function SelectItem({ value, children }) {
  const { onValueChange, setOpen } = useContext(Ctx);
  return (
    <div
      role="option"
      onClick={() => { onValueChange?.(value); setOpen(false); }}
      className="px-3 py-2 text-sm cursor-pointer hover-elevate"
    >
      {children}
    </div>
  );
}
