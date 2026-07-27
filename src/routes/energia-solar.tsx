import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/energia-solar")({
  component: () => <Outlet />,
});
