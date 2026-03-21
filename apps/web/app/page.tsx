import Link from "next/link";
import { PageShell } from "../components/layout/page-shell";
import { Surface } from "../components/ui/design-system";

const navGames = [
  { label: "Battles", href: "/battles", live: true },
  { label: "Roulette", href: "/roulette" },
  { label: "Cases", href: "/cases" },
  { label: "Upgrade", href: "/inventory" },
  { label: "Provably Fair", href: "/provably-fair" },
];

const utilityLinks = [
  { label: "Rewards", href: "/profile" },
  { label: "Promo Code", href: "/profile" },
  { label: "Seed Controls", href: "/seeds" },
  { label: "Wallet", href: "/profile" },
];

const modeTiles = [
  { label: "Case Battles", subtitle: "Real-time arena", href: "/battles", tone: "from-amber-300/20 to-transparent" },
  { label: "Upgrade", subtitle: "Risk-to-value flow", href: "/inventory", tone: "from-emerald-300/15 to-transparent" },
  { label: "Mines", subtitle: "Precision picks", href: "/roulette", tone: "from-indigo-300/15 to-transparent" },
  { label: "Case Opening", subtitle: "Server driven reel", href: "/cases", tone: "from-orange-300/20 to-transparent" },
  { label: "Roll", subtitle: "Roulette rounds", href: "/roulette", tone: "from-zinc-300/10 to-transparent" },
];

export default function HomePage() {
  return (
    <PageShell>
      <section className="grid gap-3 xl:grid-cols-[220px_1fr_280px]">
        <aside className="hidden space-y-3 xl:block">
          <Surface elevated className="p-3">
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-accent">Games</p>
            <div className="space-y-1.5">
              {navGames.map((entry) => (
                <Link
                  key={entry.label}
                  href={entry.href}
                  className="flex items-center justify-between rounded-[9px] border border-graphite/70 bg-panel2/75 px-3 py-2 text-sm text-silver transition hover:border-accent/35 hover:text-white"
                >
                  <span>{entry.label}</span>
                  {entry.live ? <span className="status-dot animate-pulse-glow bg-success" /> : null}
                </Link>
              ))}
            </div>
          </Surface>
          <Surface className="p-3">
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-silver">Rewards & Account</p>
            <div className="space-y-1.5">
              {utilityLinks.map((entry) => (
                <Link
                  key={entry.label}
                  href={entry.href}
                  className="block rounded-[9px] border border-graphite/70 bg-panel2/70 px-3 py-2 text-sm text-silver transition hover:text-white"
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          </Surface>
        </aside>

        <div className="space-y-3">
          <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
            <Surface elevated className="hero-glow p-4">
              <p className="text-xs font-semibold text-accent">Welcome back, Greyz</p>
              <p className="mt-1 text-sm text-silver">Level progression</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full border border-graphite/70 bg-panel2/80">
                <div className="h-full w-[62%] bg-gradient-to-r from-accent to-accentSoft" />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-silver">
                <span>39</span>
                <span>40</span>
              </div>
              <button className="btn-primary mt-3 w-full">Explore rewards</button>
              <div className="mt-3 rounded-[10px] border border-graphite/70 bg-panel2/75 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.14em] text-silver">Wallet</p>
                <p className="mt-1 text-sm text-white">$0.00</p>
              </div>
            </Surface>

            <Surface elevated className="overflow-hidden p-0">
              <div className="relative h-[170px] bg-gradient-to-r from-cyan-300/35 via-emerald-300/18 to-accent/25">
                <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(0,0,0,0.05),rgba(0,0,0,0.45))]" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-accentSoft">Limited campaign</p>
                  <h1 className="mt-1 max-w-md text-3xl font-black leading-[1.05] text-white [font-family:var(--font-orbitron)]">
                    Claim your free CS2 cases
                  </h1>
                  <p className="mt-1 text-sm text-slate-100">No deposit • deterministic fairness • instant opens</p>
                </div>
                <div className="absolute bottom-3 right-4 flex gap-1.5">
                  <span className="h-1.5 w-6 rounded-full bg-white/95" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                </div>
              </div>
            </Surface>
          </div>

          <Surface className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">House Originals</h2>
              <span className="chip">live modules</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {modeTiles.map((tile) => (
                <Link
                  key={tile.label}
                  href={tile.href}
                  className="group rounded-[11px] border border-graphite/75 bg-panel2/80 p-3 transition hover:-translate-y-[1px] hover:border-accent/40"
                >
                  <div className={`h-16 rounded-[8px] border border-graphite/60 bg-gradient-to-br ${tile.tone}`} />
                  <h3 className="mt-2 text-sm font-semibold text-white">{tile.label}</h3>
                  <p className="text-[11px] text-silver">{tile.subtitle}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-accent/80 group-hover:text-accent">enter</p>
                </Link>
              ))}
            </div>
          </Surface>

          <Surface className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Battle Highlights</h2>
              <span className="chip chip-accent">3 rounds</span>
            </div>
            <div className="grid gap-2 lg:grid-cols-[1.15fr_1fr]">
              <div className="rounded-[10px] border border-graphite/70 bg-panel2/75 p-2.5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-silver">Jackpot</p>
                <div className="mt-2 flex items-center gap-2">
                  {["A", "R", "V", "Q", "K", "N"].map((p, index) => (
                    <div
                      key={`${p}-${index}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-graphite/70 bg-black/20 text-[11px] text-silver"
                    >
                      {p}
                    </div>
                  ))}
                  <p className="ml-auto text-sm text-white">$28,405.04</p>
                </div>
              </div>
              <div className="rounded-[10px] border border-graphite/70 bg-panel2/75 p-2.5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-silver">Battle cost</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-white">$22,832.82</p>
                  <Link href="/battles" className="btn-ghost px-3 py-1.5 text-xs">
                    View battle
                  </Link>
                </div>
              </div>
            </div>
          </Surface>
        </div>

        <aside className="space-y-3">
          <Surface elevated className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-silver">Rain Pool</p>
              <span className="chip chip-accent">25.15</span>
            </div>
            <p className="mt-2 text-xs text-silver">Ends in 7m 59s • live participation enabled</p>
            <button className="btn-secondary mt-2 w-full">Join raffle</button>
          </Surface>

          <Surface className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-silver">Live Chat</p>
              <span className="chip">188 online</span>
            </div>
            <div className="h-[280px] space-y-2 overflow-y-auto pr-1">
              {[
                ["hey", "Bombgriever"],
                ["nice battle", "Baggs"],
                ["yo", "Anonymous"],
                ["ws ggs chat", "Shendi"],
                ["47 tickets this week", "Doler"],
                ["QNA after stream", "Monster"],
              ].map(([message, author]) => (
                <div key={`${author}-${message}`} className="rounded-[9px] border border-graphite/70 bg-panel2/75 px-2.5 py-2">
                  <p className="text-[11px] text-silver">{author}</p>
                  <p className="text-sm text-white">{message}</p>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <input className="glass-input" placeholder="Type here..." />
            </div>
          </Surface>
        </aside>
      </section>
    </PageShell>
  );
}
