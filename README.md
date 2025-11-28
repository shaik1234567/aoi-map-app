# AOI Map App

This repository contains a single-page React + TypeScript application demonstrating an Area of Interest (AOI) creation flow with a WMS overlay, drawing tools, and simple persistence.

Quick start

1. Install dependencies

```cmd
npm install
```

2. Start dev server

```cmd
npm run dev
```

3. Run Playwright tests (in a separate shell)

```cmd
npm run test:e2e
```

Map library choice
- Selected: Leaflet + react-leaflet
- Why: Leaflet is lightweight, well-documented, and has mature plugins (leaflet-draw) that made implementing drawing tools and WMS overlays straightforward. react-leaflet provides an ergonomic React wrapper.
- Alternatives considered: MapLibre / Mapbox GL (better WebGL performance for many vector features), OpenLayers (more enterprise-grade and full-featured WMS support). Tradeoff: Leaflet is simpler for this demo and integrates well with drawing plugins.

Architecture
- `src/App.tsx`: Layout, sidebar UI, small test hooks, and AOI count.
- `src/components/MapView.tsx`: MapContainer, base TileLayer, WMS overlay (via `L.tileLayer.wms`) and DrawManager that wires `leaflet-draw` and persistence.
- Client-side storage only: AOIs saved to `localStorage` as an array of GeoJSON Features.

Performance considerations
- For 1000s of points/polygons:
  - Use a vector tile approach (e.g., Mapbox Vector Tiles or GeoJSON tiling) to avoid rendering huge GeoJSON blobs in the browser.
  - Cluster markers and use canvas-rendered layers where possible.
  - Debounce map events and batch updates to storage.
  - Only load visible features (server-side spatial filters) when available.

Testing
- Playwright e2e tests: `e2e/map.spec.ts` — tests app load, layer toggle UI, and persistence via small test helpers.
- With more time: unit tests for small components and utilities, visual regression testing to match Figma pixel-perfect.

Tradeoffs & Production readiness
- This demo uses `localStorage` for persistence for simplicity. In production, persist to a backend (with authentication) and use a spatial DB.
- Accessibility: basic keyboard navigation is possible but not fully audited.
- Linting/CI: not wired up in this demo; add ESLint/Prettier and CI pipelines for production.

Time spent
- Scaffold and core map implementation: ~2–3 hours
- Drawing + persistence: ~1 hour
- Tests and documentation: ~1 hour

API docs / Schema / ER
- This is a client-only demo; there are no server API routes. Example schema for an AOI stored in `localStorage`:

```json
{
  "type": "Feature",
  "geometry": { "type": "Polygon", "coordinates": [[[...]]] },
  "properties": { }
}
```

If a backend were added, a minimal API could include:
- `GET /api/aoi` -> returns list of AOIs (GeoJSON FeatureCollection)
- `POST /api/aoi` -> accepts GeoJSON Feature to persist
- `DELETE /api/aoi/:id` -> delete AOI

Demo video
- Please record a 3–5 minute walkthrough showing:
  - Starting the app
  - Toggling the WMS layer
  - Drawing an AOI and reloading to show persistence
