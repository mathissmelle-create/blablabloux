import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <article key={idx} className="panel-elevated p-4">
            <div className="h-32 rounded-xl border border-graphite/70 bg-black/25" />
            <h3 className="mt-3 text-sm font-semibold text-white">Skin Item #{idx + 1}</h3>
            <p className="text-xs text-silver">Classified • Factory New</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-accent">${(29 + idx * 7).toFixed(2)}</span>
              <span className="chip">{idx % 3 === 0 ? "Withdrawable" : "Locked"}</span>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
