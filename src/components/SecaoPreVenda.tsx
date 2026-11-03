"use client";

import { useEffect, useRef, useState } from "react";
import { TituloDigitado } from "@/components/TituloDigitado";

// Exemplos reais do Banco de métricas, anonimizados (sem nome de cliente).
const riscos = [
  { texto: "Cliente recusou a etapa de discovery", minuto: null },
  { texto: "Sem orçamento: “não tem dinheiro, então faça o que puder”", minuto: "40:24" },
  { texto: "Dados de saúde de crianças (LGPD)", minuto: null },
];

function useAparecer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisivel(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visivel };
}

// Escala do gráfico de preço: R$ 6.500 a R$ 11.500.
const pos = (v: number) => `${((v - 6500) / 5000) * 100}%`;

export function SecaoPreVenda() {
  const ficha = useAparecer<HTMLDivElement>();
  const grafico = useAparecer<HTMLDivElement>();

  return (
    <section id="pre-venda" className="pv" aria-labelledby="pv-titulo" data-calor-linha="topo">
      <div className="pv-cabeca" data-calor-area>
        <p className="sobrelinha">Case · Agente de pré-venda</p>
        <TituloDigitado
          id="pv-titulo"
          className="area-titulo"
          linhas={["A IA lê a reunião.", "A regra decide o preço."]}
        />
      </div>

      <div className="pv-grade">
        <article className="pv-bloco">
          <div className="pv-bloco-intro">
          <h3 className="pv-bloco-titulo">Um lead barrado antes de virar problema</h3>
          <p className="pv-bloco-texto">
            Uma empresa de saúde infantil queria um projeto sem passar pelo discovery. O agente leu a reunião e
            recomendou voltar ao Comercial antes de qualquer proposta.
          </p>
          </div>

          <div ref={ficha.ref} className="ficha" data-visivel={ficha.visivel}>
            <div className="ficha-topo">
              <span className="ficha-rotulo">Triagem · lead anonimizado</span>
              <span className="ficha-veredito">Voltar ao Comercial</span>
            </div>
            <ul className="ficha-riscos">
              {riscos.map((r, i) => (
                <li key={r.texto} style={{ transitionDelay: `${300 + i * 260}ms` }}>
                  <span className="ficha-sinal" aria-label="Risco alto" />
                  <span>{r.texto}</span>
                  {r.minuto && <span className="ficha-minuto">{r.minuto}</span>}
                </li>
              ))}
            </ul>
            <p className="ficha-regra">Criticidade alta pela regra: 3 ou mais fatores de risco.</p>
          </div>
        </article>

        <article className="pv-bloco">
          <div className="pv-bloco-intro">
          <h3 className="pv-bloco-titulo">O mesmo lead, o mesmo preço</h3>
          <p className="pv-bloco-texto">
            Na primeira versão, o agente dava preços diferentes para a mesma reunião. Tirei a decisão da IA: ela
            passou a responder só critérios objetivos, e o código calcula semanas, time e valor.
          </p>
          </div>

          <div ref={grafico.ref} className="preco" data-visivel={grafico.visivel}>
            <div className="preco-linha">
              <span className="preco-rotulo">Antes</span>
              <div className="preco-trilho">
                <span className="preco-faixa" style={{ left: pos(7000), width: `calc(${pos(10900)} - ${pos(7000)})` }} />
                <span className="preco-valor" style={{ left: pos(7000) }}>R$ 7.000</span>
                <span className="preco-valor preco-valor-dir" style={{ left: pos(10900) }}>R$ 10.900</span>
              </div>
            </div>
            <div className="preco-linha">
              <span className="preco-rotulo">Depois</span>
              <div className="preco-trilho">
                <span className="preco-ponto" style={{ left: pos(8700) }} />
                <span className="preco-valor preco-valor-quente" style={{ left: pos(8700) }}>R$ 8.700 em todas as rodadas</span>
              </div>
            </div>
            <p className="ficha-regra">
              R$ 8.700 era a decisão real: 4 pessoas por 4 semanas. Falta testar nos outros diagnósticos.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
