import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import {
  Hammer,
  Sun,
  Ruler,
  Wrench,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Zap,
  CloudDownload,
  RefreshCw,
  Gift,
} from "lucide-react";

const PATH = "/sobre";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Sobre", path: PATH },
];

export const Route = createFileRoute("/sobre")({
  head: () =>
    pageHead({
      title: "Sobre a Obra Métrica | Calculadoras para Construção Civil",
      description:
        "Conheça a Obra Métrica, plataforma especializada em calculadoras técnicas para construção civil, energia solar e conversores de medidas.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "Sobre a Obra Métrica",
        url: `${SITE_URL}${PATH}`,
        description:
          "Plataforma brasileira de calculadoras técnicas para construção civil, energia solar e conversores de medidas.",
      },
    }),
  component: SobrePage,
});

const offerings = [
  { icon: Hammer, title: "Calculadoras para Construção Civil", desc: "Tijolos, concreto, argamassa, piso e tinta." },
  { icon: Sun, title: "Calculadoras de Energia Solar", desc: "Dimensionamento de placas e estimativa de economia." },
  { icon: Ruler, title: "Conversores de Medidas", desc: "Unidades de comprimento, área e volume." },
  { icon: Wrench, title: "Ferramentas Técnicas", desc: "Recursos práticos para o dia a dia da obra." },
  { icon: BookOpen, title: "Conteúdo Educativo", desc: "Artigos e guias para apoiar suas decisões." },
  { icon: Sparkles, title: "Novas Calculadoras", desc: "Em constante desenvolvimento e atualização." },
];

const benefits = [
  { icon: Gift, title: "Gratuito", desc: "Acesso livre a todas as ferramentas." },
  { icon: CheckCircle2, title: "Fácil de usar", desc: "Interface objetiva e intuitiva." },
  { icon: Smartphone, title: "Computador e celular", desc: "Totalmente responsivo." },
  { icon: Zap, title: "Cálculos rápidos", desc: "Resultados em segundos." },
  { icon: CloudDownload, title: "Sem instalação", desc: "Funciona direto no navegador." },
  { icon: RefreshCw, title: "Atualizações frequentes", desc: "Melhorias contínuas." },
];

function SobrePage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Institucional
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Sobre a Obra Métrica
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Cálculos inteligentes para construir melhor — ferramentas técnicas, gratuitas e acessíveis
          a qualquer profissional ou estudante.
        </p>

        <article className="mt-12 space-y-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Quem somos</h2>
            <p className="mt-3 text-muted-foreground">
              A Obra Métrica é uma plataforma brasileira desenvolvida para facilitar cálculos
              técnicos utilizados na construção civil, energia solar e conversão de unidades.
            </p>
            <p className="mt-3 text-muted-foreground">
              Nosso objetivo é disponibilizar ferramentas gratuitas, rápidas e confiáveis para
              profissionais, estudantes, engenheiros, arquitetos, técnicos, instaladores e qualquer
              pessoa que precise realizar cálculos com precisão.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Nossa missão</h2>
            <p className="mt-3 text-muted-foreground">
              Simplificar cálculos técnicos através de ferramentas inteligentes, economizando tempo
              e reduzindo erros em projetos e orçamentos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">O que oferecemos</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Compromisso com a qualidade
            </h2>
            <p className="mt-3 text-muted-foreground">
              Todas as calculadoras são desenvolvidas utilizando fórmulas técnicas reconhecidas e
              amplamente aplicadas no setor.
            </p>
            <p className="mt-3 text-muted-foreground">
              Os resultados possuem caráter informativo e podem variar conforme normas técnicas
              vigentes, especificações de fabricantes, características dos materiais e condições
              específicas de cada obra.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Por que utilizar a Obra Métrica?
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-lg border border-border bg-card p-5"
                >
                  <Icon className="h-6 w-6 shrink-0 text-foreground" aria-hidden />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight">Nosso compromisso</h2>
            <p className="mt-3 text-primary-foreground/90">
              Atuamos com foco em qualidade, transparência e melhoria contínua. Buscamos refinar
              constantemente a precisão das ferramentas e a experiência do usuário, oferecendo um
              ambiente confiável para quem depende de cálculos técnicos no dia a dia.
            </p>
          </div>
        </article>
      </section>
    </SiteLayout>
  );
}
