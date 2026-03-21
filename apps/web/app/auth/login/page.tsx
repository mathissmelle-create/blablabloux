import Link from "next/link";
import { PageShell } from "../../../components/layout/page-shell";
import { DataRow } from "../../../components/ui/design-system";

export default function LoginPage() {
  return (
    <PageShell>
      <div className="mx-auto grid max-w-5xl gap-3 lg:grid-cols-[1.3fr_1fr]">
        <section className="panel-elevated hero-glow p-6">
          <p className="chip mb-3">Welcome back</p>
          <h1 className="text-4xl font-semibold text-white [font-family:var(--font-orbitron)]">Sign in to Prime Arena</h1>
          <p className="mt-2 max-w-md text-sm text-silver">
            Access your inventory, real-time battles, roulette history, and provably fair seed controls.
          </p>
          <div className="mt-4 space-y-2 text-sm text-silver">
            <DataRow left="Session security monitoring" right="enabled" />
            <DataRow left="Refresh token rotation" right="enabled" />
            <DataRow left="Fast live reconnect" right="enabled" />
          </div>
        </section>

        <section className="panel p-4">
          <h2 className="text-xl font-semibold text-white">Login</h2>
          <form className="mt-3 space-y-2">
            <input className="glass-input" placeholder="Email" />
            <input className="glass-input" type="password" placeholder="Password" />
            <button className="btn-primary w-full">Sign in</button>
          </form>
          <button className="btn-ghost mt-2 w-full">Sign in with Steam</button>
          <p className="mt-3 text-sm text-silver">
            No account?{" "}
            <Link href="/auth/register" className="text-accent">
              Register
            </Link>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
