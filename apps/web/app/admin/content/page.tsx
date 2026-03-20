import { AdminPageShell } from "../../../components/admin/admin-page-shell";

export default function AdminContentPage() {
  return (
    <AdminPageShell
      title="Content Management"
      description="Configure homepage banners, featured cases, and campaign blocks."
      action={<button className="btn-primary">Publish Changes</button>}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <h3 className="text-base font-semibold text-white">Homepage Hero Banner</h3>
          <p className="mt-2 text-sm text-silver">Current: "Prime Spring Event - 30% bonus"</p>
        </div>
        <div className="panel p-5">
          <h3 className="text-base font-semibold text-white">Featured Cases</h3>
          <p className="mt-2 text-sm text-silver">Crimson Protocol • Golden Rush • Reactor Series</p>
        </div>
      </div>
    </AdminPageShell>
  );
}
