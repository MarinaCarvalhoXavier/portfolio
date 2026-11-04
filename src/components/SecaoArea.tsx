"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MicroSlatsJS from "@/components/reactbits/MicroSlats";
import { TituloDigitado } from "@/components/TituloDigitado";

// O componente do React Bits é JS; as props opcionais vêm do preset.
const MicroSlats = MicroSlatsJS as unknown as React.ComponentType<Record<string, unknown>>;

// Fonte de todos os números desta página: "Banco de métricas — GEN AI iFood" (out/2026), contratos no Drive
// e a entrevista com a Marina em 04/11/2026 (notas em ~/portfolio-materiais/case-area/).
// Nome de cliente nunca aparece: os projetos viram letras.

// Liga a classe "ativa" quando o elemento entra na tela (barras e comparação animam a partir dela).
// Sem JS ou com movimento reduzido, tudo já aparece no estado final.
function useAoAparecer<T extends HTMLElement>(limiar = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("anima");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("ativa");
          io.disconnect();
        }
      },
      { threshold: limiar },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [limiar]);
  return ref;
}

// Conta de 0 até o valor quando entra na tela (mesmo ritmo dos números dos outros cases).
function Conta({ ate, casas = 0, antes = "", depois = "" }: { ate: number; casas?: number; antes?: string; depois?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(ate);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAtual(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / 1500);
          const v = ate * (1 - Math.pow(1 - t, 3));
          setAtual(t < 1 ? (casas ? v : Math.floor(v)) : ate);
          if (t < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ate, casas]);
  const fmt = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  return (
    <span ref={ref} aria-label={`${antes}${fmt(ate)}${depois}`}>
      {antes}
      {fmt(atual)}
      {depois}
    </span>
  );
}

const funil = [
  { nome: "Lead chega", quem: "Comercial", ia: false },
  { nome: "Triagem e preço", quem: "Agente + regra", ia: true },
  { nome: "Perguntas ao cliente", quem: "Agente + n8n", ia: true },
  { nome: "Discovery", quem: "Time + skills", ia: true },
  { nome: "Business Case e PRD", quem: "Skills", ia: true },
  { nome: "Desenvolvimento", quem: "Dev e Dados", ia: false },
];

// Os 3 projetos que atrasaram em 2026. 5 semanas previstas cada.
// A: ~3 semanas a mais (estimativa da Marina). B: +3. C: +5 (cronogramas).
const atrasos = [
  { nome: "Projeto A", extra: 3, nota: "~3 semanas a mais" },
  { nome: "Projeto B", extra: 3, nota: "3 semanas a mais" },
  { nome: "Projeto C", extra: 5, nota: "5 semanas a mais" },
];

const piloto = [
  {
    quebrou: "Cada entrevista com o cliente saía de um jeito, e as perguntas importantes ficavam para depois.",
    mudei: "Skill de Mom Test",
    como: "Toda entrevista segue o mesmo método: perguntar o que o cliente já fez, não o que ele acha.",
  },
  {
    quebrou: "O contexto se perdia. Quem faltava a uma reunião não sabia o que tinha sido decidido.",
    mudei: "Um Projeto do Claude por cliente",
    como: "Quando o CITi passou a pagar o Claude para o time, toda reunião passou a ser registrada lá. Quem entra no projeto lê o histórico inteiro.",
  },
  {
    quebrou: "Ninguém no CITi tinha escrito um Business Case ou um PRD. O piloto teve o que a gente entendia por eles.",
    mudei: "Skills de Business Case e PRD",
    como: "O padrão está escrito na skill. A pessoa nova lê o que cada parte significa, e a IA entende a mesma coisa.",
  },
  {
    quebrou: "Mapear o processo do cliente, como é hoje e como deveria ser, levava mais de 4 h.",
    mudei: "Skills de As-Is e To-Be",
    como: "O time coloca o material no projeto e a skill monta o fluxo. A pessoa revisa em vez de desenhar do zero.",
  },
];

const skills = [
  { etapa: "Vender", itens: ["Precificação", "Proposta"] },
  { etapa: "Descobrir", itens: ["Mom Test", "As-Is", "To-Be"] },
  { etapa: "Passar para o dev", itens: ["Business Case", "PRD"] },
];

// PRD e Business Case do piloto (sem skill) × de um Discovery com a skill. Contado nos próprios documentos.
const documento = [
  { item: "User stories", antes: 0, depois: 31 },
  { item: "Critérios de aceite", antes: 0, depois: 34 },
  { item: "Métricas de sucesso, com como medir", antes: 0, depois: 7 },
];
const documentoSimNao = ["Escopo: o que é e o que não é", "Riscos e dependências", "Investimento para o cliente decidir"];

const conduzidos = [
  { nome: "Discovery A", status: "3 dias antes do prazo", ok: true },
  { nome: "Discovery B", status: "No prazo", ok: true },
  { nome: "Discovery C", status: "No prazo · virou desenvolvimento", ok: true },
  { nome: "Discovery D", status: "~3 semanas de atraso · virou desenvolvimento", ok: false },
];

// Autoavaliação da subárea (7 respostas em outubro; a líder não responde; duas pessoas saíram no semestre). Escala de 1 a 5.
// Ago e set: matriz antiga ("Mini PRD", "Business Case & ROI", "AS-IS/TO-BE"). Out: matriz nova de 26 competências
// ("Documentação de Produto", "Business Case & Viabilidade", "Mapeamento de Processos").
const rodadas = ["ago", "set", "out"] as const;
const evolucao = [
  { item: "Escrever PRD", valores: [2.1, 2.9, 3.9] },
  { item: "Business Case", valores: [2.6, 3.1, 4.0] },
  { item: "Mapear processos (As-Is e To-Be)", valores: [3.6, 4.3, 4.6] },
];
// Trechos reais de um PRD gerado pela skill (Discovery de 2026, 43 páginas). Nome do cliente omitido.
const prdSumario = [
  "Controle do documento", "Sumário executivo", "Contexto & problema", "Objetivos & métricas de sucesso",
  "Público & jornadas", "Escopo (É / Não É)", "Requisitos funcionais & user stories", "Requisitos de dados",
  "Requisitos não-funcionais", "Arquitetura, integrações & restrições", "Design & protótipos",
  "Priorização & faseamento", "Riscos, premissas, dependências & dúvidas", "Critérios de qualidade: Ready, Done & aceite",
  "Glossário", "Anexos & rastreabilidade",
];
const prdAbas = [
  { id: "sumario", rotulo: "O sumário" },
  { id: "historia", rotulo: "Uma user story" },
  { id: "metrica", rotulo: "Uma métrica" },
] as const;

const pos = (v: number) => `${((v - 1) / 4) * 100}%`;
const num = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1 });

export function SecaoArea() {
  const barras = useAoAparecer<HTMLOListElement>();
  const comparacao = useAoAparecer<HTMLDivElement>();
  const curva = useAoAparecer<HTMLDivElement>();
  const [aba, setAba] = useState<(typeof prdAbas)[number]["id"]>("historia");

  return (
    <section id="area" className="area ar" aria-labelledby="area-titulo">
      <div className="area-cabeca" data-calor-area>
        <p className="sobrelinha">Projeto principal · CITi, 2026</p>
        <TituloDigitado id="area-titulo" className="area-titulo" linhas={["Montei a área de Produto.", "Hoje ela entrega sem mim."]} />
        <p className="area-lead">
          No CITi, ninguém tinha escrito um Business Case ou um PRD. Criei a subárea de Produto, o jeito de trabalhar e
          as skills de IA que fazem o time entregar no mesmo padrão, comigo na sala ou não.
        </p>
      </div>

      <div className="ar-corpo">
        {/* Contexto em 10 segundos. */}
        <dl className="ar-contexto">
          <div>
            <dt className="rotulo-num">O problema</dt>
            <dd>
              Cada Discovery saía de um jeito. Em 2026, três projetos estouraram o prazo, e o que o time de
              desenvolvimento recebia não dizia com clareza o que construir.
            </dd>
          </div>
          <div>
            <dt className="rotulo-num">O que construí</dt>
            <dd>
              A subárea de Produto, o serviço de Discovery para empresas consolidadas, sete skills de IA que entram em
              todo Discovery e a formação do time para usá-las.
            </dd>
          </div>
          <div>
            <dt className="rotulo-num">Meu papel</dt>
            <dd>
              Líder de Produto de um time de 8 pessoas hoje (10 ao longo do semestre). A diretoria decidiu criar o serviço. A proposta da subárea, o
              sistema, as skills e a formação do time foram meus.
            </dd>
          </div>
        </dl>

        {/* Leitura rápida: um número principal e três de apoio, cada um com a origem. */}
        <div className="ar-numeros">
          <div className="ar-numero-principal">
            <strong>
              <Conta ate={116.5} casas={1} antes="R$ " depois=" mil" />
            </strong>
            <span className="rotulo-num">em contratos de desenvolvimento que nasceram de Discovery</span>
            <small>
              3 contratos assinados nesta gestão. Dos 3 projetos que atrasaram antes do sistema, 2 não viraram
              desenvolvimento.
            </small>
          </div>
          <ul>
            <li>
              <strong>
                <Conta ate={4} />
              </strong>
              <span className="rotulo-num">Discoveries conduzidos pelas gerentes, sem mim</span>
              <small>3 entregues no prazo ou antes. O quarto está explicado abaixo.</small>
            </li>
            <li>
              <strong>
                <Conta ate={100} depois="%" />
              </strong>
              <span className="rotulo-num">dos Business Cases e PRDs feitos com as skills</span>
              <small>Desde o segundo projeto. O time lê e valida em vez de escrever do zero.</small>
            </li>
            <li>
              <strong>
                <Conta ate={8} />
              </strong>
              <span className="rotulo-num">pessoas de Produto usam as skills</span>
              <small>Contando comigo. E 5 gerentes de contas recebem o resultado.</small>
            </li>
          </ul>
        </div>

        {/* O antes: barras de prazo previsto × real. */}
        <div className="ar-bloco">
          <p className="sobrelinha">O antes · 2026</p>
          <h3 className="ar-h3">Três projetos, três atrasos.</h3>
          <div className="ar-antes">
            <ol ref={barras} className="ar-barras" aria-label="Prazo previsto e atraso de cada projeto">
              {atrasos.map((a) => (
                <li key={a.nome}>
                  <span className="ar-barras-nome">{a.nome}</span>
                  <span className="ar-barras-trilho" aria-hidden="true">
                    <span className="ar-barras-previsto" style={{ ["--s" as string]: 5 }} />
                    <span className="ar-barras-atraso" style={{ ["--s" as string]: a.extra }} />
                  </span>
                  <span className="ar-barras-nota">
                    5 semanas previstas · <b>{a.nota}</b>
                  </span>
                </li>
              ))}
            </ol>
            <ul className="ar-antes-fatos">
              <li>
                <b>~+73%</b>
                <span>de atraso médio sobre o prazo previsto</span>
              </li>
              <li>
                <b>~R$ 21,9 mil</b>
                <span>de trabalho que ninguém cobrou: semanas de atraso × valor semanal de cada contrato</span>
              </li>
              <li>
                <b>0</b>
                <span>Business Cases ou PRDs escritos no CITi até então</span>
              </li>
            </ul>
          </div>
          <p className="ar-fonte">Fonte: cronogramas e contratos dos projetos. O atraso do Projeto A é estimativa, por isso o “~”.</p>
        </div>

        {/* O piloto: a decisão de testar antes de escalar, e o que cada falha virou. */}
        <div className="ar-bloco">
          <p className="sobrelinha">O piloto</p>
          <h3 className="ar-h3">Pedi para o primeiro rodar antes da minha gestão.</h3>
          <p className="ar-resumo">
            O serviço era novo. Já eleita, pedi que o primeiro Discovery para empresa consolidada acontecesse ainda na
            gestão anterior, para eu assumir sabendo o que funcionava. <strong>Quase nada do dia a dia funcionava.</strong>{" "}
            Cada falha virou uma peça do sistema.
          </p>
          <ol className="ar-piloto">
            <li className="ar-piloto-cabeca" aria-hidden="true">
              <span className="rotulo-num">O que quebrou</span>
              <span className="rotulo-num">O que eu mudei</span>
            </li>
            {piloto.map((p, i) => (
              <li key={p.mudei}>
                <p className="ar-piloto-quebrou">
                  <span className="ar-piloto-n">{String(i + 1).padStart(2, "0")}</span>
                  {p.quebrou}
                </p>
                <div className="ar-piloto-mudei">
                  <b>{p.mudei}</b>
                  <p>{p.como}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="ar-fonte">Mesmo com tudo isso, o piloto virou um contrato de desenvolvimento de R$ 20 mil.</p>
        </div>
      </div>

      {/* O sistema: o funil, com as skills por etapa. Fica fora do corpo para o fundo animado ocupar a largura toda. */}
      <div className="ar-bloco ar-sistema">
        <div className="ar-sistema-cabeca">
          <p className="sobrelinha">O sistema</p>
          <h3 className="ar-h3">IA em cada etapa, do lead ao desenvolvimento.</h3>
        </div>
        <div className="area-mar">
          <MicroSlats
            preset="swell"
            color="#b04fd8"
            glintColor="#ff8a3d"
            backgroundColor="#000000"
            slatWidth={6}
            slatHeight={18}
            gap={3}
            roundness={1}
            interactive
            cursorStrength={1.4}
            cursorSize={70}
            swirl={0.4}
            trail={2.2}
            intro={false}
            glint={1.3}
            contrast={0.95}
            fog={0.3}
          />
          <ol className="funil" aria-label="O funil da subárea de Produto">
            {funil.map((etapa) => (
              <li key={etapa.nome} data-ia={etapa.ia} data-calor-linha="topo">
                <span className="funil-quem">{etapa.quem}</span>
                <span className="funil-nome">{etapa.nome}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="ar-skills">
          <div className="ar-skills-texto">
            <p className="rotulo-num">As sete skills de todo Discovery</p>
            <p>
              Cada uma guarda o padrão da área por escrito. Além delas, o time criou outras: a estimativa da parte de Dev
              e Dados para a precificação, o design system do CITi e uma revisão de protótipos pelas heurísticas de
              usabilidade.
            </p>
            <Link href="/cases/pre-venda" className="ar-link">
              A triagem e a precificação têm um case só delas →
            </Link>
          </div>
          <ul className="ar-skills-grupos">
            {skills.map((g) => (
              <li key={g.etapa}>
                <span className="rotulo-num">{g.etapa}</span>
                <span className="ar-chips">
                  {g.itens.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </span>
              </li>
            ))}
            <li>
              <span className="rotulo-num">Memória</span>
              <span className="ar-chips">
                <span className="ar-chip-memoria">Um Projeto do Claude por cliente</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="ar-corpo">
        {/* O documento antes × depois: o ganho é de qualidade, não só de tempo. */}
        <div className="ar-bloco">
          <p className="sobrelinha">O que o desenvolvimento recebe</p>
          <h3 className="ar-h3">O mesmo documento, antes e depois da skill.</h3>
          <p className="ar-resumo">
            À esquerda, o que o piloto entregou, escrito sem padrão. À direita, um Discovery feito com as skills: PRD com
            15 seções e Business Case com 13.
          </p>
          <div ref={comparacao} className="ar-doc">
            <div className="ar-doc-cabeca" aria-hidden="true">
              <span />
              <span className="rotulo-num">Piloto, sem skill</span>
              <span className="rotulo-num">Com a skill</span>
            </div>
            {documento.map((d) => (
              <div key={d.item} className="ar-doc-linha">
                <span className="ar-doc-item">{d.item}</span>
                <span className="ar-doc-antes">{d.antes}</span>
                <span className="ar-doc-depois">
                  <b>{d.depois}</b>
                  <span className="ar-doc-barra" style={{ ["--p" as string]: d.depois / 34 }} aria-hidden="true" />
                </span>
              </div>
            ))}
            {documentoSimNao.map((item) => (
              <div key={item} className="ar-doc-linha">
                <span className="ar-doc-item">{item}</span>
                <span className="ar-doc-antes">não tinha</span>
                <span className="ar-doc-depois">
                  <b className="ar-doc-sim">tem</b>
                </span>
              </div>
            ))}
          </div>
          {/* Folhear o PRD de verdade: três trechos, sem o nome do cliente. */}
          <div className="ar-prd">
            <div className="ar-prd-topo">
              <p className="rotulo-num">Folheie um PRD gerado pela skill</p>
              <div className="ar-prd-abas" role="tablist" aria-label="Trechos do PRD">
                {prdAbas.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="tab"
                    id={`ar-prd-aba-${a.id}`}
                    aria-selected={aba === a.id}
                    aria-controls="ar-prd-folha"
                    onClick={() => setAba(a.id)}
                  >
                    {a.rotulo}
                  </button>
                ))}
              </div>
            </div>
            <div className="ar-prd-folha" id="ar-prd-folha" role="tabpanel" aria-labelledby={`ar-prd-aba-${aba}`}>
              <p className="ar-prd-cabecalho">
                <span>Subárea de Produto · Discovery Enterprise</span>
                <span>PRD · Plataforma de contas a pagar</span>
              </p>
              {aba === "sumario" && (
                <ol className="ar-prd-sumario">
                  {prdSumario.map((s, i) => (
                    <li key={s}>
                      <span>{String(i).padStart(2, "0")}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              )}
              {aba === "historia" && (
                <div className="ar-prd-historia">
                  <p className="ar-prd-id">US002 · Épico EP01 · Prioridade: Must</p>
                  <p className="ar-prd-frase">
                    Como usuário, quero conversar com as outras equipes dentro de cada conta, para resolver pendências sem
                    email.
                  </p>
                  <p className="ar-prd-sub">Critérios de aceite</p>
                  <ul>
                    <li>
                      <b>Dado</b> uma conta aberta, <b>quando</b> escrevo e envio uma mensagem, <b>então</b> ela aparece na
                      conversa com meu nome, área e horário para todas as áreas.
                    </li>
                    <li>
                      <b>Dado</b> mensagens novas de outra área, <b>quando</b> abro a barra superior, <b>então</b> o ícone de
                      conversas mostra a quantidade não lida.
                    </li>
                    <li>
                      <b>Dado</b> o painel de conversas, <b>quando</b> clico em uma conversa, <b>então</b> a conta
                      correspondente abre na minha área e as mensagens ficam lidas.
                    </li>
                  </ul>
                </div>
              )}
              {aba === "metrica" && (
                <dl className="ar-prd-metrica">
                  <div>
                    <dt>Métrica</dt>
                    <dd>Tempo para montar o pacote de pagamento (pedido, nota e boleto) de cada conta</dd>
                  </div>
                  <div>
                    <dt>Hoje</dt>
                    <dd>Cerca de 3,5 minutos por nota, validado com o cliente</dd>
                  </div>
                  <div>
                    <dt>Meta</dt>
                    <dd>Até 0,5 minuto por nota, sobrando só a revisão</dd>
                  </div>
                  <div>
                    <dt>Prazo</dt>
                    <dd>Ao fim do piloto</dd>
                  </div>
                  <div>
                    <dt>Como medir</dt>
                    <dd>Horário do primeiro documento até o pacote gerado, registrado no histórico</dd>
                  </div>
                </dl>
              )}
            </div>
            <p className="ar-fonte">
              Trechos reais de um PRD de 43 páginas gerado pela skill num Discovery de 2026. O nome do cliente foi omitido.
            </p>
          </div>

          <div className="ar-doc-notas">
            <figure className="ar-citacao">
              <blockquote>Sem as horas medidas, projetar retorno “levaria a diretoria a decidir com base em ficção”.</blockquote>
              <figcaption>
                Trecho de um Business Case gerado pela skill. Desenhei a skill para recusar estimativa de retorno sem dado
                medido: ela mostra só o valor que dá para medir.
              </figcaption>
            </figure>
            <div className="ar-tempo">
              <span className="rotulo-num">Tempo</span>
              <p>
                <b>~10 h</b> para escrever os dois documentos → <b>até 2 h</b> para ler e validar.
              </p>
              <small>Estimativa: o antes é o tempo do piloto; o depois é o limite que defini para a revisão.</small>
            </div>
          </div>
        </div>

        {/* Adoção: como o time aprendeu, e a prova de que funciona sem a líder. */}
        <div className="ar-bloco">
          <p className="sobrelinha">Adoção</p>
          <h3 className="ar-h3">Ninguém aprendeu em aula.</h3>
          <div className="ar-adocao">
            <ol className="ar-passos">
              <li>
                <span className="rotulo-num">No projeto</span>
                <p>Cada pessoa aprendeu usando as skills no Discovery que pegou, com cliente de verdade.</p>
              </li>
              <li>
                <span className="rotulo-num">A cada 15 dias</span>
                <p>Nas reuniões quinzenais da área, eu mostrava o que tinha evoluído no sistema.</p>
              </li>
              <li>
                <span className="rotulo-num">Criar, não só usar</span>
                <p>
                  Desafiei o time a criar as próprias skills. Saíram assistentes que estimam a parte de Dev e Dados para a
                  precificação.
                </p>
              </li>
              <li>
                <span className="rotulo-num">Na formação</span>
                <p>Mudei a matriz de competências do time de 20 para 26 itens, com um bloco novo de IA e construção de produto.</p>
              </li>
            </ol>
            <div className="ar-conduzidos">
              <p className="rotulo-num">Conduzidos pelas gerentes, com as skills</p>
              <ul>
                {conduzidos.map((c) => (
                  <li key={c.nome} data-ok={c.ok}>
                    <b>{c.nome}</b>
                    <span>{c.status}</span>
                  </li>
                ))}
              </ul>
              <p className="ar-conduzidos-nota">
                O D é o Projeto A lá de cima. Atrasou porque o cliente só respondia por formulário, e ninguém tinha mapeado
                isso antes de fechar. Hoje toda proposta tem uma tabela do que precisamos do cliente. Mesmo assim, ele
                virou contrato de desenvolvimento.
              </p>
            </div>
          </div>

          <figure className="ar-citacao ar-citacao-tiago">
            <blockquote>
              Pô, foi massa. Acho que deu uma independência maior pros meninos. Tá fluindo mais rápido agora essa fase de
              contrato.
            </blockquote>
            <figcaption>Gerente de contas do CITi, que recebe o resultado do Discovery para fechar o contrato.</figcaption>
          </figure>

          {/* As competências em que criei skills foram as que mais subiram na autoavaliação. */}
          <div ref={curva} className="ar-evolucao">
            <div className="ar-evolucao-texto">
              <p className="rotulo-num">O time aprendeu, ou só a IA faz?</p>
              <p>
                Olhei as competências em que criei skills. Em agosto, PRD era a nota mais baixa do time e Business Case, a
                segunda. Em outubro, as duas estão perto de 4, e mapear processos virou a nota mais alta da matriz.
              </p>
            </div>
            <div className="ar-evolucao-grafico">
              <div className="ar-evolucao-legenda" aria-hidden="true">
                {rodadas.map((r) => (
                  <span key={r} data-r={r}>
                    {r}
                  </span>
                ))}
              </div>
              <ul aria-label="Autoavaliação média, de 1 a 5, em agosto, setembro e outubro de 2026">
                {evolucao.map((e) => (
                  <li key={e.item} aria-label={`${e.item}: ${e.valores.map(num).join(", ")}`}>
                    <span className="ar-evolucao-item">{e.item}</span>
                    <span className="ar-evolucao-trilho" aria-hidden="true">
                      <span className="ar-evolucao-competente" />
                      <span
                        className="ar-evolucao-linha"
                        style={{ left: pos(e.valores[0]), width: `calc(${pos(e.valores[2])} - ${pos(e.valores[0])})` }}
                      />
                      {e.valores.map((v, i) => (
                        <span key={rodadas[i]} className="ar-evolucao-ponto" data-r={rodadas[i]} style={{ left: pos(v) }}>
                          {i !== 1 && <em>{num(v)}</em>}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="ar-evolucao-escala" aria-hidden="true">
                <span />
                <div>
                  <span style={{ left: "0%" }}>1</span>
                  <span style={{ left: "50%" }}>3 · faz sozinho</span>
                  <span style={{ left: "100%" }}>5</span>
                </div>
              </div>
            </div>
            <p className="ar-fonte ar-evolucao-fonte">
              Média da autoavaliação da subárea, de 1 a 5, em agosto, setembro e outubro de 2026 (7 respostas em outubro;
              eu não respondo). Duas pessoas saíram no semestre, então as rodadas não comparam exatamente o mesmo grupo. Em
              outubro a matriz passou a ter 26 competências, e os nomes mudaram. É o que o time sente, não uma prova.
            </p>
          </div>
        </div>

        {/* O que ainda não funciona. */}
        <div className="ar-bloco">
          <p className="sobrelinha">Limites</p>
          <h3 className="ar-h3">O que ainda não funciona.</h3>
          <ul className="ar-falta">
            <li>
              <b>O preço ainda passa por mim.</b>
              <p>O agente calcula, mas a aprovação final de cada preço é minha. Enquanto isso não muda, eu sou o gargalo.</p>
            </li>
            <li>
              <b>O cliente demora a responder.</b>
              <p>
                O trabalho do CITi em cada etapa caiu para minutos. O que sobra é a espera pelas respostas do cliente, o
                alvo da próxima versão do agente.
              </p>
            </li>
            <li>
              <b>O time usa IA, mas ainda não se sente seguro construindo com ela.</b>
              <p>
                Em outubro, IA e construção de produto foi a parte da matriz com a menor nota: 3,4 de 5. Construir com IA,
                preparar dados para IA e fluência técnica ficaram em 3,0. No começo, achei que a IA não precisava entrar na
                formação. Errei, e esse é o próximo trabalho.
              </p>
            </li>
            <li>
              <b>O antes é estimativa.</b>
              <p>Os tempos de antes vêm de entrevistas com a gestão anterior. Os de depois, eu cronometrei.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
