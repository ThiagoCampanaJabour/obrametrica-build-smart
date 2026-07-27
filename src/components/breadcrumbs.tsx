import { ChevronRight, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Crumb } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumbs" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const label = "name" in it ? it.name : it.label;
          const path = "path" in it ? it.path : it.href;
          return (
            <li key={path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
              {last ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {label}
                </span>
              ) : (
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={path as any}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden />}
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
