import { PageShell } from "../../components/layout/page-shell";
import { Roulette3DStage } from "../../components/animations/roulette-3d-stage";
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
          <Roulette3DStage />
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
