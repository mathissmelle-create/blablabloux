import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { Surface } from "../../../components/ui/design-system";

export default function AdminContentPage() {
  return (
    <AdminPageShell
      title="Content Management"
      description="Configure homepage banners, featured cases, and campaign blocks."
      action={<button className="btn-primary">Publish Changes</button>}
    >
      <div className="grid gap-2 md:grid-cols-2">
        <Surface className="p-4">
          <h3 className="text-sm font-semibold text-white">Homepage Hero Banner</h3>
          <p className="mt-1.5 text-sm text-silver">Current: "Prime Spring Event - 30% bonus"</p>
        </Surface>
        <Surface className="p-4">
          <h3 className="text-sm font-semibold text-white">Featured Cases</h3>
          <p className="mt-1.5 text-sm text-silver">Crimson Protocol • Golden Rush • Reactor Series</p>
        </Surface>
      </div>
    </AdminPageShell>
  );
}
