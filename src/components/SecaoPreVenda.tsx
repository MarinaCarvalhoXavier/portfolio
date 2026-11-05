"use client";

import { useEffect, useRef, useState } from "react";
import { TituloDigitado } from "@/components/TituloDigitado";

// Case "Agente de triagem e precificação" (Caminho C do canvas: o topo é a trajetória de versões).
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
    texto: <>Ler a reunião, perguntar ao cliente, calcular o preço e escrever a proposta.</>,
    revelou: <>Cada etapa esperava alguém do Produto ter tempo.</>,
  },
  {
    id: "V1 · Skills de Claude", titulo: "Skills de triagem, preço e proposta", numero: "20 min–1,6 h", numeroRotulo: "por lead, cronometrado",
    texto: <><strong>Resolveu</strong> o trabalho braçal: a IA lê a transcrição e escreve a proposta, e o preço sai de uma regra com tabela fixa.</>,
    revelou: <>Com a demanda alta, o preço continuou na fila: alguém do Produto ainda tinha de ler todo o contexto do cliente para conferir. E, entre o preço da skill e a proposta enviada, o valor podia mudar na negociação sem ficar registrado por quê.</>,
  },
  {
    id: "V2 · O agente", titulo: "Quem esteve na reunião confere", numero: "8 min", numeroRotulo: "da transcrição às perguntas · piloto",
    texto: <><strong>Resolveu</strong> a fila: o agente dispara sozinho no Notion e as perguntas voltam para o gerente, que acabou de ter a reunião e só confere e envia. Qualquer ajuste de preço passa pelo especialista de Produto, com o motivo registrado na página.</>,
    proximo: <>Rodar em todos os leads de Discovery do CITi.</>,
  },
];

const numeros = [
  { valor: "~9 → ~4 dias", rotulo: "do primeiro contato à reunião de proposta", fonte: "Antes: média de 4 casos reais · Depois: simulação" },
  { valor: "8 min", rotulo: "da transcrição às perguntas prontas para o cliente", fonte: "Medido no piloto" },
  { valor: "~4 min", rotulo: "para gerar a proposta em Word e PDF", fonte: "Medido" },
  { valor: "US$ 0,90", rotulo: "de IA por lead, com duas rodadas de perguntas", fonte: "Medido" },
];

const vaga = [
  { pede: "Agentes que resolvem problemas de negócio", mostra: "O preço parou de esperar alguém do Produto ter tempo" },
  { pede: "Automações que economizaram horas reais", mostra: "~5 h do Produto por lead viraram uma revisão de preço" },
  { pede: "Automações com n8n", mostra: "Um workflow de 48 nós no n8n Cloud, disparado pelo Status de cada lead no Notion" },
  { pede: "Prompt engineering avançado", mostra: "A IA responde só critérios, cada um com o trecho da fala. O código decide semanas e preço" },
];

const fluxo: { quem: "Pessoa" | "IA" | "Regra"; faz: string; nota: string }[] = [
  { quem: "Pessoa", faz: "O gerente sobe a transcrição da reunião", nota: "Status: Novo" },
  { quem: "IA", faz: "Triagem: riscos com o minuto da fala, perguntas ao cliente e a mensagem de WhatsApp pronta", nota: "8 min no piloto" },
  { quem: "Pessoa", faz: "O gerente revisa, envia ao cliente e cola as respostas", nota: "Nada vai ao cliente sem uma pessoa" },
  { quem: "IA", faz: "Se as respostas abrirem dúvidas, uma 2ª rodada só com o que ficou em aberto, até 4 perguntas", nota: "~3 min" },
  { quem: "Regra", faz: "A IA responde critérios sobre o lead; o código calcula semanas, time e preço e avisa o especialista de Produto", nota: "Status: Aguardando aprovação" },
  { quem: "Pessoa", faz: "O especialista de Produto aprova ou ajusta o preço, com o motivo", nota: "O único passo que ainda espera o Produto" },
  { quem: "IA", faz: "Proposta em Word e PDF, com a lista do que conferir antes de enviar", nota: "~4 min" },
];

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

const riscos = [
  { texto: "Cliente recusou a etapa de discovery", minuto: null },
  { texto: "Sem orçamento: “não tem dinheiro, então faça o que puder”", minuto: "40:24" },
  { texto: "Dados de saúde de crianças (LGPD)", minuto: null },
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
  const trajetoria = useEntrada<HTMLOListElement>(0.2);
  const ficha = useAparecer<HTMLDivElement>();
  const grafico = useAparecer<HTMLDivElement>();

  return (
    <section id="pre-venda" className="pv pvc" aria-labelledby="pv-titulo" data-calor-linha="topo">
      {/* 1. Cabeça: a trajetória de versões */}
      <div className="pv-cabeca" data-calor-area>
        <p className="sobrelinha">Case · Agente de triagem e precificação</p>
        <TituloDigitado id="pv-titulo" className="area-titulo pvc-titulo" linhas={["Cada versão resolveu um problema.", "E revelou o próximo."]} />
        <p className="pvc-lead">
          No CITi, o preço de cada projeto dependia de alguém do Produto ter tempo. Foram três versões até chegar a um
          agente que faz o trabalho sozinho e só pede a aprovação de uma pessoa.
        </p>
      </div>

      <ol ref={trajetoria} className="pvc-versoes" aria-label="As três versões">
        {versoes.map((v, i) => (
          <li key={v.id} className={i === versoes.length - 1 ? "atual" : undefined} style={{ ["--i" as string]: i }}>
            <span className="pvc-marco" aria-hidden="true" />
            <span className="pvc-versao-id">{v.id}</span>
            <h3>{v.titulo}</h3>
            <p className="pvc-versao-num"><b>{v.numero}</b><span>{v.numeroRotulo}</span></p>
            <p className="pvc-versao-texto">{v.texto}</p>
            <div className="pvc-versao-pe">
              <span>{v.proximo ? "Próximo →" : "Revelou →"}</span>
              <p>{v.proximo ?? v.revelou}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 2. A V3 em ação: o vídeo */}
      <div className="pvc-bloco">
        <p className="sobrelinha pvc-quente">O agente em ação · o mesmo lead, antes e depois</p>
        <figure className="pvc-video">
          <VideoNaTela
            src="/pre-venda/raias.mp4"
            poster="/pre-venda/raias-capa.jpg"
            vertical={{ src: "/pre-venda/raias-vertical.mp4", poster: "/pre-venda/raias-vertical-capa.jpg" }}
            rotulo="Duas barras do mesmo lead, dia a dia, pintadas por quem está com a bola: Produto, cliente ou gerente. Antes, o Produto segura o lead por 5 dias e 6 horas e a reunião sai no Dia 9. Depois, o agente trabalha em minutos, o Produto fica 16 horas e a reunião sai no Dia 4"
          />
          <figcaption>
            <span>Simulação com cliente fictício · Antes: no ritmo da média de 4 precificações reais do CITi · Depois: tempos do agente medidos no piloto</span>
            <span className="pvc-quente">29 s · sem som</span>
          </figcaption>
        </figure>
        <div className="pvc-ler">
          <p><strong>O tempo do cliente é igual nos dois lados:</strong> as mesmas duas rodadas de perguntas, no mesmo ritmo. O Antes segue a média de 4 precificações reais; um caso de ~1 mês, travado por viagens e agendas do cliente, ficou de fora.</p>
          <p><strong>O que encolheu foi a espera pelo Produto:</strong> 5 d 6 h → 16 h. Sobrou só a noite até o especialista aprovar.</p>
          <p><strong>O agente trabalha em minutos.</strong> Ninguém saiu do processo: o gerente envia e o especialista de Produto aprova.</p>
        </div>
      </div>

      {/* 3. Números, cada um com a fonte */}
      <ul className="pvc-numeros" aria-label="Números do case">
        {numeros.map((n) => (
          <li key={n.valor}>
            <b>{n.valor}</b>
            <span className="rotulo">{n.rotulo}</span>
            <span className="fonte">{n.fonte}</span>
          </li>
        ))}
      </ul>

      <div className="pvc-vaga" role="table" aria-label="A vaga pede, este case mostra">
        <div role="row" className="cab"><span role="columnheader">A vaga pede</span><span role="columnheader">Este case mostra</span></div>
        {vaga.map((v) => (
          <div role="row" key={v.pede}><span role="cell"><i aria-hidden="true">✓</i>{v.pede}</span><span role="cell">{v.mostra}</span></div>
        ))}
      </div>

      {/* 4. Como o agente trabalha */}
      <div className="pvc-bloco">
        <h2 className="pvc-h2">Como o agente trabalha</h2>
        <p className="pvc-texto">
          Cada lead é uma página do Notion. Uma pessoa muda o Status; o agente confere a cada 2 minutos (no piloto) e responde
          escrevendo uma seção nova na página. A primeira versão usava planilha e e-mail; troquei pelo Notion porque o time
          já trabalhava nele, e no CITi ferramenta nova costuma cair em esquecimento.
        </p>
        <div className="pvc-como">
          <ol className="pvc-fluxo" aria-label="Fluxo do lead, da transcrição à proposta">
            {fluxo.map((f, i) => (
              <li key={i} data-quem={f.quem}>
                <span className="pvc-quem">{f.quem}</span>
                <span className="pvc-faz">{f.faz}<small>{f.nota}</small></span>
              </li>
            ))}
          </ol>
          <figure className="pvc-notion" aria-label="Recriação da seção de preço que o agente escreve na página do lead">
            <p className="pvc-notion-tit">Precificação</p>
            <dl>
              <div><dt>Preço de tabela</dt><dd className="grande">R$ 8.700</dd></div>
              <div><dt>Semanas</dt><dd>4 · uma frente, até 3 usuários-chave confirmados e fluxo descrito pelo cliente por escrito</dd></div>
              <div><dt>Conta</dt><dd>2,85 unidades × 4 semanas × 5 dias × R$ 152,98, arredondado para a centena</dd></div>
              <div><dt>Fora do padrão</dt><dd>Nenhum critério</dd></div>
            </dl>
            <p className="pvc-notion-mencao"><span>@Especialista de Produto</span> aprovar ou ajustar o preço</p>
            <p className="pvc-notion-custo">Custo desta rodada: US$ 0,21</p>
            <figcaption>O que o agente escreve na página: o preço, a regra que levou a ele, a menção ao especialista e o custo da rodada. As seções anteriores viram toggles. Recriação no formato real · lead fictício</figcaption>
          </figure>
        </div>
      </div>

      {/* 5. A IA lê a reunião, a regra decide o preço: dois exemplos reais */}
      <div className="pvc-bloco">
        <h2 className="pvc-h2">A IA lê a reunião. A regra decide o preço.</h2>
        <div className="pv-grade">
          <article className="pv-bloco">
            <div className="pv-bloco-intro">
              <h3 className="pv-bloco-titulo">Um lead barrado antes de virar problema</h3>
              <p className="pv-bloco-texto">
                Uma empresa de saúde infantil queria um projeto sem passar pelo discovery. O agente leu a reunião e
                recomendou voltar ao Comercial antes de qualquer proposta.
              </p>
            </div>
            <div ref={ficha.ref} className="ficha" data-visivel={ficha.visivel}>
              <div className="ficha-topo">
                <span className="ficha-rotulo">Triagem · lead anonimizado</span>
                <span className="ficha-veredito">Voltar ao Comercial</span>
              </div>
              <ul className="ficha-riscos">
                {riscos.map((r, i) => (
                  <li key={r.texto} style={{ transitionDelay: `${300 + i * 260}ms` }}>
                    <span className="ficha-sinal" aria-label="Risco alto" />
                    <span>{r.texto}</span>
                    {r.minuto && <span className="ficha-minuto">{r.minuto}</span>}
                  </li>
                ))}
              </ul>
              <p className="ficha-regra">Criticidade alta pela regra: 3 ou mais fatores de risco.</p>
            </div>
          </article>
          <article className="pv-bloco">
            <div className="pv-bloco-intro">
              <h3 className="pv-bloco-titulo">O mesmo lead, o mesmo preço. E um erro que só o teste mostrou.</h3>
              <p className="pv-bloco-texto">
                Rodei a precificação de 4 leads de teste 3 ou 4 vezes cada, sem mudar nada: <strong>13 de 13 rodadas repetiram o preço</strong>.
                Mas consistência não é acerto. Num dos leads, o cliente tinha descrito o fluxo por escrito, e o agente cobrava 5 semanas em vez de 4.
              </p>
              <p className="pv-bloco-texto">
                A IA tinha reconhecido o fluxo, mas escrevia isso só na justificativa, fora do campo que o código lê. Sem o campo, o código
                entendia “não confirmado”. Pus o campo no formato pedido à IA e fiz o código avisar quando um critério vier faltando.
                Nas duas rodadas seguintes, o lead ficou em <strong>R$ 8.700</strong>, como a regra manda, e os outros três continuaram iguais.
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
          </article>
        </div>
      </div>

      {/* 6. O que deu errado e como resolvi */}
      <div className="pvc-bloco">
        <h2 className="pvc-h2">O que deu errado e como resolvi</h2>
        <ul className="pvc-erros">
          {erros.map((e) => (
            <li key={e.titulo}>
              <h3>{e.titulo}</h3>
              <p><span className="rotulo-num">Antes</span>{e.antes}</p>
              <p><span className="rotulo-num quente">Depois</span>{e.depois}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. Limites e ficha técnica */}
      <div className="pvc-bloco pvc-limites">
        <div>
          <h2 className="pvc-h2">Limites</h2>
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

      {/* 8. Cada lado, em detalhe */}
      <div className="pvc-bloco">
        <h2 className="pvc-h2">Cada lado, em detalhe</h2>
        <p className="pvc-texto">O mesmo lead fictício, nas telas onde ele acontece: o WhatsApp do gerente antes e, depois, a página do Notion que o agente escreve enquanto o Antes ainda espera.</p>
        <figure className="pvc-video">
          <video src="/pre-venda/lado.mp4" poster="/pre-venda/lado-capa.jpg" controls playsInline preload="none" aria-label="O mesmo lead nos dois lados, no mesmo relógio: à esquerda o WhatsApp do Antes, à direita o Notion do Depois. O Depois marca a reunião no Dia 4 e mostra o que o agente escreveu enquanto o Antes ainda espera, até o Dia 9" />
          <figcaption><span>Antes no WhatsApp · Depois no Notion · mesmo relógio</span><span className="pvc-quente">29 s · reunião no Dia 4 contra Dia 9</span></figcaption>
        </figure>
      </div>

      <div className="pvc-rodape">
        <span>8 min até as perguntas</span>
        <span>US$ 0,90 por lead</span>
        <a href={REPO} target="_blank" rel="noreferrer" className="pvc-repo">Workflow no GitHub ↗</a>
      </div>
    </section>
  );
}
