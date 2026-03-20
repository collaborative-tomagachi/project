# React + TypeScript + Vite Firefox Extension + Express.js Backend

[Style Guide](./docs/STYLE_GUIDE.md)

## Architecture

- **Frontend**: Firefox extension (React + TypeScript + Vite)
- **Backend**: Express.js API server with TypeScript

## Running Locally

To run locally run

### Backend API Server
```bash
cd backend
npm run dev
```
The API server runs on `http://localhost:3000`

### Frontend Extension
```bash
cd frontend
npm run dev:firefox
```
This builds the app and then zips the resulting `/dist` directory and loads 
the zip as an extension in a Firefox window. It also watches the source 
files and tells Firefox to reload the extension after modifying a file.

## Publishing an Extension
- Upon merging into `main` the Release Github Action is triggered which 
will create a zip file artifact `firefox-web-extension`
  - or run `npm build` locally
- The extension must be reviewed and approved by addons.mozilla.org (AMO)
- Will need a Mozilla account to submit the extension
- Submit [here](https://addons.mozilla.org/developers/addons)

## To load extension in the browser manually
- Open - Firefox browser
- Access - `about:debugging#/runtime/this-firefox`
- Click - Load temporary Add-on
- Select - any file in `release` folder (i.e. manifest.json) in this 
project (after running `build`)

## Directory Structure

```
project/
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── common/        # Shared utilities
│   │   ├── server.ts      # Express server setup
│   │   └── main.ts        # Server entry point
│   ├── config/            # Environment files
│   └── package.json
├── frontend/              # Firefox extension
│   ├── src/
│   │   ├── pages/
│   │   │   ├── popup/     # Popup UI (React app)
│   │   │   ├── panel/     # Panel UI with backend connection
│   │   │   └── options/   # Options page
│   │   ├── scripts/
│   │   │   ├── content/   # Content scripts
│   │   │   └── background/ # Background scripts
│   │   └── shared/        # Shared styles
│   ├── manifest.config.ts # Extension manifest
│   └── package.json
└── README.md

```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
