import { AdminPageShell } from "../../../components/admin/admin-page-shell";

export default function AdminTransactionsPage() {
  return (
    <AdminPageShell
      title="Transactions"
      description="Ledger and transaction explorer with manual adjustment audit trail."
      action={<button className="btn-primary">Manual Adjustment</button>}
    >
      <div className="panel p-5">
        <div className="grid grid-cols-5 gap-2 border-b border-graphite/70 pb-3 table-header">
          <span>ID</span>
          <span>User</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="mt-3 space-y-2 text-sm text-silver">
          {([
            ["tx_1003", "PrimeUser", "CASE_OPEN", "-$5.20", "completed"],
            ["tx_1002", "PrimeUser", "ROULETTE_PAYOUT", "+$28.00", "completed"],
            ["tx_1001", "ShadowCase", "MANUAL_ADJUSTMENT", "+$50.00", "completed"],
          ] as const).map(([id, user, type, amount, status]) => (
            <div key={id} className="grid grid-cols-5 gap-2 rounded-lg border border-graphite/70 bg-panel2/70 px-3 py-2">
              <span>{id}</span>
              <span>{user}</span>
              <span>{type}</span>
              <span className={amount.startsWith("+") ? "text-success" : "text-danger"}>{amount}</span>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
