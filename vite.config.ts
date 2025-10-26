import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import webpackStatsPlugin from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const target = process.env.TARGET || "vercel";
console.log({ target });

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    nitroV2Plugin({
      preset: target || "node-server",
      compatibilityDate: "2025-10-26",
    }),
    viteReact(),
    webpackStatsPlugin(),
  ],
  server: { allowedHosts: ["08ee8c69800a.ngrok-free.app"] },
  ssr: { external: ["mapbox-gl", "@faker-js"] },
  build: {
    rollupOptions: {
      external: ["mapbox-gl", "@faker-js"],
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
});

export default config;
