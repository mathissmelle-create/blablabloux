import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";
import { DataRow, MetricTile, Surface } from "../../components/ui/design-system";

export default function ProfilePage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Account center"
        title="Profile"
        subtitle="Session history, game history, and account controls."
        action={<button className="btn-secondary">Edit Profile</button>}
      />
      <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr]">
        <section className="panel p-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-[12px] border border-accent/40 bg-accent/10" />
            <div>
              <h2 className="text-xl font-semibold text-white">PrimeUser</h2>
              <p className="text-sm text-silver">Level 38 • Joined Dec 2024</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              ["Wins", "482"],
              ["Cases", "2,814"],
              ["Battles", "719"],
              ["Roulette", "1,092"],
            ].map(([label, value]) => (
              <MetricTile key={label} label={label} value={value} />
            ))}
          </div>

          <div className="mt-4 rounded-[10px] border border-graphite/80 bg-panel2/75 p-3">
            <p className="table-header">Recent sessions</p>
            <div className="mt-2 space-y-2 text-sm text-silver">
              <DataRow left="Desktop • 2 minutes ago" right="Paris, FR" />
              <DataRow left="Mobile Safari • 1 day ago" right="Lyon, FR" />
            </div>
          </div>
        </section>

        <aside className="space-y-3">
          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Security Settings</h3>
            <div className="mt-2 space-y-2 text-sm text-silver">
              <DataRow left="2FA" right={<span className="text-accent">Disabled</span>} />
              <DataRow left="Email verified" right={<span className="text-success">Verified</span>} />
            </div>
          </Surface>

          <Surface className="p-4">
            <h3 className="text-sm font-semibold text-white">Wallet</h3>
            <div className="mt-2 space-y-2">
              <DataRow left="Available" right="$1,294.20" />
              <DataRow left="Locked" right="$0.00" />
            </div>
            <button className="btn-primary mt-3 w-full">Deposit</button>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}
