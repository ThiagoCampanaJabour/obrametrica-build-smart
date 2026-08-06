import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import {
  KwKwhForm,
  DEFAULT_FORM,
  resolveFactor,
  type KwKwhFormState,
} from "@/components/SolarConverter/KwKwhForm";
import { ResultsSummary } from "@/components/SolarConverter/ResultsSummary";
import { ExamplesPanel } from "@/components/SolarConverter/ExamplesPanel";
import { energyFromPower, powerFromEnergy, sensitivityRange } from "@/lib/solar/kwkwh";

const PATH = "/energia-solar/conversor-kw-kwh";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Conversor kW ↔ kWh", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como converter kWp instalados em kWh por ano?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Multiplique a potência em kWp pelo fator de produção anual do local (kWh/kWp/ano) e pelo Performance Ratio. Exemplo: 5 kWp × 1.500 kWh/kWp/ano × 0,86 = 6.450 kWh/ano.",
      },
    },
    {
      "@type": "Question",
      name: "O que é o fator de produção (specific yield)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "É a energia anual entregue por quilowatt-pico instalado, em kWh/kWp/ano. No Brasil varia de cerca de 1.200 no Sul a mais de 1.900 no Nordeste, dependendo de irradiação, inclinação, orientação e perdas.",
      },
    },
    {
      "@type": "Question",
      name: "Qual Performance Ratio usar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use 0,86 (perdas de 14%) como padrão para instalações bem executadas, 0,75 em cenários conservadores com sombreamento ou sujidade alta e 0,90 apenas para usinas novas, ventiladas e com limpeza frequente.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/conversor-kw-kwh")({
  head: () =>
    pageHead({
      title: "Conversor kW ↔ kWh Solar (produção por kWp) | ObraMétrica",
      description:
        "Converta potência instalada (kWp) em produção anual (kWh) e vice-versa, com fatores por cidade, Performance Ratio, ajuste de inclinação e número de módulos.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Conversor kW ↔ kWh (Produção por Potência Instalada)",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: ConversorKwKwhPage,
});

function ConversorKwKwhPage() {
  const [form, setForm] = useState<KwKwhFormState>(DEFAULT_FORM);

  const fator = useMemo(() => resolveFactor(form), [form]);

  const direto = useMemo(
    () =>
      form.modo === "kwp-to-kwh" ? energyFromPower(form.valor, fator, form.losses_pct) : null,
    [form.modo, form.valor, fator, form.losses_pct],
  );

  const inverso = useMemo(
    () =>
      form.modo === "kwh-to-kwp"
        ? powerFromEnergy(form.valor, fator, form.losses_pct, {
            module_power_W: form.modulo_W,
            spare_pct: form.spare_pct,
          })
        : null,
    [form.modo, form.valor, fator, form.losses_pct, form.modulo_W, form.spare_pct],
  );

  const sensibilidade = useMemo(
    () => sensitivityRange(form.modo, form.valor, fator, form.losses_pct),
    [form.modo, form.valor, fator, form.losses_pct],
  );

  const exportPayload = useMemo(
    () => ({
      ferramenta: "conversor-kw-kwh",
      gerado_em: new Date().toISOString(),
      entradas: { ...form, fator_efetivo_kwh_por_kwp_ano: fator },
      resultados: form.modo === "kwp-to-kwh" ? direto : inverso,
      sensibilidade,
    }),
    [form, fator, direto, inverso, sensibilidade],
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Conversor kW ↔ kWh · Produção por potência instalada
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Estime a geração anual de um sistema fotovoltaico a partir da potência instalada em kWp
          — ou o caminho inverso, descobrindo quantos kWp são necessários para cobrir uma meta de
          consumo. Os fatores de produção vêm de presets por cidade e podem ser substituídos por
          horas equivalentes de sol e Performance Ratio próprios. Para detalhar as perdas item a
          item, use a{" "}
          <a
            href="/energia-solar/calculadora-perdas-eficiencia"
            className="underline hover:text-accent"
          >
            calculadora de perdas e eficiência
          </a>
          .
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <KwKwhForm state={form} onChange={setForm} />
          <ResultsSummary
            modo={form.modo}
            entrada={form.valor}
            fator={fator}
            losses_pct={form.losses_pct}
            direto={direto}
            inverso={inverso}
            sensibilidade={sensibilidade}
            exportPayload={exportPayload}
          />
        </div>

        <div className="mt-6">
          <ExamplesPanel
            onLoad={(ex) =>
              setForm((prev) => ({
                ...prev,
                modo: ex.modo,
                valor: ex.valor,
                cidadeId: ex.cidadeId,
                fator: ex.fator,
                fonteFator: "manual",
                losses_pct: ex.losses_pct,
                modulo_W: ex.modulo_W,
              }))
            }
          />
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Fórmulas utilizadas</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">kWp → kWh:</strong> Energia (kWh/ano) = Potência
              (kWp) × Fator (kWh/kWp/ano) × (1 − perdas)
            </li>
            <li>
              <strong className="text-foreground">kWh → kWp:</strong> Potência (kWp) = Energia
              (kWh/ano) ÷ [Fator × (1 − perdas)]
            </li>
            <li>
              <strong className="text-foreground">Fator por HE:</strong> Fator ≈ Horas
              equivalentes (h/ano) × Performance Ratio
            </li>
            <li>
              <strong className="text-foreground">Módulos:</strong> Quantidade = arredondar para
              cima (kWp × 1000 ÷ potência do módulo) × (1 + reserva)
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Premissas sempre visíveis: o fator e as perdas adotados aparecem no resultado. Os
            valores anuais são médias e não representam a variação mês a mês nem eventos de
            sombreamento pontual.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
