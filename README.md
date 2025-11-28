# AOI Map App 🛰️

An interactive single-page application to create and manage Areas of Interest (AOIs) on a map. Built with React + TypeScript + Vite and styled with Tailwind CSS. The app demonstrates:

- A WMS (raster) overlay from NRW (`https://www.wms.nrw.de/geobasis/wms_nw_dop`)
- Drawing tools (point, polyline, polygon, rectangle) via `leaflet-draw`
- Client-side persistence of AOIs as GeoJSON in `localStorage`
- Layer controls and a small geocoding search (Nominatim)
- End-to-end tests using Playwright

🎯 Quick start

1. Install dependencies

```cmd
cd e:\projects\aoi-map-app
npm install
```

2. Start dev server

```cmd
npm run dev
```

3. Run Playwright tests (dev server is auto-started by Playwright config)

```cmd
npx playwright install --with-deps
npm run test:e2e
```

🚀 What we implemented (high level)

- UI: responsive sidebar + map area (`src/App.tsx`) with layer and AOI controls.
- Map: `src/components/MapView.tsx` — OpenStreetMap base + NRW WMS layer (tile WMS), zoom/pan support.
- Drawing: `leaflet-draw` integrated, create/edit/delete AOIs saved to `localStorage` as GeoJSON features.
- Search: Nominatim geocoding search in the sidebar; search results fly the map to the location.
- Testing: Playwright e2e tests in `e2e/` (app loads, layer toggle, persistence).
- CI: GitHub Actions workflow to run build + e2e tests on push/PR (`.github/workflows/ci.yml`).

📁 Project structure (important files)

- `src/App.tsx` — layout and sidebar UI
- `src/components/MapView.tsx` — map, WMS layer, draw manager, persistence
- `src/index.css` — Tailwind + small layout adjustments
- `e2e/map.spec.ts` — Playwright tests
- `er-diagram.svg` — simple AOI storage diagram
- `.github/workflows/ci.yml` — CI pipeline (build + e2e)

🗺️ Map library choice
- **Selected:** Leaflet + react-leaflet
  - Pros: lightweight, easy to integrate WMS, rich plugin ecosystem (`leaflet-draw`), quick to implement.
  - Alternatives: MapLibre / Mapbox GL (WebGL, better performance for many vector features), OpenLayers (robust WMS support). For this prototype, Leaflet is a pragmatic choice.

🧭 Architecture

- Single-page React application.
- `MapView` encapsulates all map logic (map creation, base layers, WMS, draw manager).
- AOIs are stored client-side in `localStorage` as an array of GeoJSON `Feature` objects under the key `aoi_features`.
- Playwright e2e tests run against a dev server started by the `webServer` option in `playwright.config.ts`.

🔧 Performance considerations

- Debounced saving of AOIs to reduce write frequency (300ms).
- For future scale (1000s of features):
  - Move features to a server-side spatial database and expose vector tiles or filtered GeoJSON endpoints.
  - Use marker clustering and canvas rendering or WebGL-based rendering for large vector datasets.
  - Lazy-load or page features by spatial extent.

🧪 Testing

- Playwright e2e tests: `e2e/map.spec.ts` (3 tests) — these are intended to demonstrate testing approach and are passing locally.
- With more time we would:
  - Add unit tests using Jest + React Testing Library for `MapView` and smaller components.
  - Add visual regression tests to verify UI against Figma (Percy or Playwright snapshots).

⚖️ Tradeoffs & production readiness

- Persistence: `localStorage` is simple and works for demo, but production should use authenticated APIs and a spatial DB (PostGIS).
- Map tiles and WMS: the WMS used here is public; for production consider tile/WMTS or cached tiles to improve performance.
- Accessibility: components are functional but require an accessibility audit and ARIA improvements.

📦 API & Schema (client-side)

AOIs are stored as an array of GeoJSON `Feature` objects. Example feature:

```json
{
  "type": "Feature",
  "geometry": { "type": "Polygon", "coordinates": [[[10.0, 51.0], [10.1,51.0],[10.1,51.1],[10.0,51.1],[10.0,51.0]]] },
  "properties": { "createdAt": 1699999999999 }
}
```

If a backend is added, minimal endpoints could be:
- `GET /api/aoi` → return a `FeatureCollection`
- `POST /api/aoi` → accept a `Feature` to persist
- `DELETE /api/aoi/:id` → delete a feature

🧾 ER / Diagram
- See `er-diagram.svg` in the repository for a simple visual of AOI storage and interactions.

🎥 Demo video (3–5 minutes) — suggested script

1. Intro (10–15s): Quick summary of the app and tech stack.
2. Start the app (20s): Show `npm install` + `npm run dev` and open `http://localhost:5173`.
3. Show map & WMS (40s): Toggle WMS layer and pan/zoom.
4. Draw AOI (45s): Create a polygon, edit it, show that it's persisted after reload.
5. Search (20s): Use the search box to find a location and fly to it.
6. Tests & CI (30s): Show `npm run test:e2e` or GitHub Actions passing.
7. Wrap-up (10–15s): Note tradeoffs and next steps.

🧭 How to contribute / extend

- Add unit tests (Jest + RTL).
- Replace `localStorage` with an API + DB.
- Add visual regression and accessibility tests.

—
If you'd like, I can now:
- (A) polish the UI colors/spacing/icons to match Figma exactly,
- (B) add unit tests and visual regression snapshots, or
- (C) draft the demo video recording and provide a recorded sample narration.

Thanks — the app is ready for submission and the GitHub repo contains the source and CI workflow: `https://github.com/shaik1234567/aoi-map-app`
