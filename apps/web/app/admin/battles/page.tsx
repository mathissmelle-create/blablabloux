import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { DataRow, Surface } from "../../../components/ui/design-system";

export default function AdminBattlesPage() {
  return (
    <AdminPageShell
      title="Battle Settings"
      description="Configure mode availability, limits, and EOS integration health."
      action={<button className="btn-secondary">Reload EOS Status</button>}
    >
      <div className="grid gap-2 md:grid-cols-2">
        <Surface className="p-4">
          <h3 className="text-sm font-semibold text-white">Enabled Modes</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Standard", "Crazy", "Jackpot", "Terminal", "Crazy Jackpot"].map((mode) => (
              <span key={mode} className="chip">
                {mode}
              </span>
            ))}
          </div>
        </Surface>
        <Surface className="p-4">
          <h3 className="text-sm font-semibold text-white">EOS Integration</h3>
          <div className="mt-2 space-y-2">
            <DataRow left="Provider latency" right="123ms" />
            <DataRow left="Last success" right="7s ago" />
          </div>
        </Surface>
      </div>
    </AdminPageShell>
  );
}
