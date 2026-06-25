import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";
import { pageHead } from "@/lib/seo";

const PATH = "/contato";

export const Route = createFileRoute("/contato")({
  head: () =>
    pageHead({
      title: "Contato — Fale com a ObraMétrica",
      description:
        "Entre em contato com a equipe da ObraMétrica para sugestões, dúvidas ou parcerias.",
      path: PATH,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Contato", path: PATH },
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
