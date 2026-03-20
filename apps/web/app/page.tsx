import Link from "next/link";
import { PageShell } from "../components/layout/page-shell";

const highlights = [
  { title: "Case Opening", href: "/cases", desc: "Provably fair CS2-style case drops." },
  { title: "Case Battles", href: "/battles", desc: "Synchronized multiplayer battle rooms." },
  { title: "Roulette", href: "/roulette", desc: "Live rounds with backend-authoritative outcomes." },
];

export default function HomePage() {
  return (
    <PageShell>
      <section className="panel bg-hero-gradient p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-accent">CS2 Prime</p>
        <h1 className="text-5xl font-black leading-tight">Premium Case Opening Platform</h1>
        <p className="mt-4 max-w-2xl text-silver">
          Authoritative realtime architecture, provably fair systems, and modern synchronized gameplay.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/cases"
            className="rounded-lg bg-accent px-5 py-3 font-semibold text-black shadow-glow transition hover:brightness-110"
          >
            Open Cases
          </Link>
          <Link href="/battles" className="rounded-lg border border-graphite px-5 py-3 text-silver hover:text-white">
            Join Live Battle
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Link key={item.title} href={item.href} className="panel block p-5 transition hover:border-accent/70">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-silver">{item.desc}</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
