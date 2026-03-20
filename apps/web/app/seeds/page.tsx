import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function SeedsPage() {
  return (
    <PageShell>
      <SectionHeader title="Seed Management" subtitle="Rotate server seeds and manage client seed preferences." />
      <div className="panel p-4">
        <p className="text-sm text-silver">Current hash, nonce history, and rotation log will be shown here.</p>
      </div>
    </PageShell>
  );
}
