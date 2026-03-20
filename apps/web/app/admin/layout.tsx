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
    <main className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 gap-4 px-4 py-8 lg:grid-cols-[270px_1fr] lg:px-6">
      <aside className="panel sticky top-28 h-fit p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">Admin Panel</h2>
        <nav className="space-y-1.5 text-sm text-silver">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block rounded-lg border px-3 py-2 transition",
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
      <section className="space-y-4 pb-12">{children}</section>
    </main>
  );
}
