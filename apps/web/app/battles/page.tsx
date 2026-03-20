import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function BattlesPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Multiplayer arena"
        title="Live Battles"
        subtitle="Multiplayer rooms synchronized through authoritative websocket events."
        action={<button className="btn-primary">Create Battle</button>}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {["All", "1v1", "2v2v2", "3v3", "Crazy", "Jackpot", "Terminal"].map((mode) => (
          <button key={mode} className={mode === "All" ? "btn-secondary" : "btn-ghost"}>
            {mode}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <section className="panel-elevated p-5">
          <div className="grid grid-cols-6 gap-2 border-b border-graphite/60 pb-3 table-header">
            <span>Mode</span>
            <span>Players</span>
            <span>Teams</span>
            <span>Cases</span>
            <span>Status</span>
            <span>Spectators</span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              ["Standard", "4/4", "2v2", "4", "Round 3", "98"],
              ["Crazy", "2/2", "1v1", "5", "Countdown", "31"],
              ["Jackpot", "6/6", "2v2v2", "3", "Final", "122"],
            ].map((row) => (
              <div
                key={row.join("-")}
                className="grid grid-cols-6 gap-2 rounded-xl border border-graphite/70 bg-panel2/70 px-3 py-3 text-sm text-silver"
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

        <aside className="panel p-5">
          <h2 className="text-lg font-semibold text-white">Featured Battle</h2>
          <p className="mt-2 text-sm text-silver">3v3 Crazy Jackpot • 6 players • prize pool $2,914</p>
          <div className="mt-4 space-y-3">
            {["Alpha", "Falcon", "Wraith"].map((team, idx) => (
              <div key={team} className="rounded-xl border border-graphite/80 bg-panel2/75 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-silver">Team {idx + 1}</p>
                <p className="mt-1 text-sm text-white">{team}</p>
                <p className="text-xs text-silver">Total: ${(850 + idx * 140).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <button className="btn-primary mt-4 w-full">Spectate Battle</button>
        </aside>
      </div>
    </PageShell>
  );
}
