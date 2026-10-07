import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Build output is moved into dist/regions/ so files exist at the URLs the
// "/regions/" base points to; a copy of index.html stays at dist/ root as the SPA fallback.
function nestUnderBase() {
  return {
    name: "nest-under-base",
    apply: "build" as const,
    closeBundle() {
      const out = path.resolve(__dirname, "dist");
      const nested = path.join(out, "regions");
      fs.mkdirSync(nested, { recursive: true });
      for (const entry of fs.readdirSync(out)) {
        if (entry === "regions") continue;
        fs.cpSync(path.join(out, entry), path.join(nested, entry), { recursive: true });
        fs.rmSync(path.join(out, entry), { recursive: true, force: true });
      }
      fs.copyFileSync(path.join(out, "regions", "index.html"), path.join(out, "index.html"));
    },
  };
}

// Dev only: page visits without the /regions prefix (e.g. /admin/regions) are
// redirected to /regions/... instead of Vite's "did you mean" error page.
function redirectToBase() {
  return {
    name: "redirect-to-base",
    apply: "serve" as const,
    configureServer(server: any) {
      server.middlewares.stack.unshift({ route: "", handle: (req: any, res: any, next: any) => {
        const url: string = req.url || "/";
        const accept: string = req.headers?.accept || "";
        if (url.startsWith("/regions") || !accept.includes("text/html")) return next();
        res.statusCode = 302;
        res.setHeader("Location", "/regions" + (url === "/" ? "/" : url));
        res.end();
      }});
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/regions/",
  server: {
    host: "::",
    port: 8080,
  },
  define: {
    // Ensure required public runtime env vars are always available in preview builds.
    // (These are publishable values; no private secrets here.)
    'import.meta.env.VITE_MAPTILER_KEY': JSON.stringify('S41LM8jeaS9EQcQkJCLr'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://jolbywwrnehhwodlgytt.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbGJ5d3dybmVoaHdvZGxneXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDczNTIsImV4cCI6MjA4MTU4MzM1Mn0.3UUV5PbolRzbZmo1_oCe9TgctYF1esT2xvA_izLR4SQ'
    ),
  },
  plugins: [react(), mode === "development" && componentTagger(), nestUnderBase(), redirectToBase()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
