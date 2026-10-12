import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    outDir: "dist",
    // Tek dosyalık dağıtım: yazı tipleri dahil tüm varlıklar CSS/JS içine data URI olarak gömülür.
    assetsInlineLimit: 200 * 1024,
    // Tek dosya: dinamik import'lar (ör. Firebase) ayrı parçaya bölünmesin.
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
