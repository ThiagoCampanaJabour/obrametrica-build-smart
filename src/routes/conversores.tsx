import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/conversores")({
  head: () => ({
    meta: [
      { title: "Conversores · ObraMétrica" },
      {
        name: "description",
        content:
          "Conversores técnicos de unidades para a engenharia e construção: área, comprimento e volume.",
      },
      { property: "og:title", content: "Conversores · ObraMétrica" },
      { property: "og:description", content: "Conversores técnicos de unidades." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
