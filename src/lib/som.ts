// Som do portfólio, gerado no navegador (Web Audio): nada para baixar.
// Começa DESLIGADO; liga pelo botão de som da navbar. A escolha fica salva neste navegador
// e é repassada para a demo embutida no case de reclamações (evento "som-mudou").

let ctx: AudioContext | null = null;
let ligado = false;

export function somLigado() { return ligado; }

export function ligarSom(v: boolean) {
  ligado = v;
  try { localStorage.setItem("portfolio-som", v ? "1" : "0"); } catch {}
  window.dispatchEvent(new CustomEvent("som-mudou", { detail: v }));
  if (v) tocarClique();
}

export function carregarSom() {
  try { ligado = localStorage.getItem("portfolio-som") === "1"; } catch {}
  return ligado;
}

export function tocarClique() {
  if (!ligado || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.type = "sine";
    o.frequency.setValueAtTime(1000, t);
    o.frequency.exponentialRampToValueAtTime(700, t + 0.035);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.03, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.06);
  } catch {}
}
