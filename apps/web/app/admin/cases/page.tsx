import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { DataRow, Surface } from "../../../components/ui/design-system";

export default function AdminCasesPage() {
  return (
    <AdminPageShell
      title="Case Creator"
      description="Create/edit case versions, configure weighted pools, and validate probability sums."
      action={<button className="btn-primary">Create New Case</button>}
    >
      <div className="grid gap-2 xl:grid-cols-[1.3fr_1fr]">
        <section className="panel p-4">
          <p className="table-header">Weighted item pool editor</p>
          <div className="mt-2 space-y-2 text-sm text-silver">
            {["AK-47 | Gold Arabesque", "AWP | Fade", "M4A1-S | Printstream"].map((item) => (
              <DataRow key={item} left={item} right="Weight 2.5%" />
            ))}
          </div>
        </section>
        <Surface className="p-4">
          <p className="table-header">Validation</p>
          <div className="mt-2 space-y-2">
            <DataRow left="Total probability" right="100%" />
            <DataRow left="Expected return" right="95.82%" />
            <DataRow left="Gold spin eligible" right="3 items" />
          </div>
        </Surface>
      </div>
    </AdminPageShell>
  );
}
