import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";
import { DataRow, Surface } from "../../components/ui/design-system";

export default function SeedsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Fairness controls"
        title="Seed Management"
        subtitle="Rotate server seeds and manage client seed preferences."
        action={<button className="btn-primary">Rotate Server Seed</button>}
      />
      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <section className="panel p-4">
          <h3 className="text-sm font-semibold text-white">Current Pair</h3>
          <div className="mt-2 space-y-2">
            <DataRow left="Server seed hash" right="347b5c0f...fdb2f827d0" />
            <DataRow left="Client seed" right="prime-user-seed-v2" />
            <DataRow left="Current nonce" right="219" />
          </div>
        </section>

        <aside className="space-y-3">
          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Reveal History</h3>
            <div className="mt-2 space-y-2 text-sm text-silver">
            {["Rotation #43 • 20 Mar 2026", "Rotation #42 • 19 Mar 2026", "Rotation #41 • 18 Mar 2026"].map((row) => (
              <div key={row} className="rounded-[9px] border border-graphite/80 bg-panel2/70 px-3 py-2">
                {row}
              </div>
            ))}
            </div>
          </Surface>
          <Surface className="p-4">
            <button className="btn-secondary w-full">Rotate server seed</button>
            <button className="btn-ghost mt-2 w-full">Edit client seed</button>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}
