"use client";

import { useState } from "react";
import { TituloDigitado } from "@/components/TituloDigitado";
import { Pilula } from "@/components/Pilula";

const EMAIL = "marinacvxavier06@gmail.com";

// Ficha técnica. "Feito em" chega pronto da página (calculado na publicação, não no navegador).
const fichaFixa = [
  { rotulo: "Código", valor: "Escrito pelo Claude Code, com direção e revisão minhas" },
  { rotulo: "Versões descartadas", valor: "4 antes desta" },
  { rotulo: "Fundo térmico", valor: "Shader WebGL escrito do zero" },
  { rotulo: "Componentes", valor: "MicroSlats e CircularCarousel (React Bits)" },
  { rotulo: "Tipografia", valor: "Tanker, Switzer e Martian Mono" },
];
const LINKEDIN = "https://www.linkedin.com/in/marina-xavier-109bb7287/";

export function SecaoHistoria() {
  return (
    <section id="historia" className="historia" aria-labelledby="historia-titulo" data-calor-linha="topo">
      <div className="pv-cabeca" data-calor-area>
        <p className="sobrelinha">Minha história</p>
        <TituloDigitado
          id="historia-titulo"
          className="area-titulo"
          linhas={["Designer de formação,", "builder por teimosia."]}
        />
      </div>

      <div className="historia-corpo">
        <div className="historia-texto">
          <p>
            Entrei no CITi para me desenvolver em UX/UI. Logo no começo, ver o que o time de engenharia construía
            parecia outro mundo: eu não vinha de ensino técnico e não sabia programar.
          </p>
          <p>
            Mas eu trazia outra bagagem: visão de negócio, métricas, estratégia e os fundamentos do design.
            Conectando essas pontas, fui para a linha de frente estruturar a subárea de Produto.
          </p>
          <p>
            O obstáculo era a dependência técnica. Minhas ideias paravam na viabilidade ou no tempo de execução de
            outra pessoa. A IA mudou isso: me deixou acompanhar o ritmo do time e acabou com a distância entre pensar
            e executar.
          </p>
          <p>Hoje eu tiro ideias do papel sozinha, juntando negócio, produto e tecnologia.</p>
        </div>
        <aside className="historia-lado">
          <p className="historia-citacao">
            “Tudo tem que ter um motivo, um teste por trás e uma métrica.”
          </p>
          <dl className="historia-fatos">
            <div data-calor-linha="topo">
              <dt>Lidero</dt>
              <dd>A subárea de Produto do CITi: um time de 10 pessoas (2 gerentes, 3 especialistas e 5 analistas)</dd>
            </div>
            <div data-calor-linha="topo">
              <dt>No CITi</dt>
              <dd>Entrei como Product Designer (jan a jun/2026) e fui promovida a Líder de Produto em jun/2026</dd>
            </div>
            <div data-calor-linha="topo">
              <dt>Antes</dt>
              <dd>Estágio em UX/UI na WA.Technology (jan a jul/2025): interfaces para clientes B2B e liderei a adoção de IA no time de design</dd>
            </div>
            <div data-calor-linha="topo">
              <dt>Estudo</dt>
              <dd>Design na UFPE, formatura em jul/2028</dd>
            </div>
            <div data-calor-linha="topo">
              <dt>Idiomas</dt>
              <dd>Português nativo · inglês fluente</dd>
            </div>
            <div data-calor-linha="topo">
              <dt>Construo com</dt>
              <dd>Claude, Claude Code, n8n, Next.js, Supabase +</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

export function SecaoContato({ feitoEm }: { feitoEm: string }) {
  const ficha = [{ rotulo: "Feito em", valor: feitoEm }, ...fichaFixa];
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contato" className="contato" aria-labelledby="contato-titulo" data-calor-linha="topo">
      <div className="pv-cabeca" data-calor-area>
        <p className="sobrelinha">Contato</p>
        <TituloDigitado id="contato-titulo" className="contato-titulo" linhas={["Vamos conversar?"]} />
        <p className="area-lead">Respondo em até um dia. Sem agente no meio.</p>
      </div>

      <div className="contato-acoes">
        <button type="button" className="contato-email" onClick={copiar}>
          <span>{EMAIL}</span>
          <span className="contato-dica" aria-live="polite">
            {copiado ? "Copiado" : "Clique para copiar"}
          </span>
        </button>
        <div className="contato-botoes">
          <Pilula href={`mailto:${EMAIL}`} cheia>
            Mandar e-mail
          </Pilula>
          <Pilula href={LINKEDIN}>LinkedIn ↗</Pilula>
        </div>
      </div>

      <footer className="rodape">
        <p className="sobrelinha">Ficha técnica deste site</p>
        <dl className="ficha-tecnica">
          {ficha.map((f) => (
            <div key={f.rotulo}>
              <dt>{f.rotulo}</dt>
              <dd>{f.valor}</dd>
            </div>
          ))}
        </dl>
        <div className="rodape-base">
          <span>Marina Xavier · Recife, 2026</span>
          <span>Café consumido: não medido. Todo o resto, sim.</span>
        </div>
      </footer>
    </section>
  );
}
