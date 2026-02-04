import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const target = process.env.TARGET;

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({}),
    ...(target === "vercel"
      ? [
        nitroV2Plugin({
          preset: "vercel",
          compatibilityDate: "2025-10-26",
        }),
      ]
      : []),
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
  ],
  ssr: { external: ["@faker-js"] },
  build: {
    rollupOptions: {
      external: ["@faker-js"],
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  }
});

export default config;
