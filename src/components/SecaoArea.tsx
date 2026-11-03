"use client";

import { useEffect, useRef, useState } from "react";
import MicroSlatsJS from "@/components/reactbits/MicroSlats";

// O componente do React Bits é JS; as props opcionais vêm do preset.
const MicroSlats = MicroSlatsJS as unknown as React.ComponentType<Record<string, unknown>>;
import { TituloDigitado } from "@/components/TituloDigitado";

const funil = [
  { nome: "Lead chega", quem: "Comercial", ia: false },
  { nome: "Triagem e preço", quem: "IA + regra", ia: true },
  { nome: "Perguntas ao cliente", quem: "IA + n8n", ia: true },
  { nome: "Discovery", quem: "Time + IA", ia: true },
  { nome: "Business Case e PRD", quem: "IA", ia: true },
  { nome: "Desenvolvimento", quem: "Dev e Dados", ia: false },
];

const construi = [
  {
    nome: "Agente de triagem",
    etapa: "Triagem",
    entra: "A transcrição da reunião de pré-venda",
    faz: "Aponta os riscos do projeto, cada um com o minuto em que o cliente falou, e dá um veredito: seguir, seguir com pendências ou voltar ao Comercial.",
    sai: "Diagnóstico em 15 a 20 min, em vez de ~5 h",
    com: "Claude · skill",
  },
  {
    nome: "Precificação por regra",
    etapa: "Preço",
    entra: "Critérios objetivos que a IA extrai da reunião",
    faz: "A IA não chuta o preço. O código calcula semanas, tamanho do time e valor a partir dos critérios.",
    sai: "Mesmo preço para a mesma reunião",
    com: "Claude + código",
  },
  {
    nome: "Perguntas ao cliente",
    etapa: "Pendências",
    entra: "A página do lead no Notion, com a transcrição e as respostas",
    faz: "Escreve as perguntas e a mensagem para o cliente; o gerente revisa e envia. Saiu da planilha e do e-mail para o Notion, onde o time já trabalha: ferramenta nova cai em esquecimento.",
    sai: "Mensagem pronta no WhatsApp e tudo registrado na página do lead",
    com: "n8n · Claude · Notion",
  },
  {
    nome: "Business Case e PRD",
    etapa: "Handoff",
    entra: "O material do discovery",
    faz: "Gera os documentos no padrão da área: PRD com 15 seções e user stories, Business Case sem ROI inventado.",
    sai: "Documentos validados em até 2 h, em vez de ~10 h",
    com: "Claude · skills",
  },
];

const numeros = [
  { valor: 12, prefixo: "", sufixo: "", rotulo: "diagnósticos feitos com as skills" },
  { valor: 7, prefixo: "", sufixo: "", rotulo: "viraram contrato" },
  { valor: 71, prefixo: "R$", sufixo: "mil", rotulo: "em contratos fechados" },
  { valor: 0, prefixo: "", sufixo: "", rotulo: "projetos atrasados, até agora" },
];

function Contador({ valor, prefixo, sufixo }: { valor: number; prefixo: string; sufixo: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAtual(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / 1400);
          setAtual(Math.round(valor * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor]);

  return (
    <span ref={ref} className="contador">
      {prefixo && <span className="contador-unidade">{prefixo.trim()}</span>}
      {atual}
      {sufixo && <span className="contador-unidade">{sufixo.trim()}</span>}
    </span>
  );
}

export function SecaoArea() {
  return (
    <section id="area" className="area" aria-labelledby="area-titulo">
      <div className="area-cabeca" data-calor-area>
        <p className="sobrelinha">
          Projeto principal · CITi, 2026
        </p>
        <TituloDigitado
          id="area-titulo"
          className="area-titulo"
          linhas={["Do lead ao desenvolvimento,", "a IA trabalha em cada etapa."]}
        />
        <p className="area-lead">
          Quando assumi, Produto ainda era Design com outro nome: cada proposta saía de um jeito, e três projetos
          estouraram o prazo em 90%, em média. Criei a subárea do zero e coloquei agentes de IA onde o trabalho
          travava.
        </p>
      </div>

      <div className="area-mar">
        <MicroSlats
          preset="swell"
          color="#b04fd8"
          glintColor="#ff8a3d"
          backgroundColor="#000000"
          slatWidth={6}
          slatHeight={18}
          gap={3}
          roundness={1}
          interactive
          cursorStrength={1.4}
          cursorSize={70}
          swirl={0.4}
          trail={2.2}
          intro={false}
          glint={1.3}
          contrast={0.95}
          fog={0.3}
        />
        <ol className="funil" aria-label="O funil da subárea de Produto">
          {funil.map((etapa) => (
            <li key={etapa.nome} data-ia={etapa.ia} data-calor-linha="topo">
              <span className="funil-quem">{etapa.quem}</span>
              <span className="funil-nome">{etapa.nome}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="construi">
        <div className="construi-cabeca" data-calor-linha="base">
          <h3 className="construi-titulo">O que eu construí</h3>
          <p className="construi-legenda" aria-hidden="true">
            <span>Entra</span>
            <span>O que a IA faz</span>
            <span>Sai</span>
          </p>
        </div>
        <ol className="construi-lista">
          {construi.map((c) => (
            <li key={c.nome} data-calor-linha="base">
              <div className="construi-nome">
                <span className="construi-etapa">{c.etapa}</span>
                <strong>{c.nome}</strong>
                <span className="construi-com">{c.com}</span>
              </div>
              <p>
                <span className="sr">Entra: </span>
                {c.entra}
              </p>
              <p>
                <span className="sr">O que a IA faz: </span>
                {c.faz}
              </p>
              <p className="construi-sai">
                <span className="sr">Sai: </span>
                {c.sai}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <ul className="area-numeros">
        {numeros.map((n) => (
          <li key={n.rotulo} data-calor-linha="topo">
            <span className="area-numero">
              <Contador valor={n.valor} prefixo={n.prefixo} sufixo={n.sufixo} />
            </span>
            <span className="area-rotulo">{n.rotulo}</span>
          </li>
        ))}
      </ul>

      <div className="area-rodape">
        <p className="area-piada">Nenhum projeto atrasado até agora. Sim, eu bato na madeira.</p>
      </div>
    </section>
  );
}
