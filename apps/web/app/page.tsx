import Link from "next/link";
import { PageShell } from "../components/layout/page-shell";

const highlights = [
  { title: "Case Opening", href: "/cases", desc: "Studio-grade reel animations mapped to backend results only." },
  { title: "Case Battles", href: "/battles", desc: "Fully synchronized rooms with shared timeline and EOS-backed fairness." },
  { title: "Roulette", href: "/roulette", desc: "Server-timed spin lock, round history, and deterministic segment outcomes." },
];

const quickStats = [
  { label: "Online Players", value: "9,284" },
  { label: "Live Battles", value: "241" },
  { label: "Cases Opened Today", value: "1.2M" },
  { label: "Verified Fairness Checks", value: "86,912" },
];

export default function HomePage() {
  return (
    <PageShell>
      <section className="panel-elevated hero-glow overflow-hidden p-8 md:p-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-accent">
          <span className="status-dot bg-success" /> Provably fair and authoritative
        </div>
        <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl [font-family:var(--font-orbitron)]">
          Premium <span className="text-gradient">CS2 case opening</span> with real-time multiplayer battles
        </h1>
        <p className="mt-5 max-w-2xl text-base text-silver">
          Crafted with production-grade architecture: deterministic fairness, immutable game records, synchronized websocket
          events, and an elevated visual language inspired by top-tier CS2 gaming platforms.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/cases"
            className="btn-primary"
          >
            Open Cases
          </Link>
          <Link href="/battles" className="btn-secondary">
            Join Live Battle
          </Link>
          <Link href="/provably-fair" className="btn-ghost">
            Verify Fairness
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-graphite/80 bg-panel2/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-silver/80">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {highlights.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="panel-elevated block p-6 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50"
          >
            <div className="mb-4 h-1 w-14 rounded-full bg-gradient-to-r from-accent to-accentSoft" />
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm text-silver">{item.desc}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-accent">Explore mode</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Live Activity</h3>
            <span className="chip">real-time feed</span>
          </div>
          <div className="space-y-3">
            {[
              "Aiden opened Desert Eagle | Blaze ($429.50)",
              "Team Echo won a 3v3 terminal battle ($1,248.70)",
              "Roulette Round #2814 landed on GOLD",
              "Nova hit a Gold Spin on Crimson Protocol Case",
            ].map((event) => (
              <div key={event} className="rounded-xl border border-graphite/80 bg-panel2/80 px-4 py-3 text-sm text-silver">
                {event}
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-6">
          <h3 className="text-lg font-semibold text-white">Security & Fairness</h3>
          <ul className="mt-4 space-y-3 text-sm text-silver">
            <li>• HMAC SHA-256 deterministic ticket derivation</li>
            <li>• Seed rotation + reveal history</li>
            <li>• EOS block hash integration for battles</li>
            <li>• Immutable fairness records and verifier tools</li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
