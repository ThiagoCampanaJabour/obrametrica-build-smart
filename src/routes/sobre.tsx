import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre · ObraMétrica" },
      { name: "description", content: "Conheça a ObraMétrica, portal de calculadoras técnicas." },
      { property: "og:title", content: "Sobre · ObraMétrica" },
      { property: "og:description", content: "Conheça a ObraMétrica." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <PagePlaceholder
        title="Sobre"
        description="A ObraMétrica é um portal de calculadoras inteligentes para profissionais da construção."
      />
    </SiteLayout>
  ),
});
