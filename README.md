# React + TypeScript + Vite Firefox Extension

## Running Locally

To run locally run

`npm run dev:firefox`

This builds the app and then zips the resulting `/dist` directory and loads the zip as an extension in a Firefox window. It also watches the source files and tells Firefox to reload the extension after modifying a file.

## Directory Structure

```
project/
├── public/                # Extension icons
│    └── ...
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
│   │   │   ├── main.tsx
│   │   │   └── App.tsx
│   ├── scripts/
│   │   ├── content/           # Content scripts
│   │   │   └── main.tsx
│   │   ├── background/       # Background scripts
│   │   │   └── main.ts
│   ├── shared/
│   │   ├── App.css
│   │   └── index.css
│   ├── components/
│   │    └──  ...
│   ├── assets/
│   │    └──  ...
├── .github/
│   └── workflows/
│        └── ...
├── vite.config.ts         # Config for multi-page build
├── manifest.config.ts.    # Config for the extension manifest
├── package.json
└── README.md

```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
