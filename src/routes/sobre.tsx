import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";
import { pageHead } from "@/lib/seo";

const PATH = "/sobre";

export const Route = createFileRoute("/sobre")({
  head: () =>
    pageHead({
      title: "Sobre a ObraMétrica — Portal de Calculadoras Técnicas",
      description:
        "Conheça a ObraMétrica: portal brasileiro de calculadoras técnicas para construção civil, energia solar e conversões de unidades.",
      path: PATH,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Sobre", path: PATH },
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
