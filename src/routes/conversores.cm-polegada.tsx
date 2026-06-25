import { createFileRoute } from "@tanstack/react-router";
import { UnitConverter } from "@/components/unit-converter";

export const Route = createFileRoute("/conversores/cm-polegada")({
  head: () => ({
    meta: [
      { title: "cm para Polegada · ObraMétrica" },
      { name: "description", content: "Converta centímetros para polegadas instantaneamente." },
      { property: "og:title", content: "cm para Polegada · ObraMétrica" },
      { property: "og:description", content: "Conversor de comprimento: cm para polegadas." },
    ],
  }),
  component: () => (
    <UnitConverter
      title="cm para Polegada"
      description="Converta centímetros para polegadas em tempo real."
      fromLabel="Valor em centímetros"
      fromUnit="cm"
      toLabel="Valor em polegadas"
      toUnit="in"
      convert={(cm) => cm / 2.54}
      formula={<>1 polegada = 2,54 cm. Divida o valor em cm por 2,54.</>}
    />
  ),
});
