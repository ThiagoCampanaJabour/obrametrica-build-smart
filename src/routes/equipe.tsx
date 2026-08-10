import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { Users, Link2, Mail, CheckCircle, Award, Target, History } from "lucide-react";

const PATH = "/equipe";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Sobre a Equipe", path: PATH },
];

export const Route = createFileRoute("/equipe")({
  head: () =>
    pageHead({
      title: "Equipe e Especialistas — ObraMétrica",
      description: "Conheça os profissionais por trás das calculadoras e conteúdos técnicos da Obra Métrica. Especialistas em construção civil e energia solar.",
      path: PATH,
    }),
  component: EquipePage,
});

const specialists = [
  {
    name: "Thiago O. M.",
    role: "Fundador & Especialista em Gestão de Obras",
    bio: "Engenheiro com vasta experiência em planejamento e controle de custos na construção civil. Idealizador da ObraMétrica para democratizar o acesso a cálculos precisos.",
    linkedin: "#",
    image: "/obrametrica-logo-sm.webp",
  },
  {
    name: "Corpo Técnico ObraMétrica",
    role: "Revisão e Validação de Fórmulas",
    bio: "Nossa equipe multidisciplinar garante que cada calculadora siga as normas vigentes (NBR 5410, NBR 6118, etc.) e utilize os coeficientes de mercado mais atualizados.",
    linkedin: "#",
    image: "/obrametrica-logo-sm.webp",
  }
];

const pillars = [
  {
    icon: Target,
    title: "Nossa Missão",
    text: "Fornecer ferramentas técnicas de alta precisão que reduzam o desperdício em canteiros de obras e otimizem o investimento em energia renovável.",
  },
  {
    icon: Award,
    title: "Qualidade Técnica",
    text: "Todos os nossos algoritmos são validados contra normas técnicas brasileiras e testados em cenários reais antes de serem disponibilizados.",
  },
  {
    icon: History,
    title: "Nossa História",
    text: "Nascemos da necessidade de simplificar cálculos complexos que antes exigiam planilhas extensas, transformando-os em interfaces intuitivas.",
  }
];

function EquipePage() {
  return (
    <SiteLayout>
      <div className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={CRUMBS} />
          
          <div className="mt-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Quem faz a <span className="text-primary">ObraMétrica</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Conheça as mentes e a metodologia por trás das ferramentas que ajudam milhares de brasileiros a construir com inteligência.
            </p>
          </div>

          {/* Missão e Valores */}
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>

          {/* Especialistas */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12 flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-primary" /> Especialistas
            </h2>
            <div className="grid gap-12 md:grid-cols-2 lg:px-20">
              {specialists.map((pro) => (
                <div key={pro.name} className="flex flex-col sm:flex-row gap-6 items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-shadow">
                  <div className="h-24 w-24 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden border-2 border-primary/20">
                    <img src={pro.image} alt={pro.name} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{pro.name}</h3>
                    <p className="text-sm font-medium text-primary mb-3">{pro.role}</p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{pro.bio}</p>
                    <div className="flex gap-4">
                      <a href={pro.linkedin} className="text-slate-400 hover:text-[#0077b5] transition-colors">
                        <Link2 className="h-5 w-5" />
                      </a>
                      <a href={`mailto:obrametricasite@gmail.com`} className="text-slate-400 hover:text-primary transition-colors">
                        <Mail className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E-A-T Badges */}
          <div className="mt-20 rounded-3xl bg-primary p-8 sm:p-12 text-white">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Credibilidade e Transparência</h2>
                <p className="text-primary-foreground/90 text-lg">
                  Nossa metodologia é aberta e baseada em referências acadêmicas e normativas. Não somos apenas um site de cálculos, somos um portal de conhecimento técnico.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-accent" /> Revisão Humana
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-accent" /> Normas NBR
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-accent" /> Dados Atualizados
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-bold text-accent">100%</span>
                    <span className="text-xs uppercase mt-2 opacity-80">Cálculos Seguros</span>
                  </div>
                  <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-bold text-accent">+30</span>
                    <span className="text-xs uppercase mt-2 opacity-80">Ferramentas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
