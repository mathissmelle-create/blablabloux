import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function ProfilePage() {
  return (
    <PageShell>
      <SectionHeader title="Profile" subtitle="Session history, game history, and account controls." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-4 text-sm text-silver">User stats and level blocks.</div>
        <div className="panel p-4 text-sm text-silver">Security settings and connected sessions.</div>
      </div>
    </PageShell>
  );
}
