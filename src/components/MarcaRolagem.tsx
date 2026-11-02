"use client";

import { useEffect } from "react";

// Marca no <html> quando a página já passou do topo, para o menu ganhar fundo.
export function MarcaRolagem() {
  useEffect(() => {
    const atualizar = () => {
      const passou = window.scrollY > window.innerHeight * 0.85;
      document.documentElement.toggleAttribute("data-rolou", passou);
    };
    // Marca no menu a seção que está na tela (Início, Minha história).
    const itens = Array.from(document.querySelectorAll<HTMLElement>("[data-secao]"));
    const secoes = itens
      .map((el) => document.getElementById(el.dataset.secao || ""))
      .filter((s): s is HTMLElement => !!s);
    const marcarSecao = () => {
      const meio = window.innerHeight * 0.4;
      let atual = "";
      for (const s of secoes) {
        const r = s.getBoundingClientRect();
        if (r.top <= meio && r.bottom > meio) atual = s.id;
      }
      itens.forEach((el) => {
        if (el.dataset.secao === atual) el.setAttribute("aria-current", "location");
        else el.removeAttribute("aria-current");
      });
    };
    const aoRolar = () => {
      atualizar();
      marcarSecao();
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);
  return null;
}
