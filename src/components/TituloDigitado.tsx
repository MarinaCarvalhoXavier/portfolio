"use client";

import { useEffect, useRef, useState } from "react";

// Título que se escreve letra por letra quando entra na tela.
// Mesmo ritmo dos itens de "Minha história": cada linha se escreve inteira em 0,5 s,
// com 0,1 s de pausa antes da próxima. O texto completo fica no aria-label; as letras são só visuais.
const DURACAO_LINHA = 500;
const PAUSA_LINHAS = 100;
export function TituloDigitado({
  linhas,
  id,
  className = "",
}: {
  linhas: string[];
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const total = linhas.reduce((n, l) => n + l.length, 0);
  const chave = linhas.join("\n");
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
        // Momento (ms) em que cada letra aparece, a partir do início.
        const momentos: number[] = [];
        let t = 0;
        chave.split("\n").forEach((l, i) => {
          if (i > 0) t += PAUSA_LINHAS;
          const passo = DURACAO_LINHA / Math.max(l.length, 1);
          for (let j = 1; j <= l.length; j++) momentos.push(t + passo * j);
          t += DURACAO_LINHA;
        });
        const inicio = performance.now() + 250;
        let n = 0;
        const avanca = () => {
          const agora = performance.now() - inicio;
          while (n < total && momentos[n] <= agora) n += 1;
          setVisiveis(n);
          if (n < total) timer = window.setTimeout(avanca, Math.max(0, momentos[n] - agora));
          else window.setTimeout(() => setDigitando(false), 1600);
        };
        timer = window.setTimeout(avanca, 250);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [total, chave]);

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
