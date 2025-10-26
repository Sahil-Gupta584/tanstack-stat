import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    nitroV2Plugin({
      preset: "vercel",
    }),
    viteReact(),
  ],
  server: { allowedHosts: ["08ee8c69800a.ngrok-free.app"] },
  ssr: { external: ["mapbox-gl", "@faker-js"] },
  build: {
    rollupOptions: {
      external: ["mapbox-gl", "@faker-js"],
    },
    sourcemap: false,
  },
});

export default config;
