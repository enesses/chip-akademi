import { chips } from "@/data/chips";
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display text-4xl font-bold mb-4">Chip Akademi</h1>
      <p className="text-muted-foreground">{chips.length} chip katalogda hazır. Proje yeniden kuruluyor.</p>
    </div>
  );
}
