import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function ProfilePage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Account center"
        title="Profile"
        subtitle="Session history, game history, and account controls."
        action={<button className="btn-secondary">Edit Profile</button>}
      />
      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <section className="panel p-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl border border-accent/40 bg-accent/10" />
            <div>
              <h2 className="text-xl font-semibold text-white">PrimeUser</h2>
              <p className="text-sm text-silver">Level 38 • Joined Dec 2024</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Wins", "482"],
              ["Cases", "2,814"],
              ["Battles", "719"],
              ["Roulette", "1,092"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-graphite/80 bg-panel2/75 p-3 text-center">
                <p className="text-xs uppercase tracking-[0.14em] text-silver">{label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-graphite/80 bg-panel2/75 p-4">
            <p className="table-header">Recent sessions</p>
            <div className="mt-3 space-y-2 text-sm text-silver">
              <div className="flex justify-between rounded-lg border border-graphite/70 bg-black/20 px-3 py-2">
                <span>Desktop • 2 minutes ago</span>
                <span>Paris, FR</span>
              </div>
              <div className="flex justify-between rounded-lg border border-graphite/70 bg-black/20 px-3 py-2">
                <span>Mobile Safari • 1 day ago</span>
                <span>Lyon, FR</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="panel p-5">
            <h3 className="text-base font-semibold text-white">Security Settings</h3>
            <div className="mt-3 space-y-3 text-sm text-silver">
              <div className="flex items-center justify-between rounded-lg border border-graphite/80 bg-panel2/70 px-3 py-2">
                <span>2FA</span>
                <span className="text-accent">Disabled</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-graphite/80 bg-panel2/70 px-3 py-2">
                <span>Email verified</span>
                <span className="text-success">Verified</span>
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <h3 className="text-base font-semibold text-white">Wallet</h3>
            <p className="mt-2 text-sm text-silver">Available: $1,294.20</p>
            <p className="text-sm text-silver">Locked: $0.00</p>
            <button className="btn-primary mt-4 w-full">Deposit</button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
