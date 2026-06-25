import { createFileRoute } from "@tanstack/react-router";
import { UnitConverter } from "@/components/unit-converter";
import { pageHead } from "@/lib/seo";

const PATH = "/conversor-litros-para-m3";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Conversores", path: "/conversores" },
  { name: "Litros para m³", path: PATH },
];

export const Route = createFileRoute("/conversor-litros-para-m3")({
  head: () => pageHead({
    title: "Conversor de Litros para m³ — Online e Grátis | ObraMétrica",
    description: "Converta litros (L) para metros cúbicos (m³) instantaneamente. 1.000 litros = 1 m³.",
    path: PATH,
    breadcrumbs: CRUMBS,
  }),
  component: () => (
    <UnitConverter
      title="Conversor de Litros para m³"
      description="Converta litros para metros cúbicos em tempo real."
      fromLabel="Valor em litros"
      fromUnit="L"
      toLabel="Valor em metros cúbicos"
      toUnit="m³"
      convert={(liters) => liters / 1000}
      formula={<>1.000 litros = 1 m³. Divida o valor em litros por 1.000.</>}
      breadcrumbs={CRUMBS}
    />
  ),
});
