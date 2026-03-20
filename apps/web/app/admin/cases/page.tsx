import { AdminPageShell } from "../../../components/admin/admin-page-shell";

export default function AdminCasesPage() {
  return (
    <AdminPageShell
      title="Case Creator"
      description="Create/edit case versions, configure weighted pools, and validate probability sums."
      action={<button className="btn-primary">Create New Case</button>}
    >
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <section className="panel p-5">
          <p className="table-header">Weighted item pool editor</p>
          <div className="mt-3 space-y-2 text-sm text-silver">
            {["AK-47 | Gold Arabesque", "AWP | Fade", "M4A1-S | Printstream"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-graphite/70 bg-panel2/70 px-3 py-2">
                <span>{item}</span>
                <span>Weight 2.5%</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="panel p-5">
          <p className="table-header">Validation</p>
          <ul className="mt-3 space-y-2 text-sm text-silver">
            <li>Total probability: 100%</li>
            <li>Expected return: 95.82%</li>
            <li>Gold spin eligible: 3 items</li>
          </ul>
        </aside>
      </div>
    </AdminPageShell>
  );
}
