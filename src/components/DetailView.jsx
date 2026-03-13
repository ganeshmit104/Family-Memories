import { useState } from 'react'
import { CATEGORIES } from '../constants'
import { formatDate } from '../utils'
import StarRating from './StarRating'
import PhotoLightbox from './PhotoLightbox'

export default function DetailView({ outing, onClose, onEdit, onDelete }) {
  const cat = CATEGORIES.find(c => c.label === outing.category) || CATEGORIES[0]
  const [lightbox, setLightbox] = useState(null)

  return (
    <div>
      {lightbox !== null && (
        <PhotoLightbox photos={outing.photos} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <span style={{ fontSize: 44 }}>{cat.emoji}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onEdit(outing)} style={{
            background: '#f0e8d8', border: 'none', borderRadius: 10,
            padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#5a4a30',
          }}>✏️ Edit</button>
          <button onClick={() => { if (window.confirm('Delete this memory?')) onDelete(outing.id) }} style={{
            background: '#fee8e8', border: 'none', borderRadius: 10,
            padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#c03030',
          }}>🗑️ Delete</button>
          <button onClick={onClose} style={{
            background: '#f0e8d8', border: 'none', borderRadius: 10,
            padding: '8px 14px', fontSize: 18, cursor: 'pointer', color: '#7a6a50', lineHeight: 1,
          }}>×</button>
        </div>
      </div>

      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 24, color: '#2a1f0e', marginBottom: 4 }}>{outing.name}</h2>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <span style={{ background: cat.color + '20', color: cat.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
          {cat.emoji} {cat.label}
        </span>
        {outing.city && <span style={{ color: '#9a8a70', fontSize: 13 }}>📍 {outing.city}</span>}
        {outing.date && <span style={{ color: '#9a8a70', fontSize: 13 }}>📅 {formatDate(outing.date)}</span>}
      </div>

      <StarRating value={outing.rating} readonly size={20} />

      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        {outing.kidFriendly && (
          <span style={{ background: '#e8f8e8', color: '#3a8a50', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>👧 Kid-Friendly</span>
        )}
        {outing.wouldReturn && (
          <span style={{ background: '#e8f0ff', color: '#3050a0', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>🔁 Would Return</span>
        )}
      </div>

      {outing.notes && (
        <p style={{ color: '#5a4a30', fontSize: 14, lineHeight: 1.6, background: '#f8f4ec', borderRadius: 12, padding: '12px 16px', marginTop: 12 }}>
          {outing.notes}
        </p>
      )}

      {outing.photos?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9a8a70', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Photos ({outing.photos.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
            {outing.photos.map((p, i) => (
              <img
                key={i} src={p.url || p.data} alt=""
                onClick={() => setLightbox(i)}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10, cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      )}

      {outing.lat && outing.lng && (
        <div style={{ marginTop: 20, borderRadius: 14, overflow: 'hidden', height: 180 }}>
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${outing.lng - 0.012},${outing.lat - 0.012},${outing.lng + 0.012},${outing.lat + 0.012}&layer=mapnik&marker=${outing.lat},${outing.lng}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="map"
          />
        </div>
      )}
    </div>
  )
}
