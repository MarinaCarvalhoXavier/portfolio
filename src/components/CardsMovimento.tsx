"use client";

import { useEffect } from "react";

// Marca os cards dos cases conforme a rolagem:
// data-preso = o card já grudou no topo (inclina);
// data-ativo = é o card da vez, o de cima da pilha (borda laranja brilhando).
export function CardsMovimento() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".cards .card"));
    if (!cards.length) return;

    const atualizar = () => {
      const desktop = window.innerWidth > 900;
      let ativo = -1;
      cards.forEach((card, i) => {
        const topo = parseFloat(getComputedStyle(card).top) || 0;
        const preso = desktop && card.getBoundingClientRect().top <= topo + 1;
        card.toggleAttribute("data-preso", preso);
        if (preso) ativo = i;
      });
      cards.forEach((card, i) => card.toggleAttribute("data-ativo", i === ativo));
    };

    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      window.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, []);

  return null;
}
