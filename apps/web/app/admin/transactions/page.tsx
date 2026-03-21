import { AdminPageShell } from "../../../components/admin/admin-page-shell";
import { Surface } from "../../../components/ui/design-system";

export default function AdminTransactionsPage() {
  return (
    <AdminPageShell
      title="Transactions"
      description="Ledger and transaction explorer with manual adjustment audit trail."
      action={<button className="btn-primary">Manual Adjustment</button>}
    >
      <Surface className="p-4">
        <div className="grid grid-cols-5 gap-2 border-b border-graphite/70 pb-2 table-header">
          <span>ID</span>
          <span>User</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="mt-2 space-y-1.5 text-sm text-silver">
          {([
            ["tx_1003", "PrimeUser", "CASE_OPEN", "-$5.20", "completed"],
            ["tx_1002", "PrimeUser", "ROULETTE_PAYOUT", "+$28.00", "completed"],
            ["tx_1001", "ShadowCase", "MANUAL_ADJUSTMENT", "+$50.00", "completed"],
          ] as const).map(([id, user, type, amount, status]) => (
            <div key={id} className="grid grid-cols-5 gap-2 rounded-[9px] border border-graphite/70 bg-panel2/70 px-3 py-2">
              <span>{id}</span>
              <span>{user}</span>
              <span>{type}</span>
              <span className={amount.startsWith("+") ? "text-success" : "text-danger"}>{amount}</span>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </Surface>
    </AdminPageShell>
  );
}
