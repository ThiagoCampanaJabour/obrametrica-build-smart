import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato · ObraMétrica" },
      { name: "description", content: "Entre em contato com a equipe da ObraMétrica." },
      { property: "og:title", content: "Contato · ObraMétrica" },
      { property: "og:description", content: "Fale conosco." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <PagePlaceholder
        title="Contato"
        description="Sugestões, dúvidas e parcerias: em breve um canal direto de contato."
      />
    </SiteLayout>
  ),
});
