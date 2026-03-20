import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function SeedsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Fairness controls"
        title="Seed Management"
        subtitle="Rotate server seeds and manage client seed preferences."
        action={<button className="btn-primary">Rotate Server Seed</button>}
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="panel p-6">
          <h3 className="text-base font-semibold text-white">Current Pair</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-graphite/80 bg-panel2/70 p-4">
              <p className="table-header">Server seed hash</p>
              <p className="mt-2 truncate text-sm text-white">347b5c0f...fdb2f827d0</p>
            </div>
            <div className="rounded-xl border border-graphite/80 bg-panel2/70 p-4">
              <p className="table-header">Client seed</p>
              <p className="mt-2 text-sm text-white">prime-user-seed-v2</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-graphite/80 bg-panel2/70 p-4">
            <p className="table-header">Nonce progress</p>
            <p className="mt-2 text-sm text-silver">Current nonce: 219</p>
          </div>
        </section>

        <aside className="panel p-6">
          <h3 className="text-base font-semibold text-white">Reveal History</h3>
          <div className="mt-3 space-y-2 text-sm text-silver">
            {["Rotation #43 • 20 Mar 2026", "Rotation #42 • 19 Mar 2026", "Rotation #41 • 18 Mar 2026"].map((row) => (
              <div key={row} className="rounded-lg border border-graphite/80 bg-panel2/70 px-3 py-2">
                {row}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
