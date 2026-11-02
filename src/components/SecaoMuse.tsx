"use client";

import { useState } from "react";
import CircularCarouselJS from "@/components/reactbits/CircularCarousel";
import { TituloDigitado } from "@/components/TituloDigitado";
import { Pilula } from "@/components/Pilula";
import { Fluxo } from "@/components/Fluxo";
import type { Passo } from "@/content/site";

// O componente do React Bits é JS; as props opcionais vêm do preset.
const CircularCarousel = CircularCarouselJS as unknown as React.ComponentType<Record<string, unknown>>;

// Fonte de tudo aqui: README do projeto (github.com/MarinaCarvalhoXavier/muse-app) e vídeo de demo.
const telas = [
  { src: "/muse/muse-tela-1.jpg", title: "Muita roupa, sempre os mesmos looks", subtitle: "Armário" },
  { src: "/muse/muse-tela-2.jpg", title: "Tiro foto do jeito que der", subtitle: "Cadastro" },
  { src: "/muse/muse-tela-3.jpg", title: "A IA tira o fundo e monta a vitrine", subtitle: "Vitrine" },
  { src: "/muse/muse-tela-4.jpg", title: "Outra IA confere se a peça continua igual", subtitle: "Verificador" },
  { src: "/muse/muse-tela-5.jpg", title: "O Claude sugere tipo, cor e ocasião", subtitle: "Preenchimento" },
  { src: "/muse/muse-tela-6.jpg", title: "Monto looks como uma colagem", subtitle: "Editor" },
  { src: "/muse/muse-tela-7.jpg", title: "Marco o que usei no dia", subtitle: "Looks" },
  { src: "/muse/muse-tela-8.jpg", title: "Vejo quanto do armário eu realmente uso", subtitle: "Perfil" },
  { src: "/muse/muse-tela-9.jpg", title: "O Stylist sugere looks só com o que eu tenho", subtitle: "Stylist IA" },
].map((t) => ({ ...t, alt: `Tela do MUSE: ${t.title}` }));

const provas = [
  { pede: "Demos construídas do zero em dias", mostra: "~16 a 20 h da discovery ao app publicado, construído sozinha" },
  { pede: "Orquestração de agentes (Claude, GPT, Gemini)", mostra: "O Claude confere cada imagem que o Gemini gera, e reprova o que mudou a peça" },
  { pede: "Vibe coding e APIs sem backend profundo", mostra: "Claude Code, Claude API, fal.ai, Photoroom e Supabase conversando entre si" },
];

type Dado = { texto: string; fonte: string; href: string };
const processo: { etapa: string; texto: string; dados?: Dado[] }[] = [
  {
    etapa: "Discovery",
    texto:
      "A estatística popular diz que usamos só ~20% do armário. Os dados medidos são piores. Separei duas dores: não lembrar o que tem e não ter energia para combinar.",
    dados: [
      {
        texto: "73% das roupas no Reino Unido ficaram sem uso no último ano. Na Bélgica, as pessoas achavam que eram 26%; eram 88%.",
        fonte: "Movinga, 18 mil lares em 20 países (2018)",
        href: "https://fashionunited.uk/news/fashion/people-do-not-wear-at-least-50-percent-of-their-wardrobes-according-to-study/2018081638356",
      },
      {
        texto: "Mulheres passam quase 20 minutos por dia escolhendo roupa, e mais de 60% têm crises na hora de se vestir.",
        fonte: "Marks & Spencer (2016)",
        href: "https://www.hellomagazine.com/fashion/news/451466/women-six-months-deciding-what-wear/",
      },
    ],
  },
  {
    etapa: "Decisões",
    texto:
      "Na pesquisa, a usuária usa a IA como ponto de partida e ajusta. Por isso o Stylist troca peça por peça, e todo campo que a IA preenche é editável.",
  },
  {
    etapa: "Construção",
    texto:
      "Comecei manual (V1), depois a IA preencheu e montou a vitrine (V2) e só então veio o Stylist (V3), quando o armário já tinha dados bons.",
  },
];

type PontoIA = { nome: string; faz: string; trava: string; custo: string; fluxo: Passo[] };
const pontosIA: PontoIA[] = [
  {
    nome: "Vitrine + verificador",
    faz: "Transforma a foto da peça (no espelho, na cama, no cabide) numa imagem de catálogo, com manequim invisível.",
    trava:
      "O Claude compara a vitrine com a foto original e reprova se a cor ou o comprimento mudou, ou se apareceu um corpo. Reprovou: tenta um modelo melhor. Nada passou: usa um recorte fiel da foto real.",
    custo: "~US$ 0,04 por peça (~US$ 0,15 quando precisa do modelo melhor)",
    fluxo: [
      { papel: "pessoa", texto: "Tiro a foto da peça" },
      { papel: "ia", texto: "Gemini gera a vitrine" },
      { papel: "ia", texto: "Claude confere com a original" },
      { papel: "regra", texto: "Reprovou? Modelo melhor ou recorte fiel" },
    ],
  },
  {
    nome: "Preenchimento",
    faz: "Lê a foto e sugere tipo, subtipo, ocasião, peso e cores da peça em ~2 s, enquanto a vitrine é gerada.",
    trava:
      "Só aceita valores das listas do app, com cores de uma paleta com nomes. Nada vem marcado por padrão: se a IA errar, eu percebo antes de salvar.",
    custo: "Fração de centavo por peça (Claude Haiku)",
    fluxo: [
      { papel: "ia", texto: "Claude lê a foto" },
      { papel: "regra", texto: "Só valores da lista passam" },
      { papel: "pessoa", texto: "Eu reviso e salvo" },
    ],
  },
  {
    nome: "Recorte nos looks",
    faz: "Remove o fundo de cada peça no editor de looks, para as peças se sobreporem como numa colagem.",
    trava: "Cada foto é recortada uma vez só e o recorte é guardado. O mesmo recorte serve para todos os looks.",
    custo: "Fração de centavo, uma vez por foto",
    fluxo: [
      { papel: "ia", texto: "BiRefNet recorta a peça" },
      { papel: "regra", texto: "Guarda e reaproveita" },
    ],
  },
  {
    nome: "Stylist IA",
    faz: "Monta até 3 looks a partir de uma ocasião ou de um pedido livre, só com as peças do meu armário.",
    trava:
      "O armário vai como texto (sem imagens), o que deixa a chamada barata e rápida. O servidor descarta qualquer peça que não exista: a IA não inventa roupa.",
    custo: "Fração de centavo por sugestão (Claude Haiku)",
    fluxo: [
      { papel: "pessoa", texto: "Peço um look" },
      { papel: "ia", texto: "Claude monta com ids do armário" },
      { papel: "regra", texto: "Servidor descarta peça inexistente" },
      { papel: "pessoa", texto: "Troco peça por peça e salvo" },
    ],
  },
];

const problemas = [
  {
    titulo: "A IA inventava a peça",
    antes: "Um modelo de imagem alongou um short e chegou a desenhar um corpo vestindo a roupa.",
    depois:
      "Comparei 3 modelos com fotos reais, reescrevi a instrução e coloquei o Claude como verificador, com o recorte fiel como rede de segurança.",
  },
  {
    titulo: "O verificador era rígido demais",
    antes: "Ele reprovava vitrines boas por detalhes de bolso.",
    depois: "Recalibrei para reprovar só erros graves. Um verificador também é uma IA e também erra.",
  },
  {
    titulo: "Cadastrar uma peça era lento",
    antes: "~17 s de espera no celular até poder salvar.",
    depois:
      "Medi cada etapa, rodei a IA em paralelo e reduzi o peso das fotos. Hoje: campos em ~2 s e ~10 s até salvar, medido no iPhone.",
  },
];

export function SecaoMuse() {
  const [ponto, setPonto] = useState(0);
  const p = pontosIA[ponto];

  return (
    <section id="muse" className="musa" aria-labelledby="muse-titulo" data-calor-linha="topo">
      <div className="pv-cabeca" data-calor-area>
        <p className="sobrelinha">Case · MUSE, o primeiro que fiz sozinha</p>
        <TituloDigitado id="muse-titulo" className="area-titulo" linhas={["Um app do zero,", "sem saber programar."]} />
        <p className="area-lead">
          Um guarda-roupa com IA: tiro foto de uma roupa, a IA cadastra e monta a vitrine, e um stylist sugere
          looks só com o que eu já tenho. Fiz sozinha, da discovery ao app publicado, com o Claude como par de
          programação.
        </p>
        <div className="muse-cta">
          <Pilula href="https://muse-app-sooty.vercel.app" destaque>
            Abrir o app ↗
          </Pilula>
        </div>
      </div>

      <ul className="provas provas-case" aria-label="O que este case prova para a vaga">
        {provas.map((pr) => (
          <li key={pr.pede}>
            <span className="prova-pede">{pr.pede}</span>
            <span className="prova-mostra">{pr.mostra}</span>
          </li>
        ))}
      </ul>

      <div className="musa-carrossel">
        <CircularCarousel
          items={telas}
          preset="cylinder"
          intro="rise"
          cardWidth={230}
          aspectRatio={0.46}
          gap={28}
          speed={10}
          fadeColor="#000000"
          depthFade={0.7}
          cornerRadius={18}
          captions
        />
      </div>

      <div className="muse-bloco">
        <h3 className="construi-titulo">Do problema ao app</h3>
        <ol className="muse-processo">
          {processo.map((pr, i) => (
            <li key={pr.etapa} data-calor-linha="topo">
              <span className="sobrelinha">
                {String(i + 1).padStart(2, "0")} · {pr.etapa}
              </span>
              <p>{pr.texto}</p>
              {pr.dados && (
                <ul className="muse-dados">
                  {pr.dados.map((d) => (
                    <li key={d.fonte}>
                      <span>{d.texto}</span>
                      <a href={d.href} target="_blank" rel="noreferrer">
                        {d.fonte} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="muse-bloco">
        <h3 className="construi-titulo">Como a IA trabalha no app</h3>
        <div className="muse-abas" role="tablist" aria-label="Pontos de IA do MUSE">
          {pontosIA.map((pt, i) => (
            <button
              key={pt.nome}
              type="button"
              role="tab"
              id={`muse-aba-${i}`}
              aria-selected={i === ponto}
              aria-controls="muse-painel"
              onClick={() => setPonto(i)}
            >
              {pt.nome}
            </button>
          ))}
        </div>
        <div className="muse-painel" id="muse-painel" role="tabpanel" aria-labelledby={`muse-aba-${ponto}`} key={ponto}>
          <dl className="muse-detalhes">
            <div>
              <dt>O que faz</dt>
              <dd>{p.faz}</dd>
            </div>
            <div>
              <dt>A trava</dt>
              <dd>{p.trava}</dd>
            </div>
            <div>
              <dt>Custo</dt>
              <dd>{p.custo}</dd>
            </div>
          </dl>
          <div className="muse-fluxo">
            <p className="sobrelinha">Quem faz o quê</p>
            <Fluxo passos={p.fluxo} titulo={p.nome} />
          </div>
        </div>
      </div>

      <div className="muse-bloco">
        <h3 className="construi-titulo">O que deu errado e como resolvi</h3>
        <ul className="muse-problemas">
          {problemas.map((pr) => (
            <li key={pr.titulo} data-calor-linha="topo">
              <strong>{pr.titulo}</strong>
              <p>
                <span className="muse-rotulo">Antes</span>
                {pr.antes}
              </p>
              <p>
                <span className="muse-rotulo muse-rotulo-quente">Depois</span>
                {pr.depois}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="musa-rodape">
        <ul className="musa-fatos">
          <li>
            <span>~16 a 20 h</span> para construir
          </li>
          <li>
            <span>~US$ 0,12</span> de Claude API desde o início
          </li>
          <li>
            <span>No ar</span> e em uso no meu iPhone
          </li>
        </ul>
        <div className="contato-botoes">
          <Pilula href="https://muse-app-sooty.vercel.app" destaque>
            Abrir o app ↗
          </Pilula>
          <Pilula href="https://github.com/MarinaCarvalhoXavier/muse-app">GitHub ↗</Pilula>
        </div>
      </div>
    </section>
  );
}
