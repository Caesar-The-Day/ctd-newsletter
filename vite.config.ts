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
      const tmp = path.resolve(__dirname, "dist-tmp-regions");
      fs.rmSync(tmp, { recursive: true, force: true });
      fs.renameSync(out, tmp);
      fs.mkdirSync(out);
      fs.renameSync(tmp, path.join(out, "regions"));
      fs.copyFileSync(path.join(out, "regions", "index.html"), path.join(out, "index.html"));
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
  plugins: [react(), mode === "development" && componentTagger(), nestUnderBase()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
