import { createFileRoute } from "@tanstack/react-router";
import { UnitConverter } from "@/components/unit-converter";

export const Route = createFileRoute("/conversores/litros-m3")({
  head: () => ({
    meta: [
      { title: "Litros para m³ · ObraMétrica" },
      { name: "description", content: "Converta litros para metros cúbicos instantaneamente." },
      { property: "og:title", content: "Litros para m³ · ObraMétrica" },
      { property: "og:description", content: "Conversor de volume: litros para metros cúbicos." },
    ],
  }),
  component: () => (
    <UnitConverter
      title="Litros para m³"
      description="Converta litros para metros cúbicos em tempo real."
      fromLabel="Valor em litros"
      fromUnit="L"
      toLabel="Valor em metros cúbicos"
      toUnit="m³"
      convert={(liters) => liters / 1000}
      formula={<>1.000 litros = 1 m³. Divida o valor em litros por 1.000.</>}
    />
  ),
});
