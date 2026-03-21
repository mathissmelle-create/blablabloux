import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { Surface } from "../../../components/ui/design-system";

export default function AdminFairnessPage() {
  return (
    <AdminPageShell
      title="Fairness Inspector"
      description="Inspect seed rotations, derivation records, and verification requests."
      action={<button className="btn-secondary">Export Records</button>}
    >
      <Surface className="p-4">
        <div className="grid grid-cols-4 gap-2 border-b border-graphite/70 pb-2 table-header">
          <span>Type</span>
          <span>Reference</span>
          <span>Hash</span>
          <span>Status</span>
        </div>
        <div className="mt-2 space-y-1.5 text-sm text-silver">
          {[
            ["case_open", "open_7217", "0x9f2a...", "verified"],
            ["battle", "battle_220", "0x2bc1...", "verified"],
            ["roulette", "round_2814", "0x89de...", "verified"],
          ].map((row) => (
            <div key={row.join("-")} className="grid grid-cols-4 gap-2 rounded-[9px] border border-graphite/70 bg-panel2/70 px-3 py-2">
              <span>{row[0]}</span>
              <span>{row[1]}</span>
              <span>{row[2]}</span>
              <span className="text-success">{row[3]}</span>
            </div>
          ))}
        </div>
      </Surface>
    </AdminPageShell>
  );
}
