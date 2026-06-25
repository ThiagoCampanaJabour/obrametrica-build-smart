import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/construcao-civil")({
  head: () => ({
    meta: [
      { title: "Construção Civil · ObraMétrica" },
      { name: "description", content: "Calculadoras de construção civil: tijolos, concreto, piso, tinta e argamassa." },
      { property: "og:title", content: "Construção Civil · ObraMétrica" },
      { property: "og:description", content: "Calculadoras de construção civil." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
