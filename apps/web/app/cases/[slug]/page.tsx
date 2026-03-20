import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeader } from "../../../components/ui/section-header";

export default async function SingleCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <PageShell>
      <SectionHeader
        title={`Case: ${slug}`}
        subtitle="The reel animation will align with backend-decided item stops and server timestamps."
      />
      <div className="panel p-6">
        <p className="text-silver">Authoritative opening UI placeholder for {slug}.</p>
      </div>
    </PageShell>
  );
}
