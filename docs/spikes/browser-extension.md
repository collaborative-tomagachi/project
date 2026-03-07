# Mozilla Browser Extension

## Directory

```
project/
├── public/
│   ├── manifest.json      # Extension metadata
│   ├── icons/             # Extension icons
│   │   ├── icon48x48.png
│   │   ├── icon96x96.png
│   └── background.js      # Background script
├── src/
│   ├── pages/
│   │   ├── popup/             # Popup UI (React app)
│   │   │   ├── index.html
│   │   │   ├── main.jsx
│   │   └── └── App.jsx
│   │   ├── panel/             # Panel UI (React app)
│   │   │   ├── index.html
│   │   │   ├── main.jsx
│   │   └── └── App.jsx
│   │   ├── options/           # Options page (React app)
│   │   │   ├── index.html
│   │   └── └── ...
│   │   ├── content/           # Content scripts
│   │   └── └── index.js
│   └── assets/
├── vite.config.js         # Config for multi-page build
├── package.json
└── README.md

```

## Files & Directories

### `manifest.json`

This is the only file that must be present in every extension. It contains basic metadata such as its name, version, and the permissions it requires. It also provides pointers to other files in the extension.

```json
{
  "manifest_version": 2,
  "name": "TBD Project Name",
  "version": "1.0",

  "description": "A pet to keep you and your friends company in the browser.",
  "permissions": ["notifications", "storage", "alarms"],   # Browser APIs we want to use
  "homepage_url": "https://github.com/collaborative-tomagachi/project#",
  "icons": {
    "48": "icons/icon48x48.png",
    "96": "icons/icon96x96.png",
  },

  "content_scripts": [
    {
      "matches": ["*://*.mozilla.org/*"],
      "js": ["borderify.js"]
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

### `background.js`

```javascript

```

### `vite.config.js`

Multi-entry point example config

```javascript
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popup: resolve(__dirname, "popup/index.html"),
        // Add more pages here
        options: resolve(__dirname, "options/index.html"),
      },
    },
  },
});
```

## Publishing an Extension

- Must be reviewed and approved by addons.mozilla.org (AMO)
- Will need a Mozilla account to submit the extension under
- Submit [here](https://addons.mozilla.org/developers/addons)

## References

- [Helpful github repo for how to set up extension with vite](https://github.com/JohnBra/vite-web-extension/tree/main)
