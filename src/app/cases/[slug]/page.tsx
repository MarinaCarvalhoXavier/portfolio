import Link from "next/link";
import { notFound } from "next/navigation";
import { casos } from "@/components/CardsCases";
import { SecaoArea } from "@/components/SecaoArea";
import { SecaoPreVenda } from "@/components/SecaoPreVenda";
import { SecaoMuse } from "@/components/SecaoMuse";
import { CalorNosTitulos } from "@/components/CalorNosTitulos";
import { Topo } from "@/components/Topo";

const secoes = { area: SecaoArea, "pre-venda": SecaoPreVenda, muse: SecaoMuse } as const;

export function generateStaticParams() {
  return casos.map((c) => ({ slug: c.slug }));
}

export default async function PaginaCase({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Secao = secoes[slug as keyof typeof secoes];
  const i = casos.findIndex((c) => c.slug === slug);
  if (!Secao || i < 0) notFound();
  const proximo = casos[(i + 1) % casos.length];

  return (
    <main className="pagina-case">
      <Topo pagina="case" atual={slug} />

      <Secao />

      <Link href={`/cases/${proximo.slug}`} className="proximo-case">
        <span className="sobrelinha">Próximo case</span>
        <span className="proximo-titulo">{proximo.titulo} →</span>
      </Link>
      <CalorNosTitulos />
    </main>
  );
}
