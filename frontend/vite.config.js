import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost/wine-shop/backend/public", // ton backend MAMP
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // enlève le /api devant
      },
    },
  },
});
