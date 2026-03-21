import { PageShell } from "../../components/layout/page-shell";
import { Roulette3DStage } from "../../components/animations/roulette-3d-stage";
import { SectionHeader } from "../../components/ui/section-header";
import { DataRow, MetricTile, Surface } from "../../components/ui/design-system";

export default function RoulettePage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Live roulette"
        title="Roulette"
        subtitle="Backend-authoritative countdown, bet lock timing, and deterministic segment resolution."
        action={<button className="btn-primary">Place Bet</button>}
      />
      <div className="mb-3 grid gap-2 md:grid-cols-3">
        <MetricTile label="Round #" value="2814" />
        <MetricTile label="Bets this round" value="183" />
        <MetricTile label="Lock-in closes" value="2.3s" tone="accent" />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel-elevated p-4">
          <Roulette3DStage />
        </section>

        <aside className="space-y-3">
          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Round History</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["R", "B", "R", "R", "G", "B", "Gold", "R"].map((entry, idx) => (
                <span
                  key={`${entry}-${idx}`}
                  className="rounded-[7px] border border-graphite/80 bg-panel2/70 px-2 py-1 text-xs text-silver"
                >
                  {entry}
                </span>
              ))}
            </div>
          </Surface>

          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Top Bets</h3>
            <div className="mt-2 space-y-2">
              <DataRow left="Red" right="$1,249" />
              <DataRow left="Black" right="$988" />
              <DataRow left="Gold" right="$412" />
            </div>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}
