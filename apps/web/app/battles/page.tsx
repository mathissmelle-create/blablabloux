import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function BattlesPage() {
  return (
    <PageShell>
      <SectionHeader
        title="Live Battles"
        subtitle="Multiplayer rooms synchronized through authoritative websocket events."
      />
      <div className="panel p-4">
        <div className="grid grid-cols-6 gap-2 text-xs uppercase text-silver">
          <span>Mode</span>
          <span>Players</span>
          <span>Teams</span>
          <span>Cases</span>
          <span>Status</span>
          <span>Spectators</span>
        </div>
        <div className="mt-3 rounded-lg border border-graphite p-3 text-sm">
          No active battles yet. Live feed will appear here.
        </div>
      </div>
    </PageShell>
  );
}
