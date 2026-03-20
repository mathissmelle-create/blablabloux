import Link from "next/link";

const navItems = [
  { href: "/cases", label: "Cases" },
  { href: "/battles", label: "Battles" },
  { href: "/roulette", label: "Roulette" },
  { href: "/inventory", label: "Inventory" },
  { href: "/provably-fair", label: "Provably Fair" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-graphite bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-wide text-accent">
          CS2 PRIME
        </Link>
        <nav className="flex gap-6 text-sm text-silver">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="rounded-md border border-accent/40 px-3 py-1 text-accent">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
