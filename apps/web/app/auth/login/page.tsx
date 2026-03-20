import Link from "next/link";
import { PageShell } from "../../../components/layout/page-shell";

export default function LoginPage() {
  return (
    <PageShell>
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="panel-elevated hero-glow p-8">
          <p className="chip mb-4">Welcome back</p>
          <h1 className="text-4xl font-semibold text-white [font-family:var(--font-orbitron)]">Sign in to CS2 Prime</h1>
          <p className="mt-3 max-w-md text-sm text-silver">
            Access your inventory, real-time battles, roulette history, and provably fair seed controls.
          </p>
          <div className="mt-6 space-y-2 text-sm text-silver">
            <p>• Session security monitoring</p>
            <p>• Refresh token rotation</p>
            <p>• Fast reconnect for live battles</p>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-2xl font-semibold text-white">Login</h2>
          <form className="mt-4 space-y-3">
            <input className="glass-input" placeholder="Email" />
            <input className="glass-input" type="password" placeholder="Password" />
            <button className="btn-primary w-full">Sign in</button>
          </form>
          <button className="btn-ghost mt-3 w-full">Sign in with Steam</button>
          <p className="mt-4 text-sm text-silver">
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
