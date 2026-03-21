import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { DataRow, Surface } from "../../../components/ui/design-system";

export default function AdminRoulettePage() {
  return (
    <AdminPageShell
      title="Roulette Settings"
      description="Manage round interval, segment distribution, and payout profiles."
      action={<button className="btn-primary">Save Configuration</button>}
    >
      <Surface className="p-4">
        <div className="grid gap-2 md:grid-cols-3">
          <DataRow left="Round duration" right="20s" />
          <DataRow left="Lock window" right="2s" />
          <DataRow left="Segments" right="15" />
        </div>
      </Surface>
    </AdminPageShell>
  );
}
