import { PageShell } from "../../../components/layout/page-shell";
import { BattleArenaStage } from "../../../components/animations/battle-arena-stage";
import { SectionHeader } from "../../../components/ui/section-header";
import { DataRow, Surface } from "../../../components/ui/design-system";

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

      <div className="grid gap-3 xl:grid-cols-[1.55fr_0.95fr]">
        <section className="panel-elevated p-4">
          <BattleArenaStage />
        </section>

        <aside className="space-y-3">
          <Surface className="p-4">
            <h2 className="text-base font-semibold text-white">Battle Stats</h2>
            <div className="mt-2 space-y-2">
              <DataRow left="Spectators" right="128" />
              <DataRow left="Mode" right="Crazy Jackpot" />
              <DataRow left="Event version" right="v1" />
              <DataRow left="Sequence" right="52" />
            </div>
          </Surface>

          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Live Events</h3>
            <ul className="mt-2 space-y-2 text-sm text-silver">
              <li className="rounded-[9px] border border-graphite/70 bg-panel2/75 px-3 py-2">Team A opened AK-47 | Asiimov</li>
              <li className="rounded-[9px] border border-graphite/70 bg-panel2/75 px-3 py-2">Gold Spin triggered in Round 2</li>
              <li className="rounded-[9px] border border-graphite/70 bg-panel2/75 px-3 py-2">Team B gained +$349.20 lead</li>
            </ul>
          </Surface>

          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Spectator Chat</h3>
            <div className="mt-2 rounded-[10px] border border-graphite/70 bg-panel2/75 p-3 text-sm text-silver">
              Chat stream placeholder for moderated battle room chat.
            </div>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}
