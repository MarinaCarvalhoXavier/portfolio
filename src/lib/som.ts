// Som do portfólio, gerado no navegador (Web Audio): nada para baixar.
// Começa LIGADO; a pessoa desliga pelo botão de som da navbar. A escolha fica salva neste navegador
// e é repassada para a demo embutida no case de reclamações (evento "som-mudou").
// Cada tipo de ação tem um timbre próprio, para os cliques não soarem todos iguais.

export type TipoSom = "nav" | "case" | "abrir" | "fechar" | "aba" | "externo" | "ligar" | "desligar" | "clique";

let ctx: AudioContext | null = null;
let ligado = false;

export function somLigado() { return ligado; }

export function ligarSom(v: boolean) {
  if (!v) tocar("desligar", true);
  ligado = v;
  try { localStorage.setItem("portfolio-som", v ? "1" : "0"); } catch {}
  window.dispatchEvent(new CustomEvent("som-mudou", { detail: v }));
  if (v) tocar("ligar");
}

export function carregarSom() {
  // Sem escolha salva = ligado.
  try { ligado = localStorage.getItem("portfolio-som") !== "0"; } catch {}
  return ligado;
}

// Uma nota: frequência inicial → final, volume, duração e início (em s, relativo a agora).
function nota(c: AudioContext, o: { f: number; f2?: number; vol: number; dur: number; em?: number; tipo?: OscillatorType }) {
  const t = c.currentTime + (o.em ?? 0);
  const osc = c.createOscillator(), g = c.createGain();
  osc.type = o.tipo ?? "sine";
  osc.frequency.setValueAtTime(o.f, t);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur * 0.8);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  osc.connect(g).connect(c.destination);
  osc.start(t); osc.stop(t + o.dur + 0.02);
}

// Sopro curto de ruído filtrado (para o "abrir case", que é uma mudança de página).
function sopro(c: AudioContext, o: { de: number; ate: number; vol: number; dur: number }) {
  const t = c.currentTime;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * o.dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  src.buffer = buf;
  f.type = "bandpass"; f.Q.value = 1.2;
  f.frequency.setValueAtTime(o.de, t);
  f.frequency.exponentialRampToValueAtTime(o.ate, t + o.dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.vol, t + o.dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t); src.stop(t + o.dur);
}

export function tocar(tipo: TipoSom, forcar = false) {
  if ((!ligado && !forcar) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const c = ctx;
    switch (tipo) {
      case "nav": // navbar: tique leve e agudo, como tocar numa régua
        nota(c, { f: 1500, f2: 1200, vol: 0.045, dur: 0.03 });
        break;
      case "case": // card de case: sopro subindo + nota grave, sensação de "entrar"
        sopro(c, { de: 500, ate: 2200, vol: 0.080, dur: 0.22 });
        nota(c, { f: 330, f2: 440, vol: 0.056, dur: 0.18, em: 0.04, tipo: "triangle" });
        break;
      case "abrir": // abre popup/recibo: "pop" que sobe
        nota(c, { f: 420, f2: 900, vol: 0.064, dur: 0.09 });
        break;
      case "fechar": // fecha popup/recibo: "pop" que desce
        nota(c, { f: 800, f2: 380, vol: 0.056, dur: 0.09 });
        break;
      case "aba": // troca de aba: tique de madeira, mais grave e seco
        nota(c, { f: 620, f2: 560, vol: 0.064, dur: 0.035, tipo: "triangle" });
        break;
      case "externo": // link que sai do site: duas notas subindo rápido
        nota(c, { f: 880, vol: 0.035, dur: 0.06 });
        nota(c, { f: 1320, vol: 0.032, dur: 0.08, em: 0.05 });
        break;
      case "ligar": // botão de som ligando
        nota(c, { f: 523, vol: 0.048, dur: 0.1 });
        nota(c, { f: 784, vol: 0.048, dur: 0.14, em: 0.07 });
        break;
      case "desligar":
        nota(c, { f: 784, vol: 0.040, dur: 0.08 });
        nota(c, { f: 523, vol: 0.040, dur: 0.12, em: 0.06 });
        break;
      default: // qualquer outro botão/link
        nota(c, { f: 1000, f2: 700, vol: 0.042, dur: 0.04 });
    }
  } catch {}
}

// Decide o som pelo elemento clicado.
export function tipoDoAlvo(el: HTMLElement): TipoSom {
  if (el.closest(".topo nav, .marca")) return "nav";
  if (el.matches(".card")) return "case";
  if (el.matches(".popup-fechar, .recibo-fechar")) return "fechar";
  if (el.matches(".outro-card, [aria-haspopup]")) return "abrir";
  if (el.matches("[role='tab']") || el.closest("[role='tablist']")) return "aba";
  if (el.matches("a[target='_blank'], a[href^='mailto:']")) return "externo";
  return "clique";
}

// Mantido por compatibilidade.
export function tocarClique() { tocar("clique"); }
