import { AdminPageShell } from "../../../components/admin/admin-page-shell";

export default function AdminBattlesPage() {
  return (
    <AdminPageShell
      title="Battle Settings"
      description="Configure mode availability, limits, and EOS integration health."
      action={<button className="btn-secondary">Reload EOS Status</button>}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <h3 className="text-base font-semibold text-white">Enabled Modes</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Standard", "Crazy", "Jackpot", "Terminal", "Crazy Jackpot"].map((mode) => (
              <span key={mode} className="chip">
                {mode}
              </span>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="text-base font-semibold text-white">EOS Integration</h3>
          <p className="mt-2 text-sm text-silver">Provider latency: 123ms • Last success: 7s ago</p>
        </div>
      </div>
    </AdminPageShell>
  );
}
