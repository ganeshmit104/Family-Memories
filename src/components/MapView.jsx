import { useEffect, useRef } from 'react'
import { CATEGORIES } from '../constants'
import { formatDate } from '../utils'

export default function MapView({ outings }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current || !window.L) return

    // Destroy existing map
    if (instanceRef.current) {
      instanceRef.current.remove()
      instanceRef.current = null
    }

    const L = window.L
    const map = L.map(mapRef.current, { zoomControl: true }).setView([43.0, -81.2], 11)
    instanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    const geoOutings = outings.filter(o => o.lat && o.lng)

    geoOutings.forEach(o => {
      const cat = CATEGORIES.find(c => c.label === o.category) || CATEGORIES[0]

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          background:${cat.color};color:white;border-radius:50%;
          width:38px;height:38px;display:flex;align-items:center;
          justify-content:center;font-size:20px;
          box-shadow:0 3px 10px rgba(0,0,0,0.35);
          border:2.5px solid white;cursor:pointer
        ">${cat.emoji}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      })

      const photoHtml = o.photos?.[0]
        ? `<img src="${o.photos[0].data}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:8px" />`
        : ''

      const starsHtml = '★'.repeat(o.rating) + `<span style="color:#ddd">${'★'.repeat(5 - o.rating)}</span>`

      const popup = `
        <div style="font-family:Georgia,serif;min-width:180px;max-width:220px">
          ${photoHtml}
          <div style="font-weight:700;font-size:15px;margin-bottom:3px">${o.name}</div>
          <div style="color:#888;font-size:12px;margin-bottom:6px">${formatDate(o.date)}</div>
          <div style="color:#e8a020;font-size:16px">${starsHtml}</div>
          ${o.notes ? `<div style="font-size:12px;color:#555;margin-top:6px;font-style:italic;line-height:1.5">"${o.notes.slice(0, 100)}${o.notes.length > 100 ? '…' : ''}"</div>` : ''}
        </div>`

      L.marker([o.lat, o.lng], { icon }).addTo(map).bindPopup(popup)
    })

    if (geoOutings.length > 1) {
      map.fitBounds(L.latLngBounds(geoOutings.map(o => [o.lat, o.lng])), { padding: [50, 50] })
    } else if (geoOutings.length === 1) {
      map.setView([geoOutings[0].lat, geoOutings[0].lng], 14)
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
      }
    }
  }, [outings])

  const withGeo = outings.filter(o => o.lat).length

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: 480, borderRadius: 20, overflow: 'hidden', background: '#e8e0d4' }}
      />
      {outings.length > 0 && withGeo < outings.length && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9a8a70', marginTop: 12 }}>
          📍 {withGeo} of {outings.length} places pinned — locations are auto-detected when you save a place.
        </p>
      )}
      {outings.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9a8a70', marginTop: 16, fontStyle: 'italic' }}>
          Add your first outing to see it appear on the map!
        </p>
      )}
    </div>
  )
}
