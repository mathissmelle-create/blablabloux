import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";
import { DataRow, MetricTile, Surface } from "../../components/ui/design-system";

export default function BattlesPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Multiplayer arena"
        title="Live Battles"
        subtitle="Multiplayer rooms synchronized through authoritative websocket events."
        action={<button className="btn-primary">Create Battle</button>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "1v1", "2v2v2", "3v3", "Crazy", "Jackpot", "Terminal"].map((mode) => (
          <button key={mode} className={mode === "All" ? "btn-secondary" : "btn-ghost"}>
            {mode}
          </button>
        ))}
      </div>

      <div className="mb-3 grid gap-2 md:grid-cols-3">
        <MetricTile label="Open rooms" value="241" />
        <MetricTile label="Active spectators" value="5,184" />
        <MetricTile label="EOS sync health" value="99.98%" tone="success" />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.45fr_1fr]">
        <section className="panel-elevated p-4">
          <div className="grid grid-cols-6 gap-2 border-b border-graphite/60 pb-2 table-header">
            <span>Mode</span>
            <span>Players</span>
            <span>Teams</span>
            <span>Cases</span>
            <span>Status</span>
            <span>Spectators</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {[
              ["Standard", "4/4", "2v2", "4", "Round 3", "98"],
              ["Crazy", "2/2", "1v1", "5", "Countdown", "31"],
              ["Jackpot", "6/6", "2v2v2", "3", "Final", "122"],
            ].map((row) => (
              <div
                key={row.join("-")}
                className="grid grid-cols-6 gap-2 rounded-[9px] border border-graphite/70 bg-panel2/70 px-3 py-2.5 text-sm text-silver transition hover:border-graphite"
              >
                <span className="text-white">{row[0]}</span>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
                <span className="text-accent">{row[4]}</span>
                <span>{row[5]}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-3">
          <Surface className="p-4">
            <h2 className="text-base font-semibold text-white">Featured Battle</h2>
            <p className="mt-1 text-sm text-silver">3v3 Crazy Jackpot • 6 players • prize pool $2,914</p>
            <div className="mt-3 space-y-2">
              {["Alpha", "Falcon", "Wraith"].map((team, idx) => (
                <DataRow key={team} left={`Team ${idx + 1} • ${team}`} right={`$${(850 + idx * 140).toFixed(2)}`} />
              ))}
            </div>
            <button className="btn-primary mt-3 w-full">Spectate battle</button>
          </Surface>
          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Realtime feed</h3>
            <div className="mt-2 space-y-2 text-sm text-silver">
              <div className="rounded-[9px] border border-graphite/80 bg-panel2/70 px-3 py-2">battle_193 round_start seq=84</div>
              <div className="rounded-[9px] border border-graphite/80 bg-panel2/70 px-3 py-2">battle_193 gold_spin_triggered seat=2</div>
              <div className="rounded-[9px] border border-graphite/80 bg-panel2/70 px-3 py-2">battle_193 round_complete winner=team_a</div>
            </div>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}
