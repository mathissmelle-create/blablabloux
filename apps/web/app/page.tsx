import Link from "next/link";
import { PageShell } from "../components/layout/page-shell";
import { ClickCard, MetricTile, SkeletonBlock, Surface } from "../components/ui/design-system";

const highlights = [
  { title: "Case Opening", href: "/cases", desc: "Deterministic reel outcome with precise stop physics." },
  { title: "Case Battles", href: "/battles", desc: "Synchronized rooms with immutable event sequencing." },
  { title: "Roulette", href: "/roulette", desc: "Timed lock state and backend-authoritative landing." },
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
      <section className="panel-elevated hero-glow overflow-hidden p-6 md:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent">
          <span className="status-dot bg-success" /> Provably fair and authoritative
        </div>
        <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl [font-family:var(--font-orbitron)]">
          High-stakes <span className="text-gradient">CS2 game arena</span> built for trust, speed, and live tension
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-silver md:text-[15px]">
          Every open, battle round, and roulette stop comes from backend truth with immutable fairness evidence and synchronized
          event playback.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href="/cases" className="btn-primary">
            Open Cases
          </Link>
          <Link href="/battles" className="btn-secondary">
            Join Live Battle
          </Link>
          <Link href="/provably-fair" className="btn-ghost">
            Verify Fairness
          </Link>
        </div>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat) => (
            <MetricTile key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-3 lg:grid-cols-3">
        {highlights.map((item) => (
          <ClickCard key={item.title}>
            <Link href={item.href} className="panel-elevated block p-4 transition hover:border-accent/45">
              <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-accent to-accentSoft" />
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-silver">{item.desc}</p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-accent">Enter module</p>
            </Link>
          </ClickCard>
        ))}
      </section>

      <section className="mt-5 grid gap-3 lg:grid-cols-[1.45fr_1fr]">
        <Surface className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Live Activity</h3>
            <span className="chip">real-time feed</span>
          </div>
          <div className="space-y-2">
            {[
              "Aiden opened Desert Eagle | Blaze ($429.50)",
              "Team Echo won a 3v3 terminal battle ($1,248.70)",
              "Roulette Round #2814 landed on GOLD",
              "Nova hit a Gold Spin on Crimson Protocol Case",
            ].map((event) => (
              <div key={event} className="rounded-[10px] border border-graphite/80 bg-panel2/80 px-3 py-2 text-sm text-silver">
                {event}
              </div>
            ))}
          </div>
        </Surface>
        <Surface className="p-4">
          <h3 className="text-base font-semibold text-white">Security & Fairness</h3>
          <ul className="mt-3 space-y-2 text-sm text-silver">
            <li>• HMAC SHA-256 deterministic ticket derivation</li>
            <li>• Seed rotation + reveal history</li>
            <li>• EOS block hash integration for battles</li>
            <li>• Immutable fairness records and verifier tools</li>
          </ul>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
          </div>
        </Surface>
      </section>
    </PageShell>
  );
}
