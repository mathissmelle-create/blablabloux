import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";
import { DataRow, Surface } from "../../components/ui/design-system";

export default function ProvablyFairPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Cryptographic verification"
        title="Provably Fair"
        subtitle="Verify case, battle, and roulette outcomes with exact deterministic formulas."
        action={<button className="btn-ghost">View Seed History</button>}
      />
      <div className="grid gap-3 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="panel p-4">
          <form className="grid gap-3 md:grid-cols-2">
            <input className="glass-input" placeholder="Server seed" />
            <input className="glass-input" placeholder="Client seed / EOS hash" />
            <input className="glass-input" placeholder="Nonce / round number" />
            <input className="glass-input" placeholder="Battle ID / seat index" />
            <input className="glass-input md:col-span-2" placeholder="Case definition snapshot hash" />
            <button className="btn-primary md:col-span-2">Verify Outcome</button>
          </form>
        </section>

        <aside className="space-y-3">
          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Verification Result</h3>
            <div className="mt-2 space-y-2 text-sm text-silver">
              <DataRow left="Ticket" right="92817" />
              <DataRow left="Hash" right="0x31a4...8f2a" />
              <DataRow left="Mapped item" right="AWP | Fade" />
            </div>
          </Surface>
          <Surface className="p-4">
            <ul className="space-y-2 text-sm text-silver">
            <li>• Matches stored immutable fairness record</li>
            <li>• Inputs are deterministic and replay-safe</li>
            <li>• No client-side RNG used</li>
            </ul>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}
