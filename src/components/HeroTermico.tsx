"use client";

import { useEffect, useRef } from "react";

// O cursor é uma bola térmica: deixa rastro, que esfria com o tempo.
// O título tem cores térmicas sobre o preto e fica preto onde está quente.
// O h1 real continua no DOM (transparente) para leitores de tela e seleção.

const vert = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const frag = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uTrail;
uniform sampler2D uText;

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
  vec3 c0 = vec3(0.0);
  vec3 c1 = vec3(0.110, 0.040, 0.260);
  vec3 c2 = vec3(0.420, 0.100, 0.440);
  vec3 c3 = vec3(0.900, 0.270, 0.360);
  vec3 c4 = vec3(1.000, 0.560, 0.230);
  vec3 c5 = vec3(1.000, 0.900, 0.640);
  if (t < 0.22) return mix(c0, c1, t / 0.22);
  if (t < 0.44) return mix(c1, c2, (t - 0.22) / 0.22);
  if (t < 0.64) return mix(c2, c3, (t - 0.44) / 0.20);
  if (t < 0.82) return mix(c3, c4, (t - 0.64) / 0.18);
  return mix(c4, c5, clamp((t - 0.82) / 0.18, 0.0, 1.0));
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 q = vec2(uv.x * uRes.x / uRes.y, uv.y);
  float t = uTime * 0.12;

  float h = texture2D(uTrail, uv).a;
  float n = fbm(q * 3.2 + vec2(0.0, -t * 1.6));
  float hh = clamp(h * (0.72 + 0.6 * n) * 1.2, 0.0, 1.0);
  vec3 col = rampa(hh);

  float tx = texture2D(uText, uv).a;
  vec3 tcol = rampa(0.60 + 0.42 * smoothstep(0.2, 0.8, fbm(q * 1.6 + vec2(t * 0.5, -t))));
  tcol = mix(tcol, vec3(0.02, 0.0, 0.035), smoothstep(0.42, 0.6, hh));
  col = mix(col, tcol, tx);

  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function HeroTermico({ linhas }: { linhas: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const titulo = tituloRef.current;
    if (!canvas || !titulo) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      titulo.classList.add("sem-webgl");
      return;
    }

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
    gl.uniform1i(gl.getUniformLocation(prog, "uTrail"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "uText"), 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const novaTextura = (unidade: number) => {
      const tex = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unidade);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };
    const texRastro = novaTextura(0);
    const texTexto = novaTextura(1);

    // Rastro térmico em baixa resolução: acumula calor e esfria a cada quadro.
    const rastro = document.createElement("canvas");
    const rctx = rastro.getContext("2d", { willReadFrequently: true })!;
    const ESCALA = 0.25;
    // Texto em resolução cheia, desenhado na mesma posição do h1 real.
    const texto = document.createElement("canvas");
    const tctx = texto.getContext("2d")!;

    let dpr = 1;
    let largura = 1;
    let altura = 1;

    const desenharTexto = () => {
      const base = canvas.getBoundingClientRect();
      texto.width = canvas.width;
      texto.height = canvas.height;
      tctx.clearRect(0, 0, texto.width, texto.height);
      const estilo = getComputedStyle(titulo);
      const tamanho = parseFloat(estilo.fontSize);
      tctx.font = `${estilo.fontWeight} ${tamanho * dpr}px ${estilo.fontFamily}`;
      (tctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${parseFloat(estilo.letterSpacing || "0") * dpr || 0}px`;
      tctx.fillStyle = "#fff";
      tctx.textBaseline = "alphabetic";
      titulo.querySelectorAll<HTMLSpanElement>("[data-palavra]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const m = tctx.measureText(el.textContent || "");
        const asc = m.fontBoundingBoxAscent ?? tamanho * dpr * 0.8;
        tctx.fillText(el.textContent || "", (r.left - base.left) * dpr, (r.top - base.top) * dpr + asc);
      });
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texTexto);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texto);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = canvas.clientWidth;
      altura = canvas.clientHeight;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      rastro.width = Math.max(1, Math.round(largura * ESCALA));
      rastro.height = Math.max(1, Math.round(altura * ESCALA));
      gl.viewport(0, 0, canvas.width, canvas.height);
      desenharTexto();
    };
    resize();
    // Redesenha quando a fonte do título termina de carregar.
    const estiloTitulo = getComputedStyle(titulo);
    document.fonts?.load(`${estiloTitulo.fontWeight} 100px ${estiloTitulo.fontFamily}`).then(desenharTexto);
    document.fonts?.ready.then(desenharTexto);
    document.fonts?.addEventListener("loadingdone", desenharTexto);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alvo = { x: largura * 0.7, y: altura * 0.45 };
    const bola = { x: alvo.x, y: alvo.y };
    let ultimoMovimento = -Infinity;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      alvo.x = e.clientX - r.left;
      alvo.y = e.clientY - r.top;
      ultimoMovimento = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const RAIO = 120;
    const carimbo = (x: number, y: number, forca: number) => {
      const rx = x * ESCALA;
      const ry = y * ESCALA;
      const rr = RAIO * ESCALA;
      const g = rctx.createRadialGradient(rx, ry, 0, rx, ry, rr);
      g.addColorStop(0, `rgba(255,255,255,${forca})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      rctx.fillStyle = g;
      rctx.beginPath();
      rctx.arc(rx, ry, rr, 0, Math.PI * 2);
      rctx.fill();
    };

    let raf = 0;
    let visivel = true;
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel && !raf) raf = requestAnimationFrame(quadro);
    });
    io.observe(canvas);

    let contador = 0;
    const inicio = performance.now();
    function quadro(agora: number) {
      raf = 0;
      // Sem mouse por 2,5 s: a bola passeia sozinha sobre o título.
      if (agora - ultimoMovimento > 2500 && !reduzido) {
        const s = (agora - inicio) / 1000;
        alvo.x = largura * (0.5 + 0.38 * Math.sin(s * 0.45));
        alvo.y = altura * (0.62 + 0.14 * Math.sin(s * 0.9 + 1.3));
      }
      const px = bola.x;
      const py = bola.y;
      bola.x += (alvo.x - bola.x) * 0.14;
      bola.y += (alvo.y - bola.y) * 0.14;

      // esfria
      rctx.globalCompositeOperation = "destination-out";
      rctx.fillStyle = "rgba(0,0,0,0.022)";
      rctx.fillRect(0, 0, rastro.width, rastro.height);
      // aquece ao longo do caminho
      rctx.globalCompositeOperation = "lighter";
      const passos = Math.max(1, Math.ceil(Math.hypot(bola.x - px, bola.y - py) / 8));
      for (let i = 1; i <= passos; i++) {
        carimbo(px + ((bola.x - px) * i) / passos, py + ((bola.y - py) * i) / passos, 0.16);
      }
      carimbo(bola.x, bola.y, 0.1);

      // Textos fora do título: ficam pretos quando o calor passa por eles.
      if (++contador % 3 === 0) {
        const base = canvas!.getBoundingClientRect();
        document.querySelectorAll<HTMLElement>("[data-termico]").forEach((el) => {
          const r = el.getBoundingClientRect();
          let calor = 0;
          const pontos: [number, number][] = [
            [r.left + r.width / 2, r.top + r.height / 2],
            [r.left + 4, r.top + r.height / 2],
            [r.right - 4, r.top + r.height / 2],
          ];
          for (const [x, y] of pontos) {
            const sx = Math.floor((x - base.left) * ESCALA);
            const sy = Math.floor((y - base.top) * ESCALA);
            if (sx < 0 || sy < 0 || sx >= rastro.width || sy >= rastro.height) continue;
            calor = Math.max(calor, rctx.getImageData(sx, sy, 1, 1).data[3] / 255);
          }
          const nivel = Math.min(1, Math.max(0, (calor * 1.2 - 0.35) / 0.2));
          el.style.setProperty("--calor", nivel.toFixed(2));
        });
      }

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, texRastro);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, rastro);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, (agora - inicio) / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (visivel) raf = requestAnimationFrame(quadro);
    }
    raf = requestAnimationFrame(quadro);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.fonts?.removeEventListener("loadingdone", desenharTexto);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hero-fundo" aria-hidden="true" />
      <h1 ref={tituloRef} id="hero-titulo" className="titulo-termico">
        {linhas.map((linha, i) => (
          <span key={i} className="titulo-linha">
            {linha.split(" ").map((palavra, j, arr) => (
              <span key={j}>
                <span data-palavra>{palavra}</span>
                {j < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        ))}
      </h1>
    </>
  );
}
