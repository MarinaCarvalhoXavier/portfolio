# Portfólio — Marina Xavier

**Site:** https://marinaxavier.vercel.app

Portfólio feito para a trilha AI Builder do Programa GenAI do iFood. Sou designer, Líder de Produto na CITi e construo com IA.

## Os cases

- **Uma área inteira em cima de IA:** a subárea de Produto da CITi, com agentes em cada etapa, do lead ao desenvolvimento.
- **Agente de pré-venda:** a IA lê a reunião e aponta os riscos; uma regra fixa decide o preço.
- **MUSE:** um guarda-roupa com IA que construí do zero ([app](https://muse-app-sooty.vercel.app) · [código](https://github.com/MarinaCarvalhoXavier/muse-app)).
- **Outros projetos:** [Forma](https://github.com/MarinaCarvalhoXavier/forma), uma curadoria semanal automática e um avaliador de protótipos.

## Como foi feito

- Todo o código foi escrito pelo **Claude Code**, com direção e revisão minhas.
- **Next.js 15**, TypeScript e CSS, publicado na **Vercel**.
- **Fundo térmico:** um shader WebGL escrito do zero. O cursor é uma bola térmica que deixa rastro, e o título é desenhado dentro do shader.
- **Componentes:** MicroSlats e CircularCarousel, do [React Bits](https://reactbits.dev).
- **Tipografia:** Tanker e Switzer ([Fontshare](https://www.fontshare.com), licença ITF Free Font) e Martian Mono (Google Fonts).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:3000.

## Onde mexer

- `src/app/page.tsx`: a home (topo, cards dos cases, outros projetos, história e contato).
- `src/components/CardsCases.tsx`: os cards dos cases e o que cada um prova para a vaga.
- `src/components/Secao*.tsx`: o conteúdo de cada página de case.
- `src/components/HeroTermico.tsx`: o efeito térmico do topo.
