import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    allowedHosts: ["performing-sizes-given-timing.trycloudflare.com"],
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },

  build: {
    rollupOptions: { external: [] },
    commonjsOptions: { include: [/lucide-react/, /node_modules/] },
  },

  optimizeDeps: {
    include: ["lucide-react"],
  },
});
