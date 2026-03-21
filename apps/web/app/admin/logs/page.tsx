import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { Surface } from "../../../components/ui/design-system";

export default function AdminLogsPage() {
  return (
    <AdminPageShell
      title="System Logs"
      description="Audit records, suspicious activity hooks, and operational traces."
      action={<button className="btn-secondary">Download Logs</button>}
    >
      <Surface className="p-4">
        <div className="space-y-1.5 text-sm text-silver">
          {[
            "22:14:02Z  admin.case.version.create  actor=admin_1  status=ok",
            "22:13:18Z  battle.round_resolved  battle=b_224  status=ok",
            "22:12:47Z  auth.refresh  user=u_98  status=ok",
            "22:10:01Z  suspicious.activity.trigger  user=u_412  status=review",
          ].map((line) => (
            <div key={line} className="rounded-[9px] border border-graphite/70 bg-panel2/70 px-3 py-2">
              {line}
            </div>
          ))}
        </div>
      </Surface>
    </AdminPageShell>
  );
}
