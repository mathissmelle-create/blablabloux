import { AdminPageShell } from "../../../components/admin/admin-page-shell";

export default function AdminRolesPage() {
  return (
    <AdminPageShell
      title="Role Management"
      description="Manage role-permission mappings and access boundaries."
      action={<button className="btn-primary">Create Role</button>}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {["super_admin", "admin", "moderator", "support", "user"].map((role) => (
          <article key={role} className="panel p-4">
            <h3 className="text-base font-semibold text-white">{role}</h3>
            <p className="mt-2 text-sm text-silver">Assigned permissions: 12</p>
          </article>
        ))}
      </div>
    </AdminPageShell>
  );
}
