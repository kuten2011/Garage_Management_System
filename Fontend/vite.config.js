import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    allowedHosts: ["performing-sizes-given-timing.trycloudflare.com"]
  },

  build: {
    rollupOptions: { external: [] },
    commonjsOptions: { include: [/lucide-react/, /node_modules/] },
  },

  optimizeDeps: {
    include: ["lucide-react"],
  },
});