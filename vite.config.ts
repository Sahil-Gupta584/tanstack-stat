import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const target = process.env.TARGET;
console.log({ target });

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
    viteReact(),
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
