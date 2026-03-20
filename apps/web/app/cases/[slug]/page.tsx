import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeader } from "../../../components/ui/section-header";

export default async function SingleCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Case detail"
        title={`Case: ${slug}`}
        subtitle="The reel animation will align with backend-decided item stops and server timestamps."
        action={<button className="btn-primary">Open Case</button>}
      />

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="panel-elevated p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-silver">Live reel simulation</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Authoritative Reel</h2>
            </div>
            <span className="chip">$5.20 / open</span>
          </div>

          <div className="rounded-2xl border border-graphite/80 bg-panel2/70 p-4">
            <div className="mb-3 h-1 w-full rounded-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="h-24 rounded-xl border border-graphite/70 bg-black/25" />
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-graphite/80 bg-panel2/75 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-silver">Server hash</p>
              <p className="mt-1 truncate text-sm text-white">08fd...2aa9</p>
            </div>
            <div className="rounded-xl border border-graphite/80 bg-panel2/75 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-silver">Client seed</p>
              <p className="mt-1 truncate text-sm text-white">player-seed-001</p>
            </div>
            <div className="rounded-xl border border-graphite/80 bg-panel2/75 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-silver">Nonce</p>
              <p className="mt-1 text-sm text-white">128</p>
            </div>
          </div>
        </section>

        <aside className="panel p-6">
          <h3 className="text-lg font-semibold text-white">Item Pool</h3>
          <p className="mt-2 text-sm text-silver">Snapshot-based pool used for deterministic verification.</p>
          <div className="mt-4 space-y-3">
            {["AK-47 | Gold Arabesque", "AWP | Fade", "M4A1-S | Printstream", "USP-S | Kill Confirmed"].map((item) => (
              <div key={item} className="rounded-xl border border-graphite/80 bg-panel2/75 px-3 py-2 text-sm text-silver">
                {item}
              </div>
            ))}
          </div>
          <button className="btn-ghost mt-4 w-full">View Full Probability Table</button>
        </aside>
      </div>
    </PageShell>
  );
}
