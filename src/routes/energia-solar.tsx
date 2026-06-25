import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";

export const Route = createFileRoute("/energia-solar")({
  head: () => ({
    meta: [
      { title: "Energia Solar · ObraMétrica" },
      { name: "description", content: "Calculadoras de energia solar: dimensionamento, geração e payback." },
      { property: "og:title", content: "Energia Solar · ObraMétrica" },
      { property: "og:description", content: "Calculadoras de energia solar." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <PagePlaceholder
        title="Energia Solar"
        description="Dimensionamento de sistemas fotovoltaicos, geração estimada e retorno do investimento."
      />
    </SiteLayout>
  ),
});
