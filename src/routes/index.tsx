import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { AdTop, AdMiddle, AdBottom } from "@/components/ads";
import { Building2, Sun, Calculator, ArrowRight } from "lucide-react";
import { pageHead, SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "ObraMétrica — Calculadoras para Construção Civil, Energia Solar e Conversores",
      description: SITE_DESCRIPTION,
      path: "/",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    }),
  component: Index,
});

const categories = [
  {
    to: "/construcao-civil" as const,
    icon: Building2,
    title: "Construção Civil",
    desc: "Concreto, alvenaria, pisos, tinta e argamassa.",
  },
  {
    to: "/energia-solar" as const,
    icon: Sun,
    title: "Energia Solar",
    desc: "Dimensionamento de sistemas e economia estimada.",
  },
  {
    to: "/conversores" as const,
    icon: Calculator,
    title: "Conversores",
    desc: "Unidades técnicas para o dia a dia da obra.",
  },
];

function Index() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              ObraMétrica
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Cálculos inteligentes para <span className="text-accent">construir melhor</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80">
              O **ObraMétrica** é a sua central definitiva de ferramentas técnicas para engenharia, arquitetura e energia renovável. Nossa missão é simplificar cálculos complexos, reduzindo o desperdício de materiais na construção civil e otimizando o retorno financeiro em projetos de energia solar.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/construcao-civil"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-bold text-accent-foreground transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Calculadoras de Obra
              </Link>
              <Link
                to="/energia-solar"
                className="inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 text-base font-bold text-white transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Energia Solar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdTop />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Ferramentas Especializadas</h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Desenvolvemos algoritmos precisos baseados nas normas técnicas brasileiras (NBR) para garantir que seu planejamento seja impecável. Seja você um profissional experiente ou alguém realizando sua primeira reforma, o ObraMétrica fornece os dados necessários para tomar decisões inteligentes.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <p className="text-muted-foreground"><strong>Economia Real:</strong> Evite a compra excessiva de cimento, tijolos e telhas com quantitativos exatos.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <p className="text-muted-foreground"><strong>Energia Limpa:</strong> Dimensione sistemas fotovoltaicos, calcule payback e compare baterias.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <p className="text-muted-foreground"><strong>Conversores Técnicos:</strong> Transforme unidades de massa, volume e energia instantaneamente.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {categories.map(({ to, icon: Icon, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-accent-foreground">
                  Acessar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-foreground">Por que confiar no ObraMétrica?</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Precisão Técnica</h3>
                <p className="mt-2 text-muted-foreground">
                  Nossos motores de cálculo são revisados por especialistas e atualizados conforme as mudanças nas normas ABNT NBR e resoluções da ANEEL.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Totalmente Gratuito</h3>
                <p className="mt-2 text-muted-foreground">
                  Acreditamos na democratização da informação técnica. Todas as nossas ferramentas são e continuarão sendo gratuitas para uso ilimitado.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Foco na Sustentabilidade</h3>
                <p className="mt-2 text-muted-foreground">
                  Ao otimizar o uso de materiais e incentivar a energia solar, ajudamos a reduzir o impacto ambiental do setor da construção civil.
                </p>
              </div>
            </div>
            
            <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
              <h3 className="text-xl font-bold text-foreground">Pronto para otimizar sua obra?</h3>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Milhares de engenheiros, arquitetos e proprietários utilizam o ObraMétrica diariamente para garantir a eficiência de seus projetos. Junte-se a eles e comece a calcular agora mesmo.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <Link to="/construcao-civil" className="font-bold text-accent hover:underline">Ver todas as calculadoras →</Link>
                <Link to="/equipe" className="font-bold text-accent hover:underline">Conheça nossa Equipe Técnica →</Link>
                <Link to="/metodologia" className="font-bold text-accent hover:underline">Nossa Metodologia →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdMiddle />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Guia Rápido de Ferramentas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Cálculo de Tijolos", path: "/calculadora-de-tijolos" },
            { name: "Volume de Concreto", path: "/calculadora-de-concreto" },
            { name: "Área de Placas Solares", path: "/energia-solar/calculadora-area-layout-paineis" },
            { name: "Payback Fotovoltaico", path: "/energia-solar/calculadora-payback" },
            { name: "Custo Total (TCO)", path: "/energia-solar/estimador-custo-total" },
            { name: "Perda em Tubulações", path: "/construcao-civil/perda-atrito-tubulacoes" },
            { name: "Dimensionamento Elétrico", path: "/construcao-civil/dimensionamento-eletrico" },
            { name: "Conversor kW ↔ kWh", path: "/energia-solar/conversor-kw-kwh" },
          ].map((calc) => (
            <Link 
              key={calc.path} 
              to={calc.path as any}
              className="rounded-lg border border-border p-4 text-sm font-medium hover:bg-muted transition-colors text-center"
            >
              {calc.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdBottom />
      </div>

    </SiteLayout>
  );
}
