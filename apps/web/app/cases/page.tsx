import { PageShell } from "../../components/layout/page-shell";
import { SectionHeader } from "../../components/ui/section-header";

export default function CasesPage() {
  return (
    <PageShell>
      <SectionHeader
        title="Cases"
        subtitle="Browse active cases with transparent odds, versioned pools, and gold spin configuration."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <article key={idx} className="panel p-4">
            <div className="h-36 rounded-lg bg-graphite/40" />
            <h3 className="mt-4 text-lg font-semibold">Case #{idx + 1}</h3>
            <p className="text-sm text-silver">Price: $2.50</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
