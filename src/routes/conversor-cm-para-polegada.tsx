import { createFileRoute } from "@tanstack/react-router";
import { UnitConverter } from "@/components/unit-converter";
import { pageHead } from "@/lib/seo";
import { faqSchemaFor } from "@/data/calculators";

const PATH = "/conversor-cm-para-polegada";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Conversores", path: "/conversores" },
  { name: "cm para Polegada", path: PATH },
];

export const Route = createFileRoute("/conversor-cm-para-polegada")({
  head: () =>
    pageHead({
      title: "Conversor de cm para Polegada — Online e Grátis | ObraMétrica",
      description:
        "Converta centímetros (cm) para polegadas (in) instantaneamente. 1 polegada = 2,54 cm.",
      path: PATH,
      breadcrumbs: CRUMBS,
      extraSchemas: [faqSchemaFor(PATH)],
    }),
  component: () => (
    <UnitConverter
      extrasId={PATH}
      title="Conversor de cm para Polegada"
      description="Converta centímetros para polegadas em tempo real."
      fromLabel="Valor em centímetros"
      fromUnit="cm"
      toLabel="Valor em polegadas"
      toUnit="in"
      convert={(cm) => cm / 2.54}
      formula={<>1 polegada = 2,54 cm. Divida o valor em cm por 2,54.</>}
      breadcrumbs={CRUMBS}
    />
  ),
});
