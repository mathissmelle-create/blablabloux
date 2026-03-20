import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function RoulettePage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Live roulette"
        title="Roulette"
        subtitle="Backend-authoritative countdown, bet lock timing, and deterministic segment resolution."
        action={<button className="btn-primary">Place Bet</button>}
      />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel-elevated p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Round #2815</h2>
            <span className="chip">Lock in 00:14</span>
          </div>

          <div className="rounded-2xl border border-graphite/70 bg-panel2/70 p-5">
            <div className="mx-auto mb-4 flex h-56 w-56 items-center justify-center rounded-full border-8 border-graphite/70 bg-black/30">
              <div className="h-24 w-24 rounded-full border border-accent/40 bg-accent/10" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {["G", "R", "B", "R", "B", "R", "B", "R", "B", "Gold"].map((segment, idx) => (
                <div
                  key={`${segment}-${idx}`}
                  className="rounded-lg border border-graphite/80 bg-black/20 px-2 py-2 text-center text-xs text-silver"
                >
                  {segment}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {["Red 2x", "Black 2x", "Green 14x", "Gold 20x"].map((bet) => (
              <button key={bet} className="btn-ghost">
                {bet}
              </button>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="panel p-5">
            <h3 className="text-base font-semibold text-white">Round History</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["R", "B", "R", "R", "G", "B", "Gold", "R"].map((entry, idx) => (
                <span
                  key={`${entry}-${idx}`}
                  className="rounded-lg border border-graphite/80 bg-panel2/70 px-2 py-1 text-xs text-silver"
                >
                  {entry}
                </span>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <h3 className="text-base font-semibold text-white">Top Bets</h3>
            <div className="mt-3 space-y-2 text-sm text-silver">
              <div className="flex justify-between rounded-lg border border-graphite/80 bg-panel2/70 px-3 py-2">
                <span>Red</span>
                <span>$1,249</span>
              </div>
              <div className="flex justify-between rounded-lg border border-graphite/80 bg-panel2/70 px-3 py-2">
                <span>Black</span>
                <span>$988</span>
              </div>
              <div className="flex justify-between rounded-lg border border-graphite/80 bg-panel2/70 px-3 py-2">
                <span>Gold</span>
                <span>$412</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
