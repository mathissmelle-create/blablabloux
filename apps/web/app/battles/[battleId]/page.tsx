import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeader } from "../../../components/ui/section-header";

export default async function BattleRoomPage({
  params,
}: {
  params: Promise<{ battleId: string }>;
}) {
  const { battleId } = await params;

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Battle room"
        title={`Battle Room ${battleId}`}
        subtitle="Round timeline, synced reels, spectators, and deterministic winner reveal."
        action={<button className="btn-secondary">Join as Spectator</button>}
      />

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="panel-elevated p-5">
          <h2 className="text-lg font-semibold text-white">Round Timeline</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border border-graphite/70 bg-panel2/75 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-silver">Round {idx + 1}</p>
                <p className="mt-1 text-sm text-white">{idx < 2 ? "Resolved" : "Pending"}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-graphite/70 bg-black/25 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              {["Team A", "Team B"].map((team) => (
                <div key={team} className="rounded-xl border border-graphite/70 bg-panel2/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-silver">{team}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-20 rounded-lg border border-graphite/70 bg-black/30" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-white">Battle Stats</h2>
            <ul className="mt-3 space-y-2 text-sm text-silver">
              <li>Spectators: 128</li>
              <li>Mode: Crazy Jackpot</li>
              <li>Event version: 1</li>
              <li>Sequence: 52</li>
            </ul>
          </div>

          <div className="panel p-5">
            <h3 className="text-base font-semibold text-white">Live Events</h3>
            <ul className="mt-3 space-y-2 text-sm text-silver">
              <li>• Team A opened AK-47 | Asiimov</li>
              <li>• Gold Spin triggered in Round 2</li>
              <li>• Team B gained +$349.20 lead</li>
            </ul>
          </div>

          <div className="panel p-5">
            <h3 className="text-base font-semibold text-white">Spectator Chat</h3>
            <div className="mt-3 rounded-xl border border-graphite/70 bg-panel2/75 p-3 text-sm text-silver">
              Chat stream placeholder for moderated battle room chat.
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
