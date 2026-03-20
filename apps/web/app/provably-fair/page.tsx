import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function ProvablyFairPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Cryptographic verification"
        title="Provably Fair"
        subtitle="Verify case, battle, and roulette outcomes with exact deterministic formulas."
        action={<button className="btn-ghost">View Seed History</button>}
      />
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <section className="panel p-6">
          <form className="grid gap-4 md:grid-cols-2">
            <input className="glass-input" placeholder="Server seed" />
            <input className="glass-input" placeholder="Client seed / EOS hash" />
            <input className="glass-input" placeholder="Nonce / round number" />
            <input className="glass-input" placeholder="Battle ID / seat index" />
            <input className="glass-input md:col-span-2" placeholder="Case definition snapshot hash" />
            <button className="btn-primary md:col-span-2">Verify Outcome</button>
          </form>
        </section>

        <aside className="panel p-6">
          <h3 className="text-base font-semibold text-white">Verification Result</h3>
          <div className="mt-4 rounded-xl border border-graphite/80 bg-panel2/70 p-4 text-sm text-silver">
            <p className="table-header mb-2">Derived Output</p>
            <p>Ticket: 92817</p>
            <p>Hash: 0x31a4...8f2a</p>
            <p>Mapped item: AWP | Fade</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-silver">
            <li>• Matches stored immutable fairness record</li>
            <li>• Inputs are deterministic and replay-safe</li>
            <li>• No client-side RNG used</li>
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
