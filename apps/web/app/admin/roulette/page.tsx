import { AdminPageShell } from "../../../components/admin/admin-page-shell";

export default function AdminRoulettePage() {
  return (
    <AdminPageShell
      title="Roulette Settings"
      description="Manage round interval, segment distribution, and payout profiles."
      action={<button className="btn-primary">Save Configuration</button>}
    >
      <div className="panel p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-graphite/80 bg-panel2/70 p-3">
            <p className="table-header">Round Duration</p>
            <p className="mt-1 text-white">20s</p>
          </div>
          <div className="rounded-xl border border-graphite/80 bg-panel2/70 p-3">
            <p className="table-header">Lock Window</p>
            <p className="mt-1 text-white">2s</p>
          </div>
          <div className="rounded-xl border border-graphite/80 bg-panel2/70 p-3">
            <p className="table-header">Segments</p>
            <p className="mt-1 text-white">15</p>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
