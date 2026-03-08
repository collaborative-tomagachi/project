import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  //   icons: {
  //     48: "icons/icon48x48.png",
  //     96: "icons/icon96x96.png",
  //   },
  action: {
    default_icon: "temp-icon.svg",
    default_title: pkg.name,
    default_popup: "src/pages/popup/index.html",
  },
  options_ui: {
    page: "src/pages/options/index.html",
  },
  content_scripts: [
    {
      js: ["src/scripts/content/main.tsx"],
      matches: ["https://*/*"],
    },
  ],
  background: {
    scripts: ["src/scripts/background/main.ts"],
  },
  permissions: ["sidePanel", "contentSettings", "notifications", "storage"], // Any Browser APIs we might want to use
  // Sidebar property for firefox isn't supported by @crxjs/vite-plugin
  // But will work, so just ignoring type errors
  // @ts-ignore
  sidebar_action: {
    default_icon: "temp-icon.svg",
    default_title: pkg.name,
    default_panel: "src/pages/panel/index.html",
    open_at_install: true,
  },
});
