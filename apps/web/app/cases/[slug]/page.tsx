import { PageShell } from "../../../components/layout/page-shell";
import { CaseOpeningStage } from "../../../components/animations/case-opening-stage";
import { SectionHeader } from "../../../components/ui/section-header";
import { DataRow, Surface } from "../../../components/ui/design-system";

export default async function SingleCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Case detail"
        title={`Case: ${slug}`}
        subtitle="The reel animation will align with backend-decided item stops and server timestamps."
        action={<button className="btn-primary">Open Case</button>}
      />

      <div className="grid gap-3 xl:grid-cols-[300px_1fr_310px]">
        <Surface elevated className="p-4">
          <div className="h-44 rounded-[12px] border border-accent/30 bg-gradient-to-br from-accent/20 to-transparent" />
          <h3 className="mt-3 text-base font-semibold text-white">{slug}</h3>
          <DataRow className="mt-3" left="Open price" right="$5.20" />
          <DataRow className="mt-2" left="RTP target" right="95.82%" />
          <DataRow className="mt-2" left="Gold spin trigger" right=">= 8x" />
          <button className="btn-primary mt-3 w-full">Open once</button>
          <button className="btn-ghost mt-2 w-full">Open x5</button>
        </Surface>

        <section className="panel-elevated p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-silver">Live reel simulation</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Authoritative Reel</h2>
            </div>
            <span className="chip">$5.20 / open</span>
          </div>

          <CaseOpeningStage title={`${slug} opening reel`} casePrice={5.2} />

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <DataRow left="Server hash" right="08fd...2aa9" />
            <DataRow left="Client seed" right="player-seed-001" />
            <DataRow left="Nonce" right="128" />
          </div>
        </section>

        <aside className="space-y-3">
          <Surface className="p-4">
            <h3 className="text-base font-semibold text-white">Item Pool</h3>
            <p className="mt-1 text-sm text-silver">Snapshot-based pool used for deterministic verification.</p>
            <div className="mt-3 space-y-2">
              {["AK-47 | Gold Arabesque", "AWP | Fade", "M4A1-S | Printstream", "USP-S | Kill Confirmed"].map((item) => (
                <div key={item} className="rounded-[9px] border border-graphite/80 bg-panel2/75 px-3 py-2 text-sm text-silver">
                  {item}
                </div>
              ))}
            </div>
          </Surface>
          <Surface className="p-4">
            <h4 className="text-sm font-semibold text-white">Drop Table</h4>
            <div className="mt-2 space-y-2">
              <DataRow left="Covert" right="2.10%" />
              <DataRow left="Classified" right="5.35%" />
              <DataRow left="Restricted" right="21.00%" />
            </div>
            <button className="btn-ghost mt-3 w-full">View full probability table</button>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}
