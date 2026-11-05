// Todo o conteúdo do site mora aqui. Para adicionar um projeto novo,
// acrescente um item em `cases` ou `experimentos`. Cada número público
// precisa de um recibo em `recibos`: como foi medido e onde está a prova.
// Fonte dos números: "Banco de métricas — GEN AI iFood" (28/10/2026).

export type TipoRecibo = "medido" | "estimativa" | "contagem";

export type Recibo = {
  valor: string;
  rotulo: string;
  tipo: TipoRecibo;
  como: string;
  prova: string;
};

export type Papel = "pessoa" | "ia" | "regra";

export type Passo = { papel: Papel; texto: string };

export type Metrica = { recibo: string };

export type Caso = {
  id: string;
  titulo: string;
  curto: string;
  contexto: string;
  status: "Em uso" | "Em construção" | "Em uso, sem números ainda";
  problema: string;
  construi: string;
  fluxo: Passo[];
  decisao: string;
  metricas: Metrica[];
  nota?: string;
  stack: string[];
};

export const recibos: Record<string, Recibo> = {
  time: {
    valor: "[X] pessoas",
    rotulo: "usam as skills hoje ([Y] ao longo da gestão)",
    tipo: "contagem",
    como: "Contei quem usa as skills no trabalho de hoje. O número entre parênteses inclui duas pessoas que usaram e saíram do CITi durante a gestão.",
    prova: "Time da subárea de Produto e gerentes de contas que recebem as triagens.",
  },
  diagnosticos: {
    valor: "12 diagnósticos",
    rotulo: "feitos com as skills desde ago/2026",
    tipo: "contagem",
    como: "Contei todos os diagnósticos de pré-venda que passaram pelas skills de triagem e precificação.",
    prova: "Propostas no Drive do CITi.",
  },
  contratos: {
    valor: "7 contratos",
    rotulo: "fechados em 12 diagnósticos (R$ 71 mil)",
    tipo: "contagem",
    como: "7 dos 12 diagnósticos viraram contrato. Outros 3 seguem em negociação e 2 não responderam. A receita é a soma dos 7 contratos.",
    prova: "Propostas e contratos no Drive do CITi.",
  },
  atrasos: {
    valor: "nenhum atraso",
    rotulo: "nos projetos fechados, até agora",
    tipo: "contagem",
    como: "Dos 3 projetos já concluídos, 1 terminou 3 dias antes e 2 no prazo. Os outros 4 estão começando, por isso o \"até agora\". Antes das skills, 3 projetos de 2026 estouraram o prazo em ~73%, em média.",
    prova: "Cronogramas dos projetos.",
  },
  esforco: {
    valor: "−70% a −93%",
    rotulo: "no esforço de cada precificação",
    tipo: "medido",
    como: "Antes: 2 reuniões e 2h45 de documentação, cerca de 5h (relato da gestão anterior). Hoje cronometrei 15 a 20 min de análise, mais no máximo 1 reunião. A faixa depende de a reunião acontecer ou não.",
    prova: "Entrevistas com a gestão anterior e cronometragem própria.",
  },
  preco: {
    valor: "100%",
    rotulo: "das rodadas de teste deram o mesmo preço para a mesma reunião",
    tipo: "medido",
    como: "Na primeira versão, o agente deu preços entre R$ 7.000 e R$ 10.900 para a mesma transcrição. Passei a decisão de semanas e time para o código, e a IA ficou só com os critérios objetivos. Desde então, todas as rodadas de teste deram o mesmo preço, igual à decisão real. Ainda falta testar nos outros diagnósticos.",
    prova: "Rodadas de teste com a transcrição de um cliente real.",
  },
  bcTempo: {
    valor: "~10h → 2h",
    rotulo: "para montar Business Case e PRD",
    tipo: "estimativa",
    como: "Antes: o tempo médio de criação no primeiro projeto, sem skill. Hoje: limite de 2h para ler e validar os dois documentos. Não conta as idas e vindas com Dev e Dados.",
    prova: "Estimativa própria, por isso o \"~\".",
  },
  bcQualidade: {
    valor: "0 → 31",
    rotulo: "user stories no handoff",
    tipo: "contagem",
    como: "Comparei os documentos de um projeto sem skill com os de um projeto com skill. Sem skill: 0 user stories, 0 critérios de aceite e 0 métricas. Com skill: 31 user stories em 9 épicos, 34 blocos de critérios de aceite e 7 métricas, cada uma com \"como medir\".",
    prova: "Os dois conjuntos de documentos no Drive.",
  },
  bcConversao: {
    valor: "2 de 4",
    rotulo: "discoveries viraram contrato de desenvolvimento",
    tipo: "contagem",
    como: "Dos 4 discoveries concluídos com BC e PRD: 1 contrato assinado (R$ 65 mil), 1 em fechamento (R$ 31,5 mil) e 2 em contraproposta. Nenhum foi recusado.",
    prova: "Contratos no Drive do CITi.",
  },
};

export const capitulos: Caso[] = [
  {
    id: "pre-venda",
    titulo: "Agente de pré-venda",
    curto: "Pré-venda",
    contexto: "CITi · em uso desde ago/2026",
    status: "Em uso",
    problema:
      "Cada lead era precificado à mão, por uma pessoa, sem padrão. O escopo mal feito virava projeto que estourava prazo e deixava trabalho sem cobrar.",
    construi:
      "Skills de triagem e precificação com Claude. A triagem lê a transcrição da reunião e aponta os gargalos, cada um com o minuto em que o cliente falou. O preço sai de uma regra fixa. Depois, um agente no n8n passou a fazer o caminho inteiro dentro do Notion, onde o time já trabalha: triagem, perguntas, preço pela regra e proposta.",
    fluxo: [
      { papel: "pessoa", texto: "Gerente de contas envia a transcrição da reunião" },
      { papel: "ia", texto: "Aponta gargalos e dá o veredito no semáforo" },
      { papel: "regra", texto: "Calcula semanas, time e preço" },
      { papel: "pessoa", texto: "Líder de Produto aprova no Notion" },
      { papel: "ia", texto: "Escreve as perguntas ao cliente" },
    ],
    decisao:
      "A IA não decide o preço. Ela responde a critérios objetivos, e o código faz a conta.",
    metricas: [{ recibo: "esforco" }, { recibo: "contratos" }, { recibo: "atrasos" }, { recibo: "preco" }],
    nota:
      "O gargalo que sobrou é a espera pela resposta do cliente: cerca de 3 dias, na estimativa do Comercial.",
    stack: ["Claude", "Claude Skills", "n8n", "Notion", "WhatsApp"],
  },
  {
    id: "bc-prd",
    titulo: "Business Case e PRD gerados por skill",
    curto: "BC e PRD",
    contexto: "CITi · desde o 2º projeto da gestão",
    status: "Em uso",
    problema:
      "O handoff do discovery para o desenvolvimento não tinha padrão. No primeiro projeto, Dev e Dados receberam documentos sem user stories, critérios de aceite nem métricas.",
    construi:
      "Criei os modelos de Business Case e PRD da subárea e transformei os dois em skills. Agora o time só lê e valida. Sem horas medidas, o Business Case não projeta ROI: mostra só o valor que dá para provar.",
    fluxo: [
      { papel: "pessoa", texto: "Time termina o discovery com o cliente" },
      { papel: "ia", texto: "Gera BC e PRD no padrão da subárea" },
      { papel: "pessoa", texto: "Time lê e valida em até 2h" },
      { papel: "pessoa", texto: "Dev e Dados recebem o handoff" },
    ],
    decisao:
      "Sem dado medido, o documento não inventa retorno. Uma trava contra alucinação, escrita na própria skill.",
    metricas: [{ recibo: "bcTempo" }, { recibo: "bcQualidade" }, { recibo: "bcConversao" }],
    stack: ["Claude", "Claude Skills", "Google Docs"],
  },
  {
    id: "avaliador",
    titulo: "Avaliador de Protótipos",
    curto: "Protótipos",
    contexto: "CITi · uso interno",
    status: "Em uso, sem números ainda",
    problema:
      "Os protótipos do discovery passaram a ser feitos com IA, e ficou mais rápido gerar telas do que revisar se elas funcionam para quem vai usar.",
    construi:
      "Uma skill que audita protótipos feitos com IA pelas 10 heurísticas de Nielsen e devolve os problemas por gravidade, antes de o protótipo chegar ao cliente.",
    fluxo: [
      { papel: "pessoa", texto: "Time gera o protótipo com IA" },
      { papel: "ia", texto: "Audita pelas heurísticas de Nielsen" },
      { papel: "pessoa", texto: "Time corrige e apresenta ao cliente" },
    ],
    decisao: "A IA aponta o problema e a heurística violada. Quem decide o que corrigir é o time.",
    metricas: [],
    stack: ["Claude", "Claude Skills"],
  },
  {
    id: "formacao",
    titulo: "Formação do time em IA",
    curto: "Formação",
    contexto: "CITi · gestão 26.2",
    status: "Em uso, sem números ainda",
    problema:
      "A subárea nasceu da antiga área de Design. O time usava IA só na teoria, e o maior serviço da área era tocado por uma equipe júnior.",
    construi:
      "Defini \"AI Product Builder\" como o perfil-alvo da subárea. A matriz de competências passou de 20 para 26 itens, com um bloco de IA e Product Building, e criei um programa de formação de 6 semanas.",
    fluxo: [
      { papel: "pessoa", texto: "Autoavaliação de competências" },
      { papel: "pessoa", texto: "Programa de 6 semanas" },
      { papel: "ia", texto: "Skills viram ferramenta do dia a dia" },
    ],
    decisao: "As skills só funcionam se o time souber revisar o que a IA entrega. A formação é o que segura o sistema.",
    metricas: [],
    nota: "Duas gerentes conduziram projetos sozinhas com as skills, e os dois terminaram no prazo. O sistema não depende da líder para dar resultado.",
    stack: ["Matriz de competências", "Programa de 6 semanas"],
  },
];

export const emConstrucao: Caso = {
    id: "reclamacoes",
    titulo: "Triagem de reclamações de delivery",
    curto: "Reclamações",
    contexto: "Projeto próprio · entrega prevista para 12/11",
    status: "Em construção",
    problema:
      "Uma plataforma de delivery recebe milhares de reclamações por dia. Decidir a categoria, o responsável e o reembolso de cada uma toma tempo e sai inconsistente.",
    construi:
      "Um agente que classifica a reclamação, aponta o responsável e escreve a resposta. O reembolso sai de regras fixas, e casos acima do limite vão para uma pessoa. A taxa de acerto vai ser publicada aqui, medida em 100 casos de teste. Os dados são fictícios.",
    fluxo: [
      { papel: "pessoa", texto: "Cliente envia a reclamação" },
      { papel: "ia", texto: "Classifica e aponta o responsável" },
      { papel: "regra", texto: "Define o reembolso pela política" },
      { papel: "pessoa", texto: "Atendente revisa os casos acima do limite" },
    ],
    decisao: "Mesma tese do agente de pré-venda: a IA interpreta, a regra decide o dinheiro.",
    metricas: [],
    stack: ["Next.js", "Claude API", "Avaliação com casos de teste"],
  };

export const principios = [
  {
    titulo: "A IA interpreta, a regra decide",
    texto: "Preço e reembolso saem de código. A IA responde a critérios que dá para conferir.",
  },
  {
    titulo: "Uma pessoa aprova antes do cliente",
    texto: "Nada chega ao cliente sem alguém do time ler e aprovar.",
  },
  {
    titulo: "Toda afirmação tem fonte",
    texto: "Cada risco da triagem cita o minuto da reunião em que o cliente falou.",
  },
  {
    titulo: "Todo número tem recibo",
    texto: "Estimativa leva \"~\" e nunca é arredondada para cima.",
  },
];

export type Experimento = {
  titulo: string;
  texto: string;
  stack: string[];
  link?: { href: string; label: string };
};

export const experimentos: Experimento[] = [
  {
    titulo: "MUSE",
    texto: "App de guarda-roupa que cataloga roupas por foto e sugere looks com IA. Construído do zero e publicado.",
    stack: ["Next.js", "Supabase", "Claude API", "Photoroom API"],
    link: { href: "https://muse-app-sooty.vercel.app", label: "Abrir o app" },
  },
  {
    titulo: "Forma",
    texto: "Site de uma arquiteta fictícia com um passeio em vídeo gerado por IA. Os 9 clipes custaram US$ 2,84, sem refações.",
    stack: ["Next.js", "Claude API", "Seedance 2.0"],
    link: { href: "https://forma-iota-pink.vercel.app/how-it-was-built", label: "Ler o estudo de caso" },
  },
];

// O funil da operação, de ponta a ponta. Cada etapa abre um capítulo.
export type Etapa = { id: string; nome: string; ferramenta: string; capitulo: string; papel: Papel };

export const mapa: Etapa[] = [
  { id: "lead", nome: "Lead chega", ferramenta: "Comercial", capitulo: "pre-venda", papel: "pessoa" },
  { id: "triagem", nome: "Triagem e preço", ferramenta: "Skill + regra", capitulo: "pre-venda", papel: "ia" },
  { id: "perguntas", nome: "Perguntas ao cliente", ferramenta: "n8n", capitulo: "pre-venda", papel: "ia" },
  { id: "prototipo", nome: "Discovery e protótipo", ferramenta: "Skill", capitulo: "avaliador", papel: "ia" },
  { id: "handoff", nome: "Business Case e PRD", ferramenta: "Skill", capitulo: "bc-prd", papel: "ia" },
  { id: "dev", nome: "Desenvolvimento", ferramenta: "Dev e Dados", capitulo: "bc-prd", papel: "pessoa" },
];

// A home: uma linha por case. Mantenha no máximo 4.
export type Porta = {
  no: string;
  id: string;
  titulo: string;
  escopo: string;
  ano: string;
  blurb: string;
  recibo?: string;
  href: string;
  externo?: boolean;
  emObra?: boolean;
};

export const portas: Porta[] = [
  {
    no: "01",
    id: "operacao",
    titulo: "Operação AI-native",
    escopo: "CITi · liderança + construção",
    ano: "2026",
    blurb: "Criei a subárea de Produto do CITi com a IA trabalhando em cada etapa, do lead ao desenvolvimento.",
    recibo: "contratos",
    href: "/cases/operacao",
  },
  {
    no: "02",
    id: "pre-venda",
    titulo: "Agente de pré-venda",
    escopo: "Claude · skills · n8n",
    ano: "2026",
    blurb: "A IA lê a reunião e aponta os riscos. Uma regra fixa calcula o preço. Uma pessoa aprova.",
    recibo: "esforco",
    href: "/cases/pre-venda",
  },
  {
    no: "03",
    id: "reclamacoes",
    titulo: "Reclamações de delivery",
    escopo: "Agente + avaliação",
    ano: "2026",
    blurb: "Triagem de reclamações com reembolso por regra e taxa de acerto publicada. Em construção.",
    href: "/cases/reclamacoes",
    emObra: true,
  },
  {
    no: "04",
    id: "musa",
    titulo: "MUSE",
    escopo: "App com IA, do zero",
    ano: "2026",
    blurb: "Guarda-roupa que cataloga roupas por foto e sugere looks. Construído e publicado sozinha.",
    href: "https://muse-app-sooty.vercel.app",
    externo: true,
  },
];
