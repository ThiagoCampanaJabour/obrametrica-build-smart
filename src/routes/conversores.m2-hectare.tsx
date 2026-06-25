import { createFileRoute } from "@tanstack/react-router";
import { UnitConverter } from "@/components/unit-converter";

export const Route = createFileRoute("/conversores/m2-hectare")({
  head: () => ({
    meta: [
      { title: "m² para Hectare · ObraMétrica" },
      { name: "description", content: "Converta metros quadrados para hectares instantaneamente." },
      { property: "og:title", content: "m² para Hectare · ObraMétrica" },
      { property: "og:description", content: "Conversor de área: m² para hectares." },
    ],
  }),
  component: () => (
    <UnitConverter
      title="m² para Hectare"
      description="Converta metros quadrados para hectares em tempo real."
      fromLabel="Valor em metros quadrados"
      fromUnit="m²"
      toLabel="Valor em hectares"
      toUnit="ha"
      convert={(m2) => m2 / 10000}
      formula={<>1 hectare = 10.000 m². Divida o valor em m² por 10.000.</>}
    />
  ),
});
