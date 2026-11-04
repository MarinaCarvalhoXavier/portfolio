import Link from "next/link";
import { CardsMovimento } from "@/components/CardsMovimento";

// Os cases da home: um card grande por case, que leva à página completa.
type Numero = { valor: string; rotulo: string };
type Prova = { pede: string; mostra: string };
type Caso = {
  slug: string;
  chapeu: string;
  titulo: string;
  tituloLongo?: boolean; // título que quebra em 3 linhas: fica um pouco menor para o card caber em telas baixas
  descricao: string;
  numeros: Numero[];
  provas: Prova[];
  previa: "area" | "pre-venda" | "muse" | "reclamacoes";
};

export const casos: Caso[] = [
  {
    slug: "area",
    chapeu: "Projeto principal · CITi, 2026",
    titulo: "Uma área inteira em cima de IA",
    descricao:
      "Criei a subárea de Produto do CITi, o jeito de trabalhar e as skills de IA de cada etapa. Hoje as gerentes conduzem os Discoveries sem mim.",
    numeros: [
      { valor: "R$ 116,5 mil", rotulo: "em desenvolvimento vindo de Discovery" },
      { valor: "4", rotulo: "Discoveries conduzidos sem mim" },
      { valor: "8", rotulo: "pessoas usam as skills" },
    ],
    provas: [
      { pede: "Ferramentas internas implantadas", mostra: "7 skills de IA em todo Discovery, usadas por 8 pessoas" },
      { pede: "Automações que economizaram horas reais", mostra: "Business Case e PRD: de ~10 h para escrever a até 2 h para validar" },
      { pede: "Prompt engineering avançado", mostra: "Um Business Case que se recusa a inventar retorno sem dado medido" },
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
      { valor: "100%", rotulo: "das rodadas de teste com o mesmo preço" },
    ],
    provas: [
      { pede: "Agentes que resolvem problemas de negócio", mostra: "Barrou um lead de risco antes de virar proposta" },
      { pede: "Automações com n8n", mostra: "As perguntas ao cliente saem sozinhas, com aprovação humana" },
      { pede: "Prompt engineering avançado", mostra: "A IA só responde critérios, e toda rodada de teste deu o mesmo preço" },
    ],
    previa: "pre-venda",
  },
  {
    slug: "reclamacoes",
    chapeu: "Case · Agente de reclamações de delivery",
    titulo: "Um agente que sabe quando chamar alguém",
    tituloLongo: true,
    descricao:
      "Reclamações de delivery: a IA lê, uma regra decide o reembolso e uma pessoa entra quando o risco é alto. 97 de 100 decisões certas em casos que a IA nunca viu.",
    numeros: [],
    provas: [
      { pede: "Agentes que resolvem problemas de negócio", mostra: "~3 de 4 reclamações resolvidas sozinhas; 15 de 15 casos graves com uma pessoa" },
      { pede: "Dashboards funcionais", mostra: "Painel com os resultados reais de 100 casos de teste novos" },
      { pede: "Demos construídas do zero em dias", mostra: "Discovery, regras, 208 casos de teste e demo em 3 dias" },
    ],
    previa: "reclamacoes",
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
  if (tipo === "reclamacoes") {
    return (
      <div className="previa previa-rec2" aria-hidden="true">
        {/* Print real da demo (modo foto) + os três cartões dos bastidores flutuando por cima. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/reclamacoes/celular-bandeja.webp" alt="" className="rec2-cel" />
        <div className="rec2-cartoes">
          <span style={{ ["--c" as string]: "#b994ff" }}><em>IA</em>Item errado · X-tudo</span>
          <span style={{ ["--c" as string]: "#ffa477" }}><em>Regra</em>R$ 37,89 ou refazer + cortesia</span>
          <span style={{ ["--c" as string]: "#7fd49b" }}><em>Automático</em>Resolvido em 6 s, sem fila</span>
        </div>
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
              <h2 className={c.tituloLongo ? "card-titulo longo" : "card-titulo"}>{c.titulo}</h2>
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
