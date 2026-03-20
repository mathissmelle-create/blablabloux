import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function ProvablyFairPage() {
  return (
    <PageShell>
      <SectionHeader
        title="Provably Fair"
        subtitle="Verify case, battle, and roulette outcomes with exact deterministic formulas."
      />
      <div className="panel p-6">
        <form className="grid gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-graphite bg-black/30 px-3 py-2" placeholder="Server seed" />
          <input className="rounded-lg border border-graphite bg-black/30 px-3 py-2" placeholder="Client seed" />
          <input className="rounded-lg border border-graphite bg-black/30 px-3 py-2" placeholder="Nonce / round" />
          <input className="rounded-lg border border-graphite bg-black/30 px-3 py-2" placeholder="Battle ID / user seat" />
          <button className="rounded-lg bg-accent px-4 py-2 font-semibold text-black md:col-span-2">Verify Outcome</button>
        </form>
      </div>
    </PageShell>
  );
}
