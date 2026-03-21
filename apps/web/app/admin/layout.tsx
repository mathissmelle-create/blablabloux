"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/roles", label: "Roles" },
  { href: "/admin/cases", label: "Cases" },
  { href: "/admin/battles", label: "Battles" },
  { href: "/admin/roulette", label: "Roulette" },
  { href: "/admin/fairness", label: "Fairness" },
  { href: "/admin/transactions", label: "Transactions" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/feature-flags", label: "Feature Flags" },
  { href: "/admin/content", label: "Content" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 gap-3 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
      <aside className="panel sticky top-24 h-fit p-3">
        <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Admin Nexus</h2>
        <nav className="space-y-1.5 text-sm text-silver">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block rounded-[9px] border px-3 py-2 transition",
                pathname === link.href
                  ? "border-accent/35 bg-accent/10 text-accent"
                  : "border-transparent hover:border-graphite/80 hover:bg-panel2/80 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="space-y-3 pb-8">{children}</section>
    </main>
  );
}
