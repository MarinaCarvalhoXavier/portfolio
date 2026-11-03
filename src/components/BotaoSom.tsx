"use client";

import { useEffect, useState } from "react";
import { carregarSom, ligarSom, tocarClique } from "@/lib/som";

// Botão de som da navbar. Desligado por padrão. Com o som ligado, links e botões fazem um clique curto.
export function BotaoSom() {
  const [ligado, setLigado] = useState(false);

  useEffect(() => {
    setLigado(carregarSom());
    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as HTMLElement | null)?.closest("a, button");
      if (alvo && !alvo.classList.contains("botao-som")) tocarClique();
    };
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return (
    <button
      type="button"
      className="botao-som"
      aria-pressed={ligado}
      aria-label={ligado ? "Desligar sons" : "Ligar sons"}
      title={ligado ? "Desligar sons" : "Ligar sons"}
      onClick={() => { ligarSom(!ligado); setLigado(!ligado); }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {ligado ? <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></> : <><path d="m16 9 5 6" /><path d="m21 9-5 6" /></>}
      </svg>
    </button>
  );
}
