import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { Surface } from "../../../components/ui/design-system";

export default function AdminFeatureFlagsPage() {
  return (
    <AdminPageShell
      title="Feature Flags"
      description="Rollout controls for games, events, and UI experiments."
      action={<button className="btn-primary">Create Flag</button>}
    >
      <Surface className="p-4">
        <div className="space-y-1.5 text-sm text-silver">
          {([
            ["gold_spin_v2", "enabled", "100%"],
            ["new_battle_intro", "enabled", "35%"],
            ["roulette_heatmap", "disabled", "0%"],
          ] as const).map(([flag, state, rollout]) => (
            <div key={flag} className="flex items-center justify-between rounded-[9px] border border-graphite/70 bg-panel2/70 px-3 py-2">
              <span>{flag}</span>
              <span className={state === "enabled" ? "text-success" : "text-silver"}>{state}</span>
              <span>{rollout}</span>
            </div>
          ))}
        </div>
      </Surface>
    </AdminPageShell>
  );
}
