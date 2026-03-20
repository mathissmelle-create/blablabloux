import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function InventoryPage() {
  return (
    <PageShell>
      <SectionHeader
        title="Inventory"
        subtitle="Owned, sold, and withdrawn items with withdrawable-state transparency."
      />
      <div className="panel p-4 text-sm text-silver">No items yet. Open a case to get started.</div>
    </PageShell>
  );
}
