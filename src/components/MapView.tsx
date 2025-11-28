import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-draw'

type Props = {
  wmsVisible: boolean
  onAoiChange?: (count: number) => void
}

const WmsLayer: React.FC<{ visible: boolean }> = ({ visible }) => {
  const map = useMap()

  useEffect(() => {
    const url = 'https://www.wms.nrw.de/geobasis/wms_nw_dop'
    const layer = L.tileLayer.wms(url, {
      layers: 'nw_dop_rgb',
      format: 'image/png',
      transparent: false,
      attribution: '© WMS NRW'
    })

    if (visible) {
      layer.addTo(map)
    }

    return () => {
      map.removeLayer(layer)
    }
  }, [map, visible])

  return null
}

export default function MapView({ wmsVisible, onAoiChange }: Props) {
  useEffect(() => {
    // Load saved AOIs and add to map via leaflet-draw layer
    // The creation and persistence logic is implemented inside the DrawManager component below.
  }, [])

  return (
    <MapContainer center={[51.1657, 10.4515]} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <WmsLayer visible={wmsVisible} />
      <DrawManager onAoiChange={onAoiChange} />
    </MapContainer>
  )
}

function DrawManager({ onAoiChange }: { onAoiChange?: (count: number) => void }) {
  const map = useMap()

  useEffect(() => {
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)
    let drawnVisible = true

    // Load persisted AOIs
    try {
      const stored = JSON.parse(localStorage.getItem('aoi_features') || '[]')
      if (Array.isArray(stored)) {
        stored.forEach((g: any) => {
          try {
            const layer = L.geoJSON(g)
            layer.eachLayer((l) => {
              // @ts-ignore
              drawnItems.addLayer(l)
            })
          } catch (e) {
            // ignore
          }
        })
      }
    } catch (e) {}

    const drawControl = new (L.Control as any).Draw({
      draw: {
        polyline: true,
        polygon: true,
        rectangle: true,
        circle: false,
        marker: true,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems
      }
    })

    map.addControl(drawControl)

    // Listen for create/edit/delete and save with debounce
    let saveTimer: any = null
    function scheduleSave() {
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => saveFeatures(), 300)
    }

    map.on(L.Draw.Event.CREATED, function (e: any) {
      const layer = e.layer
      drawnItems.addLayer(layer)
      scheduleSave()
    })

    map.on(L.Draw.Event.EDITED, function () {
      scheduleSave()
    })

    map.on(L.Draw.Event.DELETED, function () {
      scheduleSave()
    })

    function saveFeatures() {
      const features: any[] = []
      drawnItems.eachLayer((layer: any) => {
        if (layer.toGeoJSON) {
          features.push(layer.toGeoJSON())
        }
      })
      localStorage.setItem('aoi_features', JSON.stringify(features))
      onAoiChange && onAoiChange(features.length)
    }

    // Attach test / UI helpers
    ;(window as any).getAoiCount = () => {
      let count = 0
      drawnItems.eachLayer(() => (count += 1))
      return count
    }

    ;(window as any).toggleDrawn = () => {
      drawnVisible = !drawnVisible
      if (drawnVisible) {
        map.addLayer(drawnItems)
      } else {
        map.removeLayer(drawnItems)
      }
      return drawnVisible
    }

    ;(window as any).flyTo = (latlng: [number, number], zoom = 12) => {
      try {
        map.setView(latlng, zoom)
      } catch (e) {
        // ignore
      }
    }

    return () => {
      map.removeControl(drawControl)
      map.removeLayer(drawnItems)
    }
  }, [map, onAoiChange])

  return null
}
