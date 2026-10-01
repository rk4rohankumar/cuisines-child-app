# Cuisines · Micro Frontend remote

Browse world dishes by category, search recipes and open full ingredient lists. A CRA 5 + CRACO 7 app exposed as a webpack Module Federation remote for the [micro-frontend host](https://github.com/rk4rohankumar/micro-frontend-host); it also runs standalone.

**Live:** https://cuisines-child-app.vercel.app/

## Data

[TheMealDB](https://www.themealdb.com/api.php) public API (`https://www.themealdb.com/api/json/v1/1`, no key):

- `list.php?c=list` — categories
- `filter.php?c=<category>` / `search.php?s=<query>` — meal grid
- `lookup.php?i=<id>` — recipe detail (modal)

Cards use the small `<strMealThumb>/preview` variant; the modal loads the full image.

## Run

```bash
npm install
npm start          # http://localhost:3000 (standalone)
npm run build      # production build in build/, publicPath 'auto'
```

## How the host consumes it

- Remote name: `CuisinesApp`
- Remote entry: `https://cuisines-child-app.vercel.app/remoteEntry.js`
- Exposed module: `./CuisinesApp` → `src/App` (default export, a React component)

The host injects `remoteEntry.js` at runtime, calls `container.init(__webpack_share_scopes__.default)` and then `container.get('./CuisinesApp')`.

`react`, `react-dom`, `framer-motion` and `axios` are declared `singleton` shared modules with `requiredVersion` from `package.json`, so the remote reuses the host's copies instead of loading its own. The entry is bootstrapped asynchronously (`src/index.js` → `import('./bootstrap')`) so those shared modules can be negotiated before React renders.
