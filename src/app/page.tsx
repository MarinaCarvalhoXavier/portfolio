import { HeroTermico } from "@/components/HeroTermico";
import { Topo } from "@/components/Topo";
import { MarcaRolagem } from "@/components/MarcaRolagem";
import { Pilula } from "@/components/Pilula";
import { CardsCases } from "@/components/CardsCases";
import { OutrosProjetos } from "@/components/OutrosProjetos";
import { CalorNosTitulos } from "@/components/CalorNosTitulos";
import { SecaoHistoria, SecaoContato } from "@/components/SecaoFinal";

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
          Sou designer e não sabia programar. Hoje lidero a subárea de Produto do CITi, onde agentes de IA fazem
          triagem, precificação e documentação, e o time entrega no prazo.
        </p>
      </section>

      <CardsCases />
      <OutrosProjetos />
      <SecaoHistoria />
      <SecaoContato />
      <CalorNosTitulos />
    </main>
  );
}
