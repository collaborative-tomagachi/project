import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, type ManifestV3Export } from "@crxjs/vite-plugin";
import manifest from "./manifest.config.ts";
import zip from "vite-plugin-zip-pack";
import { name, version } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": `${resolve(__dirname, "src")}`,
      "@shared": resolve(__dirname, "src/shared"),
      "@components": resolve(__dirname, "src/components"),
      "@assets": resolve(__dirname, "src/assets"),
    },
  },
  plugins: [
    react(),
    crx({
      manifest: manifest as ManifestV3Export,
      browser: "firefox",
      contentScripts: {
        injectCss: true,
      },
    }),
    zip({ outDir: "release", outFileName: `crx-${name}-${version}.zip` }),
  ],
  publicDir: resolve(__dirname, "public"),
  // Only have to specify the panel page because sidebar_action isn't recognized by @crxjs/vite-plugin
  build: {
    rollupOptions: {
      input: {
        panel: resolve(__dirname, "src/pages/panel/index.html"),
      },
    },
  },
});
