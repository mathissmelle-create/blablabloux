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
        title={`Battle Room ${battleId}`}
        subtitle="Round timeline, synced reels, spectators, and deterministic winner reveal."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-4 lg:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">Round Timeline</h2>
          <div className="h-52 rounded-lg border border-graphite bg-black/20" />
        </section>
        <aside className="panel p-4">
          <h2 className="mb-2 text-lg font-semibold">Battle Stats</h2>
          <ul className="space-y-2 text-sm text-silver">
            <li>Spectators: 0</li>
            <li>Event version: 1</li>
            <li>Sequence: 0</li>
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
