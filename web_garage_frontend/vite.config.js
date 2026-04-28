import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    allowedHosts: ["acorn-manger-rekindle.ngrok-free.dev"],
    proxy: {
      "/admin": { target: "http://localhost:8080", changeOrigin: true },
      "/web_garage": { target: "http://localhost:8080", changeOrigin: true },
      "/customer": { target: "http://localhost:8080", changeOrigin: true }, // ✅ thêm
      "/chatbot": { target: "http://localhost:8080", changeOrigin: true }, // ✅ thêm nếu dùng
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
