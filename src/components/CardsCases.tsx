import Link from "next/link";
import { CardsMovimento } from "@/components/CardsMovimento";

// Os cases da home: um card grande por case, que leva à página completa.
type Numero = { valor: string; rotulo: string };
type Prova = { pede: string; mostra: string };
type Caso = {
  slug: string;
  chapeu: string;
  titulo: string;
  descricao: string;
  numeros: Numero[];
  provas: Prova[];
  previa: "area" | "pre-venda" | "muse";
};

export const casos: Caso[] = [
  {
    slug: "area",
    chapeu: "Projeto principal · CITi, 2026",
    titulo: "Uma área inteira em cima de IA",
    descricao:
      "Criei a subárea de Produto da CITi do zero e coloquei agentes de IA em cada etapa, do lead ao desenvolvimento.",
    numeros: [
      { valor: "12", rotulo: "diagnósticos com IA" },
      { valor: "7", rotulo: "contratos fechados" },
      { valor: "0", rotulo: "projetos atrasados" },
    ],
    provas: [
      { pede: "Automações que economizaram horas reais", mostra: "−70 a −93% de esforço em cada proposta" },
      { pede: "Ferramentas internas implantadas", mostra: "Usadas por um time de 10 pessoas" },
      { pede: "Agentes que resolvem problemas de negócio", mostra: "7 contratos fechados e nenhum projeto atrasado" },
    ],
    previa: "area",
  },
  {
    slug: "pre-venda",
    chapeu: "Case · Agente de pré-venda",
    titulo: "A IA lê a reunião. A regra decide o preço.",
    descricao:
      "Um agente que faz a triagem de cada lead, aponta os riscos com o minuto da fala e deixa o preço para uma regra fixa.",
    numeros: [
      { valor: "−70 a −93%", rotulo: "de esforço por proposta" },
      { valor: "2 de 2", rotulo: "rodadas com o mesmo preço" },
    ],
    provas: [
      { pede: "Agentes que resolvem problemas de negócio", mostra: "Barrou um lead de risco antes de virar proposta" },
      { pede: "Automações com n8n", mostra: "As perguntas ao cliente saem sozinhas, com aprovação humana" },
      { pede: "Prompt engineering avançado", mostra: "A IA só responde critérios, e o preço bateu 2 de 2 vezes" },
    ],
    previa: "pre-venda",
  },
  {
    slug: "muse",
    chapeu: "Case · MUSE, o primeiro que fiz sozinha",
    titulo: "Um app do zero, sem saber programar",
    descricao:
      "Um guarda-roupa com IA: tiro foto de uma roupa, a IA cadastra e monta a vitrine, e outra IA confere se a peça continua igual.",
    numeros: [],
    provas: [
      { pede: "Demos construídas do zero em dias", mostra: "~16 a 20 h da discovery ao app publicado" },
      { pede: "Orquestração de agentes (Claude, Gemini)", mostra: "O Claude confere cada imagem que o Gemini gera" },
      { pede: "Vibe coding e APIs", mostra: "Claude Code, Claude API, fal.ai e Supabase" },
    ],
    previa: "muse",
  },
];

function Previa({ tipo }: { tipo: Caso["previa"] }) {
  if (tipo === "area") {
    const etapas = ["Lead", "Triagem", "Perguntas", "Discovery", "BC e PRD", "Dev"];
    return (
      <div className="previa previa-area" aria-hidden="true">
        {etapas.map((e, i) => (
          <span key={e} data-ia={i > 0 && i < 5}>
            {e}
          </span>
        ))}
      </div>
    );
  }
  if (tipo === "pre-venda") {
    return (
      <div className="previa previa-ficha" aria-hidden="true">
        <span className="ficha-veredito">Voltar ao Comercial</span>
        <span className="previa-risco">Cliente recusou o discovery</span>
        <span className="previa-risco">
          Sem orçamento <em>40:24</em>
        </span>
        <span className="previa-risco">Dados de saúde de crianças</span>
      </div>
    );
  }
  return (
    <div className="previa previa-muse" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/muse/muse-tela-3.jpg" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/muse/muse-tela-1.jpg" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/muse/muse-tela-8.jpg" alt="" />
    </div>
  );
}

export function CardsCases() {
  return (
    <section id="projetos" className="cards" aria-label="Projetos">
      {casos.map((c, i) => (
        <Link key={c.slug} href={`/cases/${c.slug}`} className="card" style={{ zIndex: i + 1 }}>
          <div className="card-texto">
            <div data-calor-area>
              <p className="sobrelinha">
                {String(i + 1).padStart(2, "0")} / {String(casos.length).padStart(2, "0")} · {c.chapeu}
              </p>
              <h2 className="card-titulo">{c.titulo}</h2>
              <p className="card-descricao">{c.descricao}</p>
            </div>
            <div className="card-provas">
              <p className="card-provas-rotulo">
                <span>A vaga pede</span>
                <span>Este case mostra</span>
              </p>
              <ul className="provas">
                {c.provas.map((pr) => (
                  <li key={pr.pede}>
                    <span className="prova-pede">{pr.pede}</span>
                    <span className="prova-mostra">{pr.mostra}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="card-ver">Ver o case →</span>
          </div>
          <Previa tipo={c.previa} />
        </Link>
      ))}
      <CardsMovimento />
    </section>
  );
}
