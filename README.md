# AOI Map App 🛰️

An interactive single-page application for creating and managing **Areas of Interest (AOIs)** on a map using WMS satellite imagery.

Repository: [https://github.com/shaik1234567/aoi-map-app](https://github.com/shaik1234567/aoi-map-app)

---

## 🚀 Features

### **Map & Layers**

* OpenStreetMap (OSM) base layer
* NRW WMS overlay (`https://www.wms.nrw.de/geobasis/wms_nw_dop`)
* Toggle WMS visibility

### **Drawing Tools**

Powered by **leaflet-draw**:

* Create marker, polyline, polygon, rectangle
* Edit/modify drawn shapes
* Delete AOIs
* AOIs are stored as **GeoJSON** in `localStorage`

### **Search (Nominatim)**

* Search any location
* Fly the map to selected result

### **Persistence**

* AOIs saved under key: `aoi_features`
* Loaded automatically on page reload

### **Testing**

* End-to-end tests with **Playwright**
* Covers:

  * App render
  * WMS toggle behavior
  * AOI persistence

### **CI/CD**

* GitHub Actions workflow (`ci.yml`)
* Runs build + e2e tests on push/PR

---

## 📂 Project Structure

```
aoi-map-app/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── components/
│       └── MapView.tsx
├── e2e/
│   └── map.spec.ts
├── .github/workflows/ci.yml
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 🧭 Quick Start

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open: **[http://localhost:5173](http://localhost:5173)**

### Run Playwright Tests

```bash
npx playwright install --with-deps
npm run test:e2e
```

---

## 🏗️ Tech Stack

* React + TypeScript + Vite
* Leaflet + react-leaflet
* leaflet-draw
* Tailwind CSS
* Playwright (E2E tests)
* GitHub Actions (CI)

---

## 🧱 Architecture Summary

* `MapView` handles **all map logic**: WMS, draw tools, persistence
* `App.tsx` manages sidebar UI & global state
* AOIs stored as GeoJSON FeatureCollection
* Minimal, modular, testable design

---

## 📈 Performance Notes

Already implemented:

* Debounced AOI saves (300ms)

Production recommendations:

* Move AOIs to PostGIS backend
* Serve vector tiles for large datasets
* Use marker clustering & WebGL rendering
* Lazy load features by viewport

---

## 🧪 Testing Strategy

### E2E Tests (Playwright)

Tests cover:

1. App loads
2. WMS toggle
3. AOI persistence across reloads

Future improvements:

* Jest unit tests
* Visual regression tests
* Accessibility tests

---

## ⚖️ Tradeoffs

| Decision           | Reason                         | Tradeoff            |
| ------------------ | ------------------------------ | ------------------- |
| Leaflet            | Fast, simple, good WMS support | Not WebGL optimized |
| localStorage       | Self-contained demo            | Not scalable        |
| Minimal UI styling | Faster delivery                | Not pixel-perfect   |

---

## 📡 API / Data Model

AOIs saved as:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {},
      "properties": {
        "createdAt": 1699999999999
      }
    }
  ]
}
```

---

## 🎥 Demo Script (3–5 minutes)

1. Intro: purpose + tech stack
2. Start app: `npm run dev`
3. Show map interactions (pan/zoom)
4. Toggle WMS
5. Draw AOIs → edit → reload → persistence
6. Search location
7. Run tests & show CI
8. Wrap up

---

## ⏱️ Time Spent

| Task                  | Time           |
| --------------------- | -------------- |
| Project setup         | 1.0 hr         |
| Map + WMS integration | 1.0 hr         |
| Drawing + persistence | 1.0 hr         |
| UI + search           | 0.75 hr        |
| Playwright + CI       | 1.5 hr         |
| Documentation         | 1.0 hr         |
| **Total**             | **6.25 hours** |

---

