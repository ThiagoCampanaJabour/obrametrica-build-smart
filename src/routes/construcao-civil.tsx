import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";

export const Route = createFileRoute("/construcao-civil")({
  head: () => ({
    meta: [
      { title: "Construção Civil · ObraMétrica" },
      { name: "description", content: "Calculadoras de construção civil: concreto, alvenaria, pisos e mais." },
      { property: "og:title", content: "Construção Civil · ObraMétrica" },
      { property: "og:description", content: "Calculadoras de construção civil." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <PagePlaceholder
        title="Construção Civil"
        description="Calculadoras para concreto, alvenaria, pisos, telhados, argamassa e muito mais."
      />
    </SiteLayout>
  ),
});
