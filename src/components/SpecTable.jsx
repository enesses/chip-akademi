import { formatSpecLabel } from "@/lib/utils";

export default function SpecTable({ specs }) {
  return (
    <div className="rounded-xl border border-card-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(specs).map(([k, v], i) => (
            <tr key={k} className={i % 2 ? "bg-muted/20" : ""}>
              <td className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground whitespace-nowrap">{formatSpecLabel(k)}</td>
              <td className="px-4 py-2.5">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
