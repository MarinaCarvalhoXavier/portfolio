import { HeroTermico } from "@/components/HeroTermico";
import { Topo } from "@/components/Topo";
import { MarcaRolagem } from "@/components/MarcaRolagem";
import { Pilula } from "@/components/Pilula";
import { CardsCases } from "@/components/CardsCases";
import { OutrosProjetos } from "@/components/OutrosProjetos";
import { CalorNosTitulos } from "@/components/CalorNosTitulos";
import { SecaoHistoria, SecaoContato } from "@/components/SecaoFinal";

// Dias de construção: de 01/11/2026 até a data em que o site é publicado (build estático).
const INICIO = new Date("2026-11-01T00:00:00-03:00");
const PUBLICADO = new Date();
const DIAS = Math.max(1, Math.ceil((PUBLICADO.getTime() - INICIO.getTime()) / 86_400_000));
const dataCurta = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Recife" });
const FEITO_EM = `${DIAS} ${DIAS === 1 ? "dia" : "dias"} (${dataCurta(INICIO)} a ${dataCurta(PUBLICADO)})`;

export default function Home() {
  return (
    <main>
      <section id="topo" className="hero" aria-labelledby="hero-titulo">
        <Topo pagina="home" />
        <MarcaRolagem />

        <div className="hero-conteudo">
          <p className="sobrelinha" data-termico>Designer que constrói com IA</p>
          <HeroTermico linhas={["Construí uma área inteira", "em cima de IA."]} />
          <div className="acoes">
            <Pilula href="#projetos" cheia>
              Ver projetos
            </Pilula>
            <Pilula href="#historia">Minha história</Pilula>
          </div>
        </div>

        <p className="hero-rodape" data-termico>
          Sou designer e não sabia programar. Hoje lidero a subárea de Produto da CITi, onde agentes de IA fazem
          triagem, precificação e documentação, e o time entrega no prazo.
        </p>
      </section>

      <CardsCases />
      <OutrosProjetos />
      <SecaoHistoria />
      <SecaoContato feitoEm={FEITO_EM} />
      <CalorNosTitulos />
    </main>
  );
}
