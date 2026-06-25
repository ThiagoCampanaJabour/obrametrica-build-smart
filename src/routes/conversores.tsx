import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";

export const Route = createFileRoute("/conversores")({
  head: () => ({
    meta: [
      { title: "Conversores · ObraMétrica" },
      { name: "description", content: "Conversores técnicos de unidades para a engenharia e construção." },
      { property: "og:title", content: "Conversores · ObraMétrica" },
      { property: "og:description", content: "Conversores técnicos de unidades." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <PagePlaceholder
        title="Conversores"
        description="Conversões de unidades técnicas: comprimento, área, volume, pressão, potência e mais."
      />
    </SiteLayout>
  ),
});
