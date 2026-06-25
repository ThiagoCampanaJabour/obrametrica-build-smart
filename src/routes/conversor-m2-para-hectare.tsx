import { createFileRoute } from "@tanstack/react-router";
import { UnitConverter } from "@/components/unit-converter";
import { pageHead } from "@/lib/seo";

const PATH = "/conversor-m2-para-hectare";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Conversores", path: "/conversores" },
  { name: "m² para Hectare", path: PATH },
];

export const Route = createFileRoute("/conversor-m2-para-hectare")({
  head: () => pageHead({
    title: "Conversor de m² para Hectare — Online e Grátis | ObraMétrica",
    description: "Converta metros quadrados (m²) para hectares (ha) instantaneamente. 1 hectare = 10.000 m².",
    path: PATH,
    breadcrumbs: CRUMBS,
  }),
  component: () => (
    <UnitConverter
      title="Conversor de m² para Hectare"
      description="Converta metros quadrados para hectares em tempo real."
      fromLabel="Valor em metros quadrados"
      fromUnit="m²"
      toLabel="Valor em hectares"
      toUnit="ha"
      convert={(m2) => m2 / 10000}
      formula={<>1 hectare = 10.000 m². Divida o valor em m² por 10.000.</>}
      breadcrumbs={CRUMBS}
    />
  ),
});
