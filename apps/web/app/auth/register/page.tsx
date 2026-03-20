import Link from "next/link";
import { PageShell } from "../../../components/layout/page-shell";

export default function RegisterPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-xl panel-elevated p-8">
        <p className="chip mb-4">Create account</p>
        <h1 className="text-3xl font-semibold text-white [font-family:var(--font-orbitron)]">Join CS2 Prime</h1>
        <p className="mt-2 text-sm text-silver">
          Start opening cases, joining battles, and verifying each outcome with transparent fairness tools.
        </p>

        <form className="mt-6 grid gap-3 sm:grid-cols-2">
          <input className="glass-input sm:col-span-2" placeholder="Email" />
          <input className="glass-input sm:col-span-2" placeholder="Username" />
          <input className="glass-input sm:col-span-2" type="password" placeholder="Password" />
          <input className="glass-input sm:col-span-2" placeholder="Client seed" />
          <button className="btn-primary sm:col-span-2">Create account</button>
        </form>

        <p className="mt-4 text-sm text-silver">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent">
            Login
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
