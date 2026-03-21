import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { Surface } from "../../../components/ui/design-system";

export default function AdminUsersPage() {
  return (
    <AdminPageShell
      title="User Management"
      description="Search users, inspect sessions, and apply restrictions with audit logs."
      action={<button className="btn-primary">Find User</button>}
    >
      <Surface className="p-4">
        <div className="grid grid-cols-5 gap-2 border-b border-graphite/70 pb-2 table-header">
          <span>User</span>
          <span>Balance</span>
          <span>Risk</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="mt-2 space-y-1.5 text-sm">
          {["PrimeUser", "FragKing", "ShadowCase"].map((user) => (
            <div key={user} className="grid grid-cols-5 gap-2 rounded-[9px] border border-graphite/70 bg-panel2/70 px-3 py-2.5 text-silver">
              <span className="text-white">{user}</span>
              <span>$1,294</span>
              <span>Low</span>
              <span className="text-success">Active</span>
              <button className="text-accent transition hover:brightness-110">Inspect</button>
            </div>
          ))}
        </div>
      </Surface>
    </AdminPageShell>
  );
}
