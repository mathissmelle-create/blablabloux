"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/cases", label: "Cases" },
  { href: "/battles", label: "Battles" },
  { href: "/roulette", label: "Roulette" },
  { href: "/inventory", label: "Inventory" },
  { href: "/provably-fair", label: "Provably Fair" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-graphite/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent shadow-glow">
            C2
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-silver">CS2 Platform</p>
            <p className="font-semibold leading-tight text-gradient [font-family:var(--font-orbitron)]">CS2 PRIME</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-2xl border border-graphite/70 bg-panel2/70 p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-xl px-3 py-2 text-sm transition",
                pathname.startsWith(item.href)
                  ? "bg-accent/15 text-accent"
                  : "text-silver hover:bg-white/5 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-graphite/70 bg-panel2/75 px-3 py-2 lg:flex">
            <span className="status-dot animate-pulse-glow bg-success" />
            <span className="text-xs text-silver">Live: 24 battles</span>
          </div>
          <Link href="/admin" className="btn-ghost hidden sm:inline-flex">
            Admin
          </Link>
          <button className="btn-primary">Sign in</button>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] items-center gap-2 overflow-auto px-4 pb-3 text-xs md:hidden lg:px-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "whitespace-nowrap rounded-lg border px-3 py-1.5",
              pathname.startsWith(item.href)
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-graphite/80 bg-panel2/70 text-silver",
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/admin" className="whitespace-nowrap rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent">
          Admin
        </Link>
      </div>
      <div className="mx-auto max-w-[1240px] px-4 pb-3 lg:px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>
    </header>
  );
}
