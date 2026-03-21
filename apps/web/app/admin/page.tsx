import { AdminPageShell } from "../../components/admin/admin-page-shell";
import { MetricTile, Surface } from "../../components/ui/design-system";

export default function AdminDashboardPage() {
  return (
    <AdminPageShell
      title="Admin Dashboard"
      description="Operational metrics, fairness health, and incident indicators."
      action={<button className="btn-primary">Open Incident Center</button>}
    >
      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Concurrent Users", "9,284"],
          ["Pending Withdrawals", "17"],
          ["Failed EOS Fetches", "0"],
          ["Suspicious Events", "3"],
        ].map(([label, value]) => (
          <MetricTile key={label} label={label} value={value} tone={label === "Suspicious Events" ? "danger" : "default"} />
        ))}
      </section>
      <Surface className="p-4">
        <p className="table-header">Incident pulse</p>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <div className="rounded-[9px] border border-graphite/80 bg-panel2/70 px-3 py-2 text-sm text-silver">risk rules: stable</div>
          <div className="rounded-[9px] border border-graphite/80 bg-panel2/70 px-3 py-2 text-sm text-silver">fairness workers: healthy</div>
          <div className="rounded-[9px] border border-graphite/80 bg-panel2/70 px-3 py-2 text-sm text-silver">withdraw queue: normal</div>
        </div>
      </Surface>
    </AdminPageShell>
  );
}
