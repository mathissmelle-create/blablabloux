import Link from "next/link";
import { PageShell } from "../../../components/layout/page-shell";

export default function RegisterPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md panel p-6">
        <h1 className="text-2xl font-semibold">Register</h1>
        <form className="mt-4 space-y-3">
          <input className="w-full rounded-lg border border-graphite bg-black/30 px-3 py-2" placeholder="Email" />
          <input className="w-full rounded-lg border border-graphite bg-black/30 px-3 py-2" placeholder="Username" />
          <input
            className="w-full rounded-lg border border-graphite bg-black/30 px-3 py-2"
            type="password"
            placeholder="Password"
          />
          <input className="w-full rounded-lg border border-graphite bg-black/30 px-3 py-2" placeholder="Client seed" />
          <button className="w-full rounded-lg bg-accent py-2 font-semibold text-black">Create account</button>
        </form>
        <p className="mt-3 text-sm text-silver">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent">
            Login
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
