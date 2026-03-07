# Mozilla Browser Extension

Outline of requirements and set up needed to create a browser extension (Mozilla)

## Directory

```
project/
├── public/
│   ├── icons/             # Extension icons
│   │   ├── icon48x48.png
│   │   ├── icon96x96.png
│   │   └── icon32x32.png
│   └── background.js      # Background script
├── src/
│   ├── pages/
│   │   ├── popup/             # Popup UI (React app)
│   │   │   ├── index.html
│   │   │   ├── main.tsx
│   │   │   └── App.tsx
│   │   ├── panel/             # Panel UI (React app)
│   │   │   ├── index.html
│   │   │   ├── main.tsx
│   │   │   └── App.tsx
│   │   ├── options/           # Options page (React app)
│   │   │   ├── index.html
│   │   │   └── ...
│   │   ├── content/           # Content scripts
│   │   └── └── main.tsx
│   ├── components/
│   │   └── └── ...
│   └── assets/
│   │   └── └── ...
├── .github/
│   └── workflows/
│   │   └── └── ci.yml
├── vite.config.ts         # Config for multi-page build
├── manifest.config.ts
├── package.json
└── README.md

```

## Files & Directories

### `manifest.config.ts`

`manifest.json` is the only file that must be present in every extension. It contains basic metadata such as its name, version, and the permissions it requires. It also provides pointers to other files in the extension.

This manifest config file generates the manifest file.

Depending on where we want the main part of the app to live we can remove sections related to which pages are supported.

```typescript
import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: "public/logo.png",
  },
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/pages/popup/index.html",
  },
  content_scripts: [
    {
      js: ["src/pages/content/main.ts"],
      matches: ["https://*/*"],
    },
  ],
  permissions: ["sidePanel", "contentSettings"],
  side_panel: {
    default_path: "src/pages/panel/index.html",
  },
});
```

```json
{
  "manifest_version": 3,
  "name": "TBD Project Name",
  "version": "1.0",

  "description": "A pet to keep you and your friends company in the browser.",
  "permissions": ["notifications", "storage", "alarms"],   # Browser APIs we want to use
  "homepage_url": "https://github.com/collaborative-tomagachi/project#",
  "icons": {
    "48": "icons/icon48x48.png",
    "96": "icons/icon96x96.png",
  },
  "options_ui": {
    "page": "src/pages/options/index.html"
  },
  "action": {
    "default_popup": "src/pages/popup/index.html",
    "default_icon": {
      "32": "icons/icon32x32.png"
    }
  },
  "chrome_url_overrides": {
    "newtab": "src/pages/newtab/index.html"
  },
  "content_scripts": [
    {
      "matches": ["*://*.mozilla.org/*"],
      "js": [
        "src/pages/content/index.tsx"
      ],
    }
  ]
}
```

### `/src/pages/popup`

> [Popup Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups)

The directory where we can defined the page to display when the user clicks on the extension button in the toolbar or address bar button.

Popups close when a user clicks outside of it, where user actions can live. I.e. open the room/settings, invite user, etc.

### `/src/pages/options`

> [Options Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Options_pages)

Where the extension settings live.

### `/src/pages/panel`

> [Sidebar Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars)

I think this is where we should have the room for where the pet should actually live.

### `vite.config.ts`

Multi-entry point example config.

```javascript
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import zip from 'vite-plugin-zip-pack'
import { name, version } from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    react(),
    crx({
        manifest: manifest as ManifestV3Export,
        browser: 'firefox',
        contentScripts: {
          injectCss: true,
        }
      }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  publicDir: resolve(__dirname, 'public'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popup: resolve(__dirname, "src/pages/popup/index.html"),
        options: resolve(__dirname, "src/pages/options/index.html"),
        panel: resolve(__dirname, "src/pages/panel/index.html"),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
    },
  },
});
```

### `/.github/workflows/ci.yml`

To run the workflow do the following:

- Go to the "Actions" tab
- In the left sidebar click on "Build and Zip Extension"
- Click on "Run Workflow" and select the main branch, then "Run Workflow"
- Refresh the page and click the most recent run
- In the summary page "Artifacts" section click on the generated "vite-web-extension-firefox"
- Upload this file to the

```yml
name: Build and Zip Extension

on:
  workflow_dispatch:

jobs:
  build:
    name: Build
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Setup Node.js environment
        uses: actions/setup-node@v3
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies
        run: npm i

      - name: Build
        run: npm build

      - name: Upload extension artifacts
        uses: actions/upload-artifact@v3
        with:
          name: vite-web-extension-firefox
          path: release
```

## Publishing an Extension

- Must be reviewed and approved by addons.mozilla.org (AMO)
- Will need a Mozilla account to submit the extension under
- Submit [here](https://addons.mozilla.org/developers/addons)

## To load extension in the browser

- Open - Firefox browser
- Access - `about:debugging#/runtime/this-firefox`
- Click - Load temporary Add-on
- Select - any file in `release` folder (i.e. manifest.json) in this project (after running `build`)

## New packages

- [@crxjs/vite-plugin](https://www.npmjs.com/package/@crxjs/vite-plugin) - plugin for extensions with vite
- [vite-plugin-zip-pack](https://www.npmjs.com/package/vite-plugin-zip-pack?activeTab=readme) - builds into a zip file, necessary for publishing an extension

## References

- [Helpful github repo for how to set up extension with vite](https://github.com/JohnBra/vite-web-extension/tree/main)
