import { AdminPageShell } from "../../../components/admin/admin-page-shell";

export default function AdminUsersPage() {
  return (
    <AdminPageShell
      title="User Management"
      description="Search users, inspect sessions, and apply restrictions with audit logs."
      action={<button className="btn-primary">Find User</button>}
    >
      <div className="panel p-5">
        <div className="grid grid-cols-5 gap-2 border-b border-graphite/70 pb-3 table-header">
          <span>User</span>
          <span>Balance</span>
          <span>Risk</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {["PrimeUser", "FragKing", "ShadowCase"].map((user) => (
            <div key={user} className="grid grid-cols-5 gap-2 rounded-xl border border-graphite/70 bg-panel2/70 px-3 py-3 text-silver">
              <span className="text-white">{user}</span>
              <span>$1,294</span>
              <span>Low</span>
              <span className="text-success">Active</span>
              <button className="text-accent">Inspect</button>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
