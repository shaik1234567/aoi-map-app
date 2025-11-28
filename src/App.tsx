import React, { useEffect, useState } from 'react'
import MapView from './components/MapView'

export default function App() {
  const [wmsVisible, setWmsVisible] = useState(true)
  const [aoiCount, setAoiCount] = useState<number>(0)

  useEffect(() => {
    const stored = localStorage.getItem('aoi_features')
    if (stored) {
      try {
        const arr = JSON.parse(stored)
        setAoiCount(Array.isArray(arr) ? arr.length : 0)
      } catch (e) {
        setAoiCount(0)
      }
    }
  }, [])

  // Expose small test hooks for Playwright
  useEffect(() => {
    ;(window as any).persistAoi = (geojson: any) => {
      const cur = JSON.parse(localStorage.getItem('aoi_features') || '[]')
      cur.push(geojson)
      localStorage.setItem('aoi_features', JSON.stringify(cur))
      setAoiCount(cur.length)
    }
    ;(window as any).clearAois = () => {
      localStorage.removeItem('aoi_features')
      setAoiCount(0)
    }
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)

  async function onSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const q = encodeURIComponent(searchQuery.trim())
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5`
      const res = await fetch(url, { headers: { 'User-Agent': 'aoi-map-app' } })
      const data = await res.json()
      if (data && data.length > 0) {
        const place = data[0]
        const lat = parseFloat(place.lat)
        const lon = parseFloat(place.lon)
        // call map helper
        ;(window as any).flyTo && (window as any).flyTo([lat, lon], 12)
      }
    } catch (err) {
      // ignore
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-white shadow-sm flex items-center px-4">
        <h1 className="text-lg font-semibold">AOI Creator</h1>
      </header>
      <div className="flex-1 flex">
        <aside className="w-80 bg-white border-r p-4">
          <div className="mb-4">
            <h2 className="font-medium">Layers</h2>
            <div className="mt-2 flex flex-col gap-2">
              <button
                id="toggle-wms"
                className="px-3 py-1 bg-indigo-600 text-white rounded"
                onClick={() => setWmsVisible((s) => !s)}
              >
                {wmsVisible ? 'Hide WMS Layer' : 'Show WMS Layer'}
              </button>
              <button
                id="toggle-drawn"
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
                onClick={() => (window as any).toggleDrawn && (window as any).toggleDrawn()}
              >
                Toggle Drawn AOIs
              </button>
            </div>
            <form onSubmit={onSearch} className="mt-4">
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-2 py-1 border rounded"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search place or address"
                />
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  type="submit"
                  disabled={searching}
                >
                  Go
                </button>
              </div>
            </form>
          </div>

          <div className="mb-4">
            <h2 className="font-medium">AOIs</h2>
            <p className="text-sm mt-2">Saved AOIs: <span data-testid="aoi-count">{aoiCount}</span></p>
            <div className="mt-2">
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => {
                  localStorage.removeItem('aoi_features')
                  setAoiCount(0)
                }}
              >
                Clear AOIs
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-6">
            This app demonstrates a map with a WMS overlay, drawing tools, and simple persistence.
          </div>
        </aside>
        <main className="flex-1">
          <div className="map-container">
            <MapView wmsVisible={wmsVisible} onAoiChange={(count) => setAoiCount(count)} />
          </div>
        </main>
      </div>
    </div>
  )
}
