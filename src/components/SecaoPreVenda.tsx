"use client";

import { useEffect, useRef, useState } from "react";
import { TituloDigitado } from "@/components/TituloDigitado";

// Case "Agente de pré-venda". Ordem: resultado → vídeo → como funciona (vídeo do Notion por etapa) → erros, teste e limites → trajetória.
// Fontes: README do repositório agente-pre-venda, Banco de métricas e o pacote de vídeos
// (~/portfolio-materiais/case-pre-venda). Vídeo: simulação com cliente fictício; tempos do agente medidos no piloto.
const REPO = "https://github.com/MarinaCarvalhoXavier/agente-pre-venda";

// Adiciona "ativa" quando o elemento entra na tela (para as animações de entrada).
function useEntrada<T extends HTMLElement>(limiar = 0.25) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("anima");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("ativa"); io.disconnect(); }
    }, { threshold: limiar });
    io.observe(el);
    return () => io.disconnect();
  }, [limiar]);
  return ref;
}

// Liga data-visivel quando entra na tela (animação dos blocos de triagem e de preço).
function useAparecer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisivel(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisivel(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visivel };
}

// Vídeo que só toca enquanto está na tela (mudo, em loop) e pausa fora dela.
// Com `vertical`, o celular recebe a versão 4:5 (a outra fica escondida e, sem aparecer, não toca).
function VideoNaTela({ src, poster, rotulo, vertical }: { src: string; poster: string; rotulo: string; vertical?: { src: string; poster: string } }) {
  const largo = useRef<HTMLVideoElement>(null);
  const alto = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vids = [largo.current, alto.current].filter(Boolean) as HTMLVideoElement[];
    const io = new IntersectionObserver((es) => {
      for (const e of es) { const v = e.target as HTMLVideoElement; if (e.isIntersecting) void v.play().catch(() => {}); else v.pause(); }
    }, { threshold: 0.4 });
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <video ref={largo} className={vertical ? "pvc-so-largo" : undefined} src={src} poster={poster} muted loop playsInline controls preload="metadata" aria-label={rotulo} />
      {vertical && <video ref={alto} className="pvc-so-celular" src={vertical.src} poster={vertical.poster} muted loop playsInline controls preload="metadata" aria-label={rotulo} />}
    </>
  );
}

const versoes = [
  {
    id: "V0 · À mão", titulo: "O Produto fazia tudo", numero: "~5 h", numeroRotulo: "do Produto por lead",
    revelou: <>Ler a reunião, perguntar, calcular e escrever: cada etapa esperava alguém do Produto ter tempo.</>,
  },
  {
    id: "V1 · Skills de Claude", titulo: "Skills de triagem, preço e proposta", numero: "20 min–1,6 h", numeroRotulo: "por lead, cronometrado",
    revelou: <>A IA fez o trabalho braçal, mas o preço continuou na fila: alguém do Produto ainda lia todo o contexto para conferir.</>,
  },
  {
    id: "V2 · O agente", titulo: "Quem esteve na reunião confere", numero: "8 min", numeroRotulo: "da transcrição às perguntas · piloto",
    proximo: <>Rodar em todos os leads de Discovery do CITi.</>,
  },
];

const numeros = [
  { valor: "8 min", rotulo: "da transcrição às perguntas prontas para o cliente", fonte: "Medido no piloto" },
  { valor: "13 de 13", rotulo: "rodadas repetiram o preço. E o teste achou um erro, já corrigido", fonte: "4 leads de teste" },
  { valor: "US$ 0,90", rotulo: "de IA por lead, com duas rodadas de perguntas", fonte: "Medido" },
  { valor: "~9 → ~4 dias", rotulo: "do primeiro contato à reunião de proposta", fonte: "Antes: média de 4 casos reais · Depois: simulação", quebra: true },
];

const vaga = [
  { pede: "Agentes que resolvem problemas de negócio", mostra: "O preço parou de esperar alguém do Produto ter tempo" },
  { pede: "Automações que economizaram horas reais", mostra: "~5 h do Produto por lead viraram uma revisão de preço" },
  { pede: "Automações com n8n", mostra: "Um workflow de 48 nós no n8n Cloud, disparado pelo Status de cada lead no Notion" },
  { pede: "Prompt engineering avançado", mostra: "A IA responde só critérios, cada um com o trecho da fala. O código decide semanas e preço" },
];

// `de`/`ate`: trecho (em segundos) do vídeo notion-fluxo.mp4 que mostra a etapa.
// Fonte do vídeo: ~/portfolio-materiais/case-pre-venda/videos_case_agente/fontes/notion_fluxo/
const fluxo: { quem: "Pessoa" | "IA" | "Regra"; faz: string; nota: string; de: number; ate: number }[] = [
  { quem: "Pessoa", faz: "O gerente sobe a transcrição da reunião", nota: "Status: Novo", de: 0, ate: 2.6 },
  { quem: "IA", faz: "Triagem: riscos com o minuto da fala, perguntas ao cliente e a mensagem de WhatsApp pronta", nota: "8 min no piloto", de: 2.6, ate: 7 },
  { quem: "Pessoa", faz: "O gerente revisa, envia ao cliente e cola as respostas", nota: "Nada vai ao cliente sem uma pessoa", de: 7, ate: 11 },
  { quem: "IA", faz: "Se as respostas abrirem dúvidas, uma 2ª rodada só com o que ficou em aberto, até 4 perguntas", nota: "~3 min", de: 11, ate: 15 },
  { quem: "Regra", faz: "A IA responde critérios sobre o lead; o código calcula semanas, time e preço e avisa o especialista de Produto", nota: "Status: Aguardando aprovação", de: 15, ate: 22 },
  { quem: "Pessoa", faz: "O especialista de Produto aprova ou ajusta o preço, com o motivo", nota: "O único passo que ainda espera o Produto", de: 22, ate: 26 },
  { quem: "IA", faz: "Proposta em Word e PDF, com a lista do que conferir antes de enviar", nota: "~4 min", de: 26, ate: 36 },
];

// Fluxo + vídeo da página do Notion. Sem interação, o vídeo roda inteiro e a etapa atual acende.
// Passar o mouse (ou tocar, ou focar pelo teclado) numa etapa leva o vídeo àquele trecho, que fica em loop.
function FluxoNotion() {
  const video = useRef<HTMLVideoElement>(null);
  const fixo = useRef<number | null>(null);
  const [atual, setAtual] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const passo = () => {
      const t = v.currentTime, f = fixo.current;
      if (f !== null && (t >= fluxo[f].ate - 0.05 || t < fluxo[f].de - 0.3)) v.currentTime = fluxo[f].de;
      const i = fluxo.findIndex((e) => t >= e.de && t < e.ate);
      if (i >= 0) setAtual(i);
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !parado) void v.play().catch(() => {}); else if (!e.isIntersecting) v.pause();
    }, { threshold: 0.3 });
    io.observe(v);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const ir = (i: number | null) => {
    const v = video.current;
    fixo.current = i;
    setEscolhida(i);
    if (!v || i === null) return;
    v.currentTime = fluxo[i].de;
    setAtual(i);
    void v.play().catch(() => {});
  };

  return (
    <div className="pvc-como">
      <ol className="pvc-fluxo pvc-fluxo-vivo" aria-label="Fluxo do lead, da transcrição à proposta. Escolha uma etapa para ver a página do Notion nesse momento." onMouseLeave={() => ir(null)}>
        {fluxo.map((f, i) => (
          <li
            key={i}
            data-quem={f.quem}
            data-ativa={atual === i || undefined}
            data-escolhida={escolhida === i || undefined}
            tabIndex={0}
            onMouseEnter={() => ir(i)}
            onFocus={() => ir(i)}
            onClick={() => ir(i)}
          >
            <span className="pvc-quem">{f.quem}</span>
            <span className="pvc-faz">{f.faz}<small>{f.nota}</small></span>
          </li>
        ))}
      </ol>
      <figure className="pvc-notion-video">
        <video ref={video} src="/pre-venda/notion-fluxo.mp4" poster="/pre-venda/notion-fluxo-capa.jpg" muted loop playsInline preload="metadata" aria-label="A página do lead no Notion enquanto o agente trabalha: Status mudando, triagem, 2ª rodada, precificação, aprovação do especialista de Produto e proposta" />
        <figcaption>
          <span>A página do lead no Notion · recriação no formato real · lead fictício</span>
          <span className="pvc-quente pvc-dica">Passe o mouse em cada etapa</span>
        </figcaption>
      </figure>
    </div>
  );
}

const erros = [
  {
    titulo: "A proposta custava US$ 6,70",
    antes: <>Cada página do PDF ia como imagem: 2,17 milhões de tokens de entrada e, num lead, o erro “prompt is too long”.</>,
    depois: <>O PDF vira texto, o pedido usa cache e o Claude não reimprime arquivos. Hoje custa <strong>US$ 0,39</strong>, com o mesmo modelo.</>,
  },
  {
    titulo: "Perguntava o que o cliente já tinha respondido",
    antes: <>A IA dava mais peso à transcrição do que às respostas coladas na página.</>,
    depois: <>A triagem confere cada resposta primeiro, e uma segunda chamada revisa a coerência. Zero repetições depois.</>,
  },
  {
    titulo: "Um desconto prometido não aparecia",
    antes: <>Quando o gerente prometia desconto na reunião, o agente não registrava: o preço de tabela seguia como se nada tivesse sido combinado.</>,
    depois: <>Um critério novo, sensibilidade a preço, marca o lead como <strong>Fora do padrão</strong>. O preço continua o de tabela, e o especialista de Produto decide o ajuste, com o motivo na página.</>,
  },
];

// Rodadas de preço (teste de 04/11/2026): semanas calculadas em cada rodada, sem mudar nada na página.
// O lead C é o do fluxo descrito por escrito: o agente cobrava 5 semanas até a correção do campo fluxo_confirmado.
const rodadas: { lead: string; antes: number[]; depois: number[] }[] = [
  { lead: "A", antes: [5, 5, 5], depois: [5, 5] },
  { lead: "B", antes: [5, 5, 5], depois: [5] },
  { lead: "C", antes: [5, 5, 5], depois: [4, 4] },
  { lead: "D", antes: [5, 5, 5, 5], depois: [5, 5] },
];

export function SecaoPreVenda() {
  const trajetoria = useEntrada<HTMLOListElement>(0.5);
  const grafico = useAparecer<HTMLDivElement>();

  return (
    <section id="pre-venda" className="pv pvc" aria-labelledby="pv-titulo" data-calor-linha="topo">
      {/* 1. Cabeça: o que é e o resultado, em 30 segundos */}
      <div className="pv-cabeca" data-calor-area>
        <p className="sobrelinha">Case · Agente de pré-venda · n8n, Notion e Claude</p>
        <TituloDigitado id="pv-titulo" className="area-titulo pvc-titulo" linhas={["O Produto só aprova.", "O agente faz o resto."]} />
        <p className="pvc-lead">
          No CITi, toda proposta esperava alguém do Produto ter tempo para ler a reunião e calcular o preço. O agente lê a
          transcrição, aponta os riscos, escreve as perguntas ao cliente, calcula o preço por uma regra em código e gera a
          proposta. Uma pessoa só aprova.
        </p>
        <div className="pvc-acoes">
          <a href={REPO} target="_blank" rel="noreferrer" className="pvc-repo">Workflow no GitHub ↗</a>
          <span>Rodou no piloto, em leads reais do CITi</span>
        </div>
      </div>

      <ul className="pvc-numeros pvc-numeros-topo" aria-label="Números do case">
        {numeros.map((n) => (
          <li key={n.valor} className={n.quebra ? "quebra" : undefined}>
            <b>{n.valor}</b>
            <span className="rotulo">{n.rotulo}</span>
            <span className="fonte">{n.fonte}</span>
          </li>
        ))}
      </ul>

      {/* 2. O agente em ação: o vídeo */}
      <div className="pvc-bloco pvc-bloco-perto">
        <p className="sobrelinha pvc-quente">O mesmo lead, antes e depois · a espera pelo Produto caiu de 5 d 6 h para 16 h</p>
        <figure className="pvc-video">
          <VideoNaTela
            src="/pre-venda/raias.mp4"
            poster="/pre-venda/raias-capa.jpg"
            vertical={{ src: "/pre-venda/raias-vertical.mp4", poster: "/pre-venda/raias-vertical-capa.jpg" }}
            rotulo="Duas barras do mesmo lead, dia a dia, pintadas por quem está com a bola: Produto, cliente ou gerente. Antes, o Produto segura o lead por 5 dias e 6 horas e a reunião sai no Dia 9. Depois, o agente trabalha em minutos, o Produto fica 16 horas e a reunião sai no Dia 4"
          />
          <figcaption>
            <span>Simulação com cliente fictício. Antes: ritmo da média de 4 precificações reais (um caso de ~1 mês, travado pela agenda do cliente, ficou de fora). Depois: tempos do agente medidos no piloto. O tempo do cliente é igual nos dois lados.</span>
            <span className="pvc-quente">29 s · sem som</span>
          </figcaption>
        </figure>
      </div>

      <div className="pvc-vaga" role="table" aria-label="A vaga pede, este case mostra">
        <div role="row" className="cab"><span role="columnheader">A vaga pede</span><span role="columnheader">Este case mostra</span></div>
        {vaga.map((v) => (
          <div role="row" key={v.pede}><span role="cell"><i aria-hidden="true">✓</i>{v.pede}</span><span role="cell">{v.mostra}</span></div>
        ))}
      </div>

      {/* 3. Como o agente trabalha */}
      <div className="pvc-bloco">
        <h2 className="pvc-h2">Como o agente trabalha</h2>
        <p className="pvc-texto">
          Cada lead é uma página do Notion, onde o time já trabalhava. Uma pessoa muda o Status, e o agente responde escrevendo
          uma seção nova na página. <strong>A IA só responde a critérios; o preço sai de uma regra em código.</strong> Na primeira
          versão, a mesma reunião dava de R$ 7.000 a R$ 10.900.
        </p>
        <FluxoNotion />
      </div>

      {/* 4. O que deu errado e os limites, num bloco só */}
      <div className="pvc-bloco">
        <h2 className="pvc-h2">O que deu errado e o que ainda falta</h2>
        <div className="pvc-teste">
          <div>
            <h3 className="pv-bloco-titulo">O mesmo preço em 13 de 13 rodadas. Num lead, o preço errado.</h3>
            <p className="pv-bloco-texto">
              Rodei 4 leads de teste 3 ou 4 vezes cada, sem mudar nada, e o preço sempre se repetiu. Mas consistência não é acerto:
              num lead, o agente cobrava 5 semanas em vez de 4, porque a IA escrevia o critério fora do campo que o código lê.
              Pus o campo no formato pedido à IA e fiz o código avisar quando um critério vier faltando. O lead foi para{" "}
              <strong>R$ 8.700</strong>, como a regra manda, e os outros três não mudaram.
            </p>
          </div>
          <div ref={grafico.ref} className="pvc-rodadas" data-visivel={grafico.visivel} role="table" aria-label="Semanas calculadas em cada rodada, por lead">
            <div role="row" className="pvc-rodadas-cab"><span role="columnheader">Lead</span><span role="columnheader">Rodadas sem mudar nada</span><span role="columnheader">Depois da correção</span></div>
            {rodadas.map((l) => (
              <div role="row" key={l.lead}>
                <span role="rowheader">{l.lead}</span>
                <span role="cell" className="pvc-pontos">{l.antes.map((n, i) => <i key={i} data-sem={n} style={{ ["--i" as string]: i }}>{n}</i>)}</span>
                <span role="cell" className="pvc-pontos depois">{l.depois.map((n, i) => <i key={i} data-sem={n} data-mudou={n !== l.antes[0] || undefined} style={{ ["--i" as string]: l.antes.length + i }}>{n}</i>)}</span>
              </div>
            ))}
            <p className="ficha-regra">Número = semanas calculadas (5 = R$ 10.900, 4 = R$ 8.700). Leads de teste anonimizados.</p>
          </div>
        </div>
        <ul className="pvc-erros">
          {erros.map((e) => (
            <li key={e.titulo}>
              <h3>{e.titulo}</h3>
              <p><span className="rotulo-num">Antes</span>{e.antes}</p>
              <p><span className="rotulo-num quente">Depois</span>{e.depois}</p>
            </li>
          ))}
        </ul>
        <div className="pvc-limites pvc-limites-junto">
          <div>
            <h3 className="pv-bloco-titulo">Limites</h3>
            <ul>
              <li><strong>Rodou no piloto:</strong> em leads reais do CITi, ainda não em volume, até o fim do período de teste do n8n (nov/2026). O workflow está no GitHub, pronto para importar.</li>
              <li>A linha do tempo do vídeo é <strong>simulada</strong>, com cliente fictício. Os tempos do agente foram medidos.</li>
              <li>Na 2ª rodada, às vezes pede de novo um documento já prometido ou junta duas perguntas. O gerente revisa antes de enviar.</li>
            </ul>
          </div>
          <dl className="pvc-ficha">
            <div><dt>Onde rodou</dt><dd>n8n Cloud, 48 nós, disparado pelo Status do lead</dd></div>
            <div><dt>Modelo</dt><dd>Claude Sonnet 4.6, temperatura 0, Skills API para a proposta</dd></div>
            <div><dt>Interface</dt><dd>Notion: uma página por lead, o Status comanda</dd></div>
            <div><dt>Pessoas no meio</dt><dd>O gerente envia ao cliente; o especialista de Produto aprova o preço</dd></div>
          </dl>
        </div>
      </div>

      {/* 5. Como cheguei aqui: a trajetória, resumida */}
      <div className="pvc-bloco">
        <h2 className="pvc-h2">Como cheguei aqui</h2>
        <p className="pvc-texto">Três versões. Cada uma resolveu um problema e revelou o próximo.</p>
        <ol ref={trajetoria} className="pvc-versoes pvc-versoes-curtas" aria-label="As três versões">
          {versoes.map((v, i) => (
            <li key={v.id} className={i === versoes.length - 1 ? "atual" : undefined} style={{ ["--i" as string]: i }}>
              <span className="pvc-marco" aria-hidden="true" />
              <span className="pvc-versao-id">{v.id}</span>
              <h3>{v.titulo}</h3>
              <p className="pvc-versao-num"><b>{v.numero}</b><span>{v.numeroRotulo}</span></p>
              <div className="pvc-versao-pe">
                <span>{v.proximo ? "Próximo →" : "Revelou →"}</span>
                <p>{v.proximo ?? v.revelou}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="pvc-rodape">
        <span>Código, prompts e regra de preço no repositório</span>
        <a href={REPO} target="_blank" rel="noreferrer" className="pvc-repo">Workflow no GitHub ↗</a>
      </div>
    </section>
  );
}
