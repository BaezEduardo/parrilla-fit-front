// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Para DESARROLLO: a dónde debe proxyear /api desde http://localhost:5173.
// Si quieres probar contra el backend remoto, cambia a:
//   const API_TARGET = "https://api.parrillafit.castelancarpinteyro.com";
const API_TARGET = "http://localhost:3000";

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
        // rewrite: (path) => path.replace(/^\/api/, ""), // solo si tu API no usa /api
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
