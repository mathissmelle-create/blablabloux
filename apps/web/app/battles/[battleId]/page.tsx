import { PageShell } from "../../../components/layout/page-shell";
import { BattleArenaStage } from "../../../components/animations/battle-arena-stage";
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
          <BattleArenaStage />
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
