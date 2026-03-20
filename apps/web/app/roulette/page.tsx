import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function RoulettePage() {
  return (
    <PageShell>
      <SectionHeader
        title="Roulette"
        subtitle="Backend-authoritative countdown, bet lock timing, and deterministic segment resolution."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-4 lg:col-span-2">
          <div className="h-40 rounded-lg border border-graphite bg-black/25" />
        </section>
        <aside className="panel p-4">
          <p className="text-sm text-silver">Current round and recent history stream will render here.</p>
        </aside>
      </div>
    </PageShell>
  );
}
