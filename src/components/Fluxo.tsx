import type { Papel, Passo } from "@/content/site";

const papelTexto: Record<Papel, string> = { pessoa: "Pessoa", ia: "IA", regra: "Regra" };

/** Quem faz o quê em cada etapa: pessoa, IA ou regra de negócio. */
export function Fluxo({ passos, titulo }: { passos: Passo[]; titulo: string }) {
  return (
    <ol className="fluxo" aria-label={`Fluxo: ${titulo}`}>
      {passos.map((p, i) => (
        <li key={i} className="fluxo-passo" data-papel={p.papel}>
          <span className="fluxo-papel">{papelTexto[p.papel]}</span>
          <span className="fluxo-texto">{p.texto}</span>
        </li>
      ))}
    </ol>
  );
}

export function LegendaFluxo() {
  return (
    <ul className="legenda" aria-label="Legenda dos fluxos">
      <li data-papel="ia">
        <span className="fluxo-papel">IA</span> interpreta
      </li>
      <li data-papel="regra">
        <span className="fluxo-papel">Regra</span> decide valores
      </li>
      <li data-papel="pessoa">
        <span className="fluxo-papel">Pessoa</span> aprova
      </li>
    </ul>
  );
}
