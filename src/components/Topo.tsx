import Link from "next/link";
import { Pilula } from "@/components/Pilula";

// Menu único do site, com fundo de vidro em todas as telas;
// o item da tela atual fica marcado (aria-current).
const itensCases = [
  { slug: "area", rotulo: "A área" },
  { slug: "pre-venda", rotulo: "Pré-venda" },
  { slug: "reclamacoes", rotulo: "Reclamações" },
  { slug: "muse", rotulo: "MUSE" },
];

export function Topo({ pagina = "home", atual }: { pagina?: "home" | "case"; atual?: string }) {
  const naHome = pagina === "home";
  const ancora = (id: string) => (naHome ? `#${id}` : `/#${id}`);

  const Item = ({ href, rotulo, ativo, secao }: { href: string; rotulo: string; ativo?: boolean; secao?: string }) => (
    <Link
      href={href}
      className="topo-item"
      data-texto={rotulo}
      data-secao={naHome ? secao : undefined}
      aria-current={ativo ? "page" : undefined}
    >
      {rotulo}
    </Link>
  );

  return (
    <header className={`topo${naHome ? "" : " topo-case"}`}>
      <Link href={naHome ? "#topo" : "/"} className="marca">
        Marina Xavier
      </Link>
      <nav aria-label="Seções do site">
        <Item href={naHome ? "#topo" : "/"} rotulo="Início" secao="topo" />
        {itensCases.map((c) => (
          <Item key={c.slug} href={`/cases/${c.slug}`} rotulo={c.rotulo} ativo={atual === c.slug} />
        ))}
        <Item href={ancora("outros")} rotulo="Outros" secao="outros" />
        <Item href={ancora("historia")} rotulo="Minha história" secao="historia" />
      </nav>
      <Pilula href={ancora("contato")}>
        Contato
      </Pilula>
    </header>
  );
}
