"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

// Projetos menores: 3 cards pequenos que abrem um pop-up com o essencial
// para o avaliador (problema, como a IA foi usada, ferramentas, resultado).
type Projeto = {
  id: string;
  etiqueta: string;
  titulo: string;
  resumo: string;
  problema: string;
  ia: string[];
  ferramentas: string;
  resultado?: string;
  links?: { href: string; rotulo: string }[];
  video?: string; // caminho em /public; com vídeo, o pop-up fica largo
  capa?: string;
};

const projetos: Projeto[] = [
  {
    id: "forma",
    etiqueta: "Site · vídeo com IA",
    titulo: "Forma",
    resumo: "O site de uma arquiteta fictícia, com um passeio em vídeo gerado por IA.",
    problema:
      "Testar até onde dava para levar um site com cara de estúdio usando só IA: código, imagens, vídeo e um formulário inteligente.",
    ia: [
      "Claude Code escreveu e revisou o código, com skills de design e de rolagem.",
      "15 imagens geradas a partir de prompts versionados, para dar para refazer qualquer uma.",
      "9 clipes de vídeo gerados com o Seedance 2.0, que a rolagem da página controla.",
      "No formulário, a Claude API transforma o pedido do visitante num resumo estruturado e validado.",
    ],
    ferramentas: "Claude Code · Claude API · ChatGPT (imagens) · Seedance 2.0 · Next.js",
    resultado: "Os 9 clipes custaram US$ 2,84, sem refações. O site está publicado e tem estudo de caso.",
    links: [
      { href: "https://forma-iota-pink.vercel.app/how-it-was-built", rotulo: "Estudo de caso ↗" },
      { href: "https://github.com/MarinaCarvalhoXavier/forma", rotulo: "GitHub ↗" },
      { href: "https://forma-iota-pink.vercel.app", rotulo: "Ver o site ↗" },
    ],
    video: "/forma/forma-demo-rapido.mp4",
    capa: "/forma/forma-capa-rapido.jpg",
  },
  {
    id: "curadoria",
    etiqueta: "Automação · CITi",
    titulo: "Curadoria semanal",
    resumo: "Toda segunda de manhã, o time recebe 3 conteúdos sobre IA aplicada a produto.",
    problema:
      "O time precisava se atualizar em IA e produto, mas ninguém tinha tempo de garimpar conteúdo bom toda semana.",
    ia: [
      "Toda segunda, uma nova edição aparece sozinha no Notion da subárea, com um vídeo, um artigo e um podcast.",
      "Cada conteúdo vem com um resumo de 2 linhas dizendo por que importa para o dia a dia do time.",
      "O time comenta no que abriu ou curtiu, e esses comentários ajudam a melhorar a curadoria.",
      "Uma tarefa agendada no Claude roda toda segunda: a IA escolhe os conteúdos da semana e escreve os resumos.",
    ],
    ferramentas: "Claude (tarefa agendada) · Notion",
    resultado: "Lançada em novembro de 2026. Ainda sem números de leitura.",
  },
  {
    id: "avaliador",
    etiqueta: "Ferramenta interna · CITi",
    titulo: "Avaliador de Protótipos",
    resumo: "Uma skill que audita protótipos feitos com IA pelas heurísticas de Nielsen.",
    problema:
      "Com a IA, ficou mais rápido gerar telas do que revisar se elas funcionam para quem vai usar.",
    ia: [
      "A skill recebe o protótipo e avalia cada tela pelas 10 heurísticas de Nielsen.",
      "Devolve os problemas por gravidade, com a heurística violada e uma sugestão de correção.",
      "Quem decide o que corrigir é o time: a IA aponta, não muda o protótipo sozinha.",
    ],
    ferramentas: "Claude · Claude Skills",
  },
];

export function OutrosProjetos() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const origem = useRef<HTMLButtonElement | null>(null);
  const fechando = useRef(false);
  const [aberto, setAberto] = useState<Projeto | null>(null);

  const semMovimento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Transformação que leva o pop-up (centralizado) até a posição do card.
  const doCard = () => {
    const d = dialogo.current!.getBoundingClientRect();
    const c = origem.current!.getBoundingClientRect();
    return `translate(${c.left - d.left}px, ${c.top - d.top}px) scale(${c.width / d.width}, ${c.height / d.height})`;
  };

  const abrir = (p: Projeto, botao: HTMLButtonElement) => {
    const d = dialogo.current;
    if (!d) return;
    origem.current = botao;
    flushSync(() => setAberto(p));
    d.showModal();
    if (semMovimento()) return;
    d.animate([{ transform: doCard(), opacity: 0.4 }, { transform: "none", opacity: 1 }], {
      duration: 460,
      easing: "cubic-bezier(.2,.8,.2,1)",
    });
    d.querySelector(".popup-corpo")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 180, fill: "backwards" });
  };

  const fechar = () => {
    const d = dialogo.current;
    if (!d || fechando.current) return;
    if (semMovimento() || !origem.current) {
      d.close();
      return;
    }
    fechando.current = true;
    d.querySelector(".popup-corpo")?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" });
    const anim = d.animate([{ transform: "none", opacity: 1 }, { transform: doCard(), opacity: 0.3 }], {
      duration: 380,
      easing: "cubic-bezier(.5,0,.3,1)",
      fill: "forwards",
    });
    anim.onfinish = () => {
      d.close();
      anim.cancel();
      fechando.current = false;
    };
  };

  return (
    <section id="outros" className="outros" aria-labelledby="outros-titulo">
      <div className="pv-cabeca" data-calor-area>
        <p className="sobrelinha">Outros projetos</p>
        <h2 id="outros-titulo" className="outros-titulo">Menores, mas também com IA</h2>
      </div>

      <ul className="outros-grade">
        {projetos.map((p) => (
          <li key={p.id}>
            <button type="button" className="outro-card" onClick={(e) => abrir(p, e.currentTarget)} aria-haspopup="dialog">
              <span className="sobrelinha">{p.etiqueta}</span>
              <span className="outro-titulo">{p.titulo}</span>
              <span className="outro-resumo">{p.resumo}</span>
              <span className="outro-ver">Ver detalhes +</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogo}
        className={`popup${aberto?.video ? " popup-largo" : ""}`}
        aria-labelledby="popup-titulo"
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
        onCancel={(e) => {
          e.preventDefault();
          fechar();
        }}
        onClose={() => setAberto(null)}
      >
        {aberto && (
          <div className="popup-corpo">
            <div className="popup-topo">
              <span className="sobrelinha">{aberto.etiqueta}</span>
              <button type="button" className="popup-fechar" onClick={fechar} aria-label="Fechar">
                ×
              </button>
            </div>
            <h3 id="popup-titulo" className="popup-titulo">
              {aberto.titulo}
            </h3>
            {aberto.video && (
              <video className="popup-video" width={1280} height={710} src={aberto.video} poster={aberto.capa} autoPlay muted loop playsInline preload="metadata" />
            )}
            <p className="popup-problema">{aberto.problema}</p>

            <h4 className="popup-rotulo">Como a IA foi usada</h4>
            <ul className="popup-ia">
              {aberto.ia.map((linha) => (
                <li key={linha}>{linha}</li>
              ))}
            </ul>

            <dl className="popup-fatos">
              <div>
                <dt>Ferramentas</dt>
                <dd>{aberto.ferramentas}</dd>
              </div>
              {aberto.resultado && (
                <div>
                  <dt>Resultado</dt>
                  <dd>{aberto.resultado}</dd>
                </div>
              )}
            </dl>

            {aberto.links && (
              <div className="popup-links">
                {aberto.links.map((l, i) => (
                  <a
                    key={l.href}
                    className={`popup-link${i > 0 ? " popup-link-contorno" : ""}`}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.rotulo}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
