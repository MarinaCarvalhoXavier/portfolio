"use client";

import { useEffect, useRef, useState } from "react";

// Título que se escreve letra por letra quando entra na tela.
// O texto completo fica no aria-label; as letras são só visuais.
export function TituloDigitado({
  linhas,
  id,
  className = "",
  velocidade = 12,
}: {
  linhas: string[];
  id?: string;
  className?: string;
  velocidade?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const total = linhas.reduce((n, l) => n + l.length, 0);
  const [visiveis, setVisiveis] = useState(total);
  const [digitando, setDigitando] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisiveis(0);
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setDigitando(true);
        let n = 0;
        const passo = () => {
          n += 1;
          setVisiveis(n);
          if (n < total) timer = window.setTimeout(passo, velocidade + Math.random() * velocidade * 0.8);
          else window.setTimeout(() => setDigitando(false), 1600);
        };
        timer = window.setTimeout(passo, 250);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [total, velocidade]);

  let indice = 0;
  return (
    <h2 ref={ref} id={id} className={className} aria-label={linhas.join(" ")}>
      {linhas.map((linha, i) => (
        <span key={i} className="digitado-linha" aria-hidden="true">
          {linha.split("").map((ch) => {
            const k = indice++;
            const mostrar = k < visiveis;
            const cursorAqui = k === visiveis - 1 || (visiveis === 0 && k === 0);
            return (
              <span key={k} className="digitado-letra" data-visivel={mostrar}>
                {ch}
                {cursorAqui && (digitando || visiveis < total) && <span className="digitado-cursor" />}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}
