import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { ClickCard } from "../../../components/ui/design-system";

export default function AdminRolesPage() {
  return (
    <AdminPageShell
      title="Role Management"
      description="Manage role-permission mappings and access boundaries."
      action={<button className="btn-primary">Create Role</button>}
    >
      <div className="grid gap-2 lg:grid-cols-2">
        {["super_admin", "admin", "moderator", "support", "user"].map((role) => (
          <ClickCard key={role}>
            <article className="panel p-3">
              <h3 className="text-base font-semibold text-white">{role}</h3>
              <p className="mt-1 text-sm text-silver">Assigned permissions: 12</p>
            </article>
          </ClickCard>
        ))}
      </div>
    </AdminPageShell>
  );
}
