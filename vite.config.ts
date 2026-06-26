// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const serverEntryShimPlugin = () => ({
  name: "tanstack-start-server-entry-shim",
  closeBundle: () => {
    const outDir = join(process.cwd(), "dist", "server");
    const indexPath = join(outDir, "index.mjs");
    const shimPath = join(outDir, "server.js");
    try {
      import("node:fs").then(({ statSync }) => {
        if (statSync(indexPath).isFile()) {
          writeFileSync(shimPath, 'export { default } from "./index.mjs";\n', "utf8");
        }
      }).catch(() => {});
    } catch {
      // ignore: preview or non-nitro build
    }
  },
});

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [serverEntryShimPlugin()],
  },
});
