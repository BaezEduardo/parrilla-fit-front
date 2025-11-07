// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_TARGET = "https://api.parrillafit.castelancarpinteyro.com";

export default defineConfig({
  plugins: [react()],
  base: "/",                // producción: app servida en la raíz del dominio
  server: {
    port: 5173,             // opcional, por claridad
    strictPort: true,       // falla si el puerto está ocupado (para no confundir)
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,      // permite https con cert de pruebas (si usas el remoto)
      },
    },
  }
});
