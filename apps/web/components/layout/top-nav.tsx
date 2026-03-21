"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";

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
    <header className="sticky top-0 z-50 border-b border-graphite/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-accent/40 bg-accent/10 text-accent transition group-hover:brightness-110">
            Σ
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-silver">CS2 Gaming Network</p>
            <p className="font-semibold leading-tight text-gradient [font-family:var(--font-orbitron)]">Prime Arena</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-[12px] border border-graphite/70 bg-panel2/70 p-1.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-[8px] px-3 py-1.5 text-sm transition",
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
          <div className="hidden items-center gap-2 rounded-[10px] border border-graphite/70 bg-panel2/75 px-3 py-1.5 lg:flex">
            <span className="status-dot animate-pulse-glow bg-success" />
            <span className="text-[11px] text-silver">Live 24 battles</span>
          </div>
          <Link href="/admin" className="btn-ghost hidden sm:inline-flex">
            Admin
          </Link>
          <button className="btn-primary">Sign in</button>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] items-center gap-2 overflow-auto px-4 pb-2 text-xs md:hidden lg:px-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "whitespace-nowrap rounded-[9px] border px-3 py-1.5",
              pathname.startsWith(item.href)
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-graphite/80 bg-panel2/70 text-silver",
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/admin" className="whitespace-nowrap rounded-[9px] border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent">
          Admin
        </Link>
      </div>
      <div className="mx-auto max-w-[1240px] px-4 pb-3 lg:px-6">
        <motion.div
          initial={{ opacity: 0.5, scaleX: 0.95 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-px w-full origin-center bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        />
      </div>
    </header>
  );
}
