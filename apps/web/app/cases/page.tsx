import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";
import { TiltCard } from "../../components/ui/tilt-card";
import { ClickCard, Surface } from "../../components/ui/design-system";

const caseCards = [
  { name: "Crimson Protocol", rarity: "Legendary", price: "$9.90", gradient: "from-red-500/30 to-orange-500/20" },
  { name: "Carbon Reactor", rarity: "Covert", price: "$5.25", gradient: "from-slate-300/20 to-cyan-400/20" },
  { name: "Golden Rush", rarity: "Mythic", price: "$12.50", gradient: "from-amber-400/35 to-yellow-200/20" },
  { name: "Overpass Nights", rarity: "Classified", price: "$2.40", gradient: "from-indigo-500/30 to-blue-400/20" },
  { name: "Factory Elite", rarity: "Restricted", price: "$1.80", gradient: "from-violet-500/30 to-fuchsia-500/20" },
  { name: "Dustline Relics", rarity: "Industrial", price: "$0.95", gradient: "from-stone-300/20 to-slate-500/20" },
];

export default function CasesPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Case opening"
        title="Cases"
        subtitle="Browse active cases with transparent odds, versioned pools, and gold spin configuration."
        action={<button className="btn-secondary">Featured Cases</button>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Budget", "Premium", "Gold Spin", "Limited"].map((filter) => (
          <button key={filter} className={filter === "All" ? "btn-secondary" : "btn-ghost"}>
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {caseCards.map((caseCard) => (
          <TiltCard key={caseCard.name} className="h-full">
            <ClickCard className="h-full">
              <article className="panel-elevated h-full overflow-hidden p-3.5">
                <div className={`h-36 rounded-[12px] border border-graphite/70 bg-gradient-to-br ${caseCard.gradient}`} />
                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{caseCard.name}</h3>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-silver">{caseCard.rarity}</p>
                  </div>
                  <span className="rounded-[8px] border border-accent/30 bg-accent/10 px-2 py-1 text-sm text-accent">{caseCard.price}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-xs text-silver">
                  <div className="rounded-[8px] border border-graphite/80 bg-panel2/70 py-2">
                    <p className="text-[10px] uppercase">RTP</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">95.8%</p>
                  </div>
                  <div className="rounded-[8px] border border-graphite/80 bg-panel2/70 py-2">
                    <p className="text-[10px] uppercase">Items</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">18</p>
                  </div>
                  <div className="rounded-[8px] border border-graphite/80 bg-panel2/70 py-2">
                    <p className="text-[10px] uppercase">Gold</p>
                    <p className="mt-0.5 text-sm font-semibold text-accent">ON</p>
                  </div>
                </div>
                <button className="btn-primary mt-3 w-full">Open Preview</button>
              </article>
            </ClickCard>
          </TiltCard>
        ))}
      </div>

      <Surface className="mt-4 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Case Curation Notes</h3>
          <span className="chip">version snapshots enabled</span>
        </div>
        <p className="text-sm text-silver">
          Pools are immutable per version to keep all historical openings verifiable. Gold-spin eligibility is validated per case and
          surfaced before publish.
        </p>
      </Surface>
    </PageShell>
  );
}
