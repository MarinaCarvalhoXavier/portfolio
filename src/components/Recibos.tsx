"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { recibos, type TipoRecibo } from "@/content/site";

type Ctx = { abrir: (id: string, origem: HTMLElement) => void; aberto: string | null };
const ReciboCtx = createContext<Ctx | null>(null);

const tipoTexto: Record<TipoRecibo, string> = {
  medido: "Medido",
  estimativa: "Estimativa",
  contagem: "Contagem",
};

export function RecibosProvider({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState<string | null>(null);
  const origemRef = useRef<HTMLElement | null>(null);
  const fecharRef = useRef<HTMLButtonElement>(null);

  const abrir = useCallback((id: string, origem: HTMLElement) => {
    origemRef.current = origem;
    setAberto(id);
  }, []);

  const fechar = useCallback(() => {
    setAberto(null);
    origemRef.current?.focus();
  }, []);

  // Link direto para um recibo: /?recibo=contratos
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("recibo");
    if (id && recibos[id]) setAberto(id);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    fecharRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto, fechar]);

  const r = aberto ? recibos[aberto] : null;

  return (
    <ReciboCtx.Provider value={{ abrir, aberto }}>
      {children}
      <div className="recibo-fundo" data-aberto={!!r} onClick={fechar} aria-hidden="true" />
      <aside
        className="recibo"
        role="dialog"
        aria-modal="false"
        aria-labelledby="recibo-titulo"
        data-aberto={!!r}
        hidden={!r}
      >
        {r && (
          <>
            <div className="recibo-topo">
              <span>Recibo</span>
              <button ref={fecharRef} type="button" className="recibo-fechar" onClick={fechar}>
                Fechar
              </button>
            </div>
            <p id="recibo-titulo" className="recibo-valor">
              {r.valor}
            </p>
            <p className="recibo-rotulo">{r.rotulo}</p>
            <dl className="recibo-linhas">
              <div>
                <dt>Tipo</dt>
                <dd>{tipoTexto[r.tipo]}</dd>
              </div>
              <div>
                <dt>Como medi</dt>
                <dd>{r.como}</dd>
              </div>
              <div>
                <dt>Prova</dt>
                <dd>{r.prova}</dd>
              </div>
            </dl>
            <p className="recibo-rodape">Números do CITi citados com autorização do CTO.</p>
          </>
        )}
      </aside>
    </ReciboCtx.Provider>
  );
}

/** Um número marcado no texto. Abre o recibo com a medição e a prova. */
export function Numero({ id, children }: { id: string; children?: React.ReactNode }) {
  const ctx = useContext(ReciboCtx);
  const r = recibos[id];
  if (!ctx || !r) return <>{children ?? r?.valor}</>;
  return (
    <button
      type="button"
      className="numero"
      aria-haspopup="dialog"
      aria-expanded={ctx.aberto === id}
      onClick={(e) => ctx.abrir(id, e.currentTarget)}
    >
      {children ?? r.valor}
    </button>
  );
}

/** Cartão de métrica dentro de um case. */
export function MetricaCartao({ id }: { id: string }) {
  const ctx = useContext(ReciboCtx);
  const r = recibos[id];
  if (!r) return null;
  return (
    <button
      type="button"
      className="metrica"
      aria-haspopup="dialog"
      aria-expanded={ctx?.aberto === id}
      onClick={(e) => ctx?.abrir(id, e.currentTarget)}
    >
      <span className="metrica-valor">{r.valor}</span>
      <span className="metrica-rotulo">{r.rotulo}</span>
      <span className="metrica-acao">Ver como medi</span>
    </button>
  );
}
