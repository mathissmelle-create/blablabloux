import Link from "next/link";

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
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[250px_1fr]">
      <aside className="panel h-fit p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">Admin Panel</h2>
        <nav className="space-y-2 text-sm text-silver">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block rounded px-2 py-1 hover:bg-graphite/40 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="space-y-4">{children}</section>
    </main>
  );
}
