"use client";

import { useEffect, useRef } from "react";

// Mancha térmica que aparece só nas letras dos títulos e cabeçalhos dos cases.
// Uma camada fixa sobre a página desenha a mancha em branco + cores térmicas,
// com mix-blend-mode: multiply. Branco não altera nada, o preto continua preto,
// e só o texto claro ganha as cores. A mancha nasce sobre [data-calor-area].

const vert = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const frag = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uTrail;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
vec3 rampa(float t) {
  vec3 c1 = vec3(0.540, 0.170, 0.560);
  vec3 c2 = vec3(0.890, 0.270, 0.360);
  vec3 c3 = vec3(1.000, 0.480, 0.240);
  vec3 c4 = vec3(1.000, 0.910, 0.690);
  if (t < 0.4) return mix(c1, c2, t / 0.4);
  if (t < 0.7) return mix(c2, c3, (t - 0.4) / 0.3);
  return mix(c3, c4, clamp((t - 0.7) / 0.3, 0.0, 1.0));
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 q = vec2(uv.x * uRes.x / uRes.y, uv.y);
  float h = texture2D(uTrail, uv).a;
  float n = fbm(q * 3.2 + vec2(0.0, -uTime * 0.2));
  float hh = clamp(h * (0.72 + 0.6 * n) * 1.25, 0.0, 1.0);
  float presenca = smoothstep(0.06, 0.2, hh);
  vec3 col = mix(vec3(1.0), rampa(hh), presenca);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function CalorNosTitulos() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const ESCALA = 0.25;
    const rastro = document.createElement("canvas");
    const rctx = rastro.getContext("2d")!;
    const copia = document.createElement("canvas");
    const cctx = copia.getContext("2d")!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      rastro.width = copia.width = Math.max(1, Math.round(window.innerWidth * ESCALA));
      rastro.height = copia.height = Math.max(1, Math.round(window.innerHeight * ESCALA));
      gl.viewport(0, 0, canvas.width, canvas.height);
      acordar();
    };

    const alvo = { x: 0, y: 0 };
    const bola = { x: 0, y: 0 };
    let ativo = false; // cursor sobre um título
    let calorRestante = 0; // quadros até o rastro esfriar
    let primeira = true;
    let raf = 0;
    let ultimoScroll = window.scrollY;

    const RAIO = 110;
    const carimbo = (x: number, y: number, forca: number) => {
      const rx = x * ESCALA, ry = y * ESCALA, rr = RAIO * ESCALA;
      const g = rctx.createRadialGradient(rx, ry, 0, rx, ry, rr);
      g.addColorStop(0, `rgba(255,255,255,${forca})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      rctx.fillStyle = g;
      rctx.beginPath();
      rctx.arc(rx, ry, rr, 0, Math.PI * 2);
      rctx.fill();
    };

    // Regiões que podem esquentar: cabeçalhos inteiros e a espessura das linhas.
    type Regiao = { x: number; y: number; w: number; h: number; linha: boolean };
    const regioes = (): Regiao[] => {
      const out: Regiao[] = [];
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-calor-area]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        out.push({ x: r.left, y: r.top, w: r.width, h: r.height, linha: false });
      });
      document.querySelectorAll<HTMLElement>("[data-calor-linha]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const y = el.dataset.calorLinha === "base" ? r.bottom - 2 : r.top;
        if (y < -4 || y > vh + 4) return;
        out.push({ x: r.left, y: y - 1, w: r.width, h: 4, linha: true });
      });
      return out;
    };
    const pertoDeLinha = (x: number, y: number) =>
      regioes().some((r) => r.linha && x > r.x - RAIO && x < r.x + r.w + RAIO && Math.abs(y - (r.y + 2)) < RAIO * 0.8);

    const inicio = performance.now();
    function quadro(agora: number) {
      raf = 0;
      const px = bola.x, py = bola.y;
      bola.x += (alvo.x - bola.x) * 0.14;
      bola.y += (alvo.y - bola.y) * 0.14;

      rctx.globalCompositeOperation = "destination-out";
      rctx.fillStyle = "rgba(0,0,0,0.022)";
      rctx.fillRect(0, 0, rastro.width, rastro.height);
      if (ativo) {
        // O calor fica preso dentro dos cabeçalhos: não vaza para o conteúdo.
        rctx.save();
        rctx.beginPath();
        for (const r of regioes()) rctx.rect(r.x * ESCALA, r.y * ESCALA, r.w * ESCALA, r.h * ESCALA);
        rctx.clip();
        rctx.globalCompositeOperation = "lighter";
        const passos = Math.max(1, Math.ceil(Math.hypot(bola.x - px, bola.y - py) / 8));
        for (let i = 1; i <= passos; i++) {
          carimbo(px + ((bola.x - px) * i) / passos, py + ((bola.y - py) * i) / passos, 0.16);
        }
        carimbo(bola.x, bola.y, 0.1);
        rctx.restore();
        calorRestante = 240;
      } else {
        calorRestante -= 1;
      }

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, rastro);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, (agora - inicio) / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      if (ativo || calorRestante > 0) raf = requestAnimationFrame(quadro);
      else {
        rctx.clearRect(0, 0, rastro.width, rastro.height);
        canvas!.style.visibility = "hidden";
      }
    }
    function acordar() {
      canvas!.style.visibility = "visible";
      if (!raf) raf = requestAnimationFrame(quadro);
    }

    const onMove = (e: PointerEvent) => {
      alvo.x = e.clientX;
      alvo.y = e.clientY;
      if (primeira) {
        bola.x = alvo.x;
        bola.y = alvo.y;
        primeira = false;
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const sobre = !!el?.closest("[data-calor-area]") || pertoDeLinha(e.clientX, e.clientY);
      if (sobre && !ativo) {
        bola.x = alvo.x;
        bola.y = alvo.y;
      }
      ativo = sobre;
      if (ativo) acordar();
    };
    // Ao rolar, o rastro acompanha o texto.
    const onScroll = () => {
      const dy = (window.scrollY - ultimoScroll) * ESCALA;
      ultimoScroll = window.scrollY;
      if (!raf || dy === 0) return;
      cctx.clearRect(0, 0, copia.width, copia.height);
      cctx.drawImage(rastro, 0, 0);
      rctx.clearRect(0, 0, rastro.width, rastro.height);
      rctx.globalCompositeOperation = "source-over";
      rctx.drawImage(copia, 0, -dy);
    };

    resize();
    canvas.style.visibility = "hidden";
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} className="calor-titulos" aria-hidden="true" />;
}
