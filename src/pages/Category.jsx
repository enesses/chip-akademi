import { useParams } from "wouter";
import ChipCard from "@/components/ChipCard";
import { chipsByCategory } from "@/data/chips";
import { categoryLabels } from "@/lib/utils";

export default function Category() {
  const { cat } = useParams();
  const list = chipsByCategory(cat);
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">{categoryLabels[cat] || cat}</h1>
      <p className="text-muted-foreground mb-8">{list.length} chip</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((c) => <ChipCard key={c.id} chip={c} />)}
      </div>
    </div>
  );
}
