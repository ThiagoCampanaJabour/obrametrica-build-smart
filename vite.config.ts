// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const serverEntryShimPlugin = () => ({
  name: "tanstack-start-server-entry-shim",
  // TanStack Start's preview plugin expects the server entry at
  // dist/server/server.js, but Nitro emits it as dist/server/index.mjs.
  // Write a tiny re-export shim so `vite preview` can load it.
  closeBundle: () => {
    const outDir = join(process.cwd(), "dist", "server");
    const indexPath = join(outDir, "index.mjs");
    const shimPath = join(outDir, "server.js");
    if (existsSync(indexPath) && !existsSync(shimPath)) {
      writeFileSync(
        shimPath,
        'import mod from "./index.mjs";\n' +
          "export default {\n" +
          "  fetch(request, env, ctx) {\n" +
          "    try { Object.defineProperty(request, 'ip', { value: void 0, writable: true, configurable: true }); } catch {}\n" +
          "    const safeCtx = { waitUntil: () => {}, ...(ctx || {}) };\n" +
          "    if (!safeCtx.waitUntil) safeCtx.waitUntil = () => {};\n" +
          "    return mod.fetch(request, env ?? {}, safeCtx);\n" +
          "  }\n" +
          "};\n",
        "utf8",
      );
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
