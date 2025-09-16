# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Figma Asset Extraction (Automated)

A script is provided to extract real assets (SVG/PNG/icons) from a Figma file and generate a static gallery UI using those assets.

- Script path: `scripts/extract_figma_assets.py`
- Assets output: `assets/images/`
- Generated static site: `assets/generated/figma-export-<prefix>/`

### 1) Create a Figma API Token

1. Visit https://www.figma.com/developers/api#access-tokens
2. Generate a Personal Access Token (PAT)
3. Save the token as an environment variable (do NOT commit secrets):

Mac/Linux:
```
export FIGMA_API_TOKEN="your_figma_pat_here"
```

Windows (PowerShell):
```
setx FIGMA_API_TOKEN "your_figma_pat_here"
```

### 2) Find your Figma File ID (and optional Page/Node ID)
- Open your Figma file in the browser.
- The URL looks like: `https://www.figma.com/file/<FILE_ID>/...`
- Optional: To limit to a specific page, right-click the page in Figma and Copy/Paste the **node id** if available (advanced), or leave it out to export all pages.

### 3) Run the extractor

From the `react_frontend` directory:
```
python scripts/extract_figma_assets.py --file-id <FIGMA_FILE_ID> --output-prefix myproject
```

Options:
- `--page-id <PAGE_NODE_ID>`: Only export assets under this page.
- `--format [auto|svg|png]`: Preferred export format. The script auto-chooses reasonable defaults per node; this flag is advisory.
- `--scale <float>`: Raster export scale (for PNG), default 2.0.
- `--output-prefix <string>`: Used as a filename prefix and generated site folder suffix.

Results:
- Images saved under: `assets/images/`
- Manifest JSON: `assets/generated/manifest-<prefix>.json`
- Static gallery site: `assets/generated/figma-export-<prefix>/index.html`

Open the generated `index.html` in a browser to see a gallery of exported assets.

Security:
- No tokens or sensitive data are committed. The script reads `FIGMA_API_TOKEN` from your environment.
- If `FIGMA_API_TOKEN` is not set, the script exits with an error.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
