import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";
import { ClickCard } from "../../components/ui/design-system";

export default function InventoryPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Player inventory"
        title="Inventory"
        subtitle="Owned, sold, and withdrawn items with withdrawable-state transparency."
        action={<button className="btn-secondary">Sell Selected</button>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Owned", "Withdrawable", "Locked", "Sold"].map((filter) => (
          <button key={filter} className={filter === "All" ? "btn-secondary" : "btn-ghost"}>
            {filter}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ClickCard key={idx}>
            <article className="panel-elevated p-3">
              <div className="h-28 rounded-[10px] border border-graphite/70 bg-black/25" />
              <h3 className="mt-2 text-sm font-semibold text-white">Skin Item #{idx + 1}</h3>
              <p className="text-[11px] text-silver">Classified • Factory New</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-accent">${(29 + idx * 7).toFixed(2)}</span>
                <span className="chip">{idx % 3 === 0 ? "Withdrawable" : "Locked"}</span>
              </div>
            </article>
          </ClickCard>
        ))}
      </div>
    </PageShell>
  );
}
