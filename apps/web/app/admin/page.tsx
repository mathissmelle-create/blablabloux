import { AdminPageShell } from "../../components/admin/admin-page-shell";

export default function AdminDashboardPage() {
  return (
    <AdminPageShell
      title="Admin Dashboard"
      description="Operational metrics, fairness health, and incident indicators."
      action={<button className="btn-primary">Open Incident Center</button>}
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Concurrent Users", "9,284"],
          ["Pending Withdrawals", "17"],
          ["Failed EOS Fetches", "0"],
          ["Suspicious Events", "3"],
        ].map(([label, value]) => (
          <article key={label} className="panel p-4">
            <p className="table-header">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          </article>
        ))}
      </section>
    </AdminPageShell>
  );
}
