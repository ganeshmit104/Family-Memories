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
          <button onClick={() => onEdit(outing)} style={actionBtn('#f0e8d8', '#5a4a30')}>Edit</button>
          <button onClick={() => { onDelete(outing.id); onClose() }} style={actionBtn('#fde8e8', '#c04040')}>Delete</button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9a8a70' }}>✕</button>
        </div>
      </div>

      {/* Category label */}
      <div style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
        {outing.category}
      </div>

      {/* Name */}
      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 26, color: '#2a1f0e', margin: '0 0 4px' }}>
        {outing.name}
      </h2>

      {/* City */}
      {outing.city && <div style={{ color: '#7a6a50', marginBottom: 10, fontSize: 14 }}>📍 {outing.city}</div>}

      {/* Rating + date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <StarRating value={outing.rating} size={20} />
        <span style={{ fontSize: 13, color: '#9a8a70' }}>{formatDate(outing.date)}</span>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {outing.kidFriendly && <span style={badge('#fef3c0', '#5a3a00')}>👶 Kid-friendly</span>}
        {outing.wouldReturn && <span style={badge('#dcfce7', '#166534')}>🔄 Would return</span>}
      </div>

      {/* Photos */}
      {outing.photos?.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <SectionLabel>Photos ({outing.photos.length})</SectionLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {outing.photos.map((p, i) => (
              <img
                key={p.id} src={p.data} alt=""
                onClick={() => setLightbox(i)}
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, cursor: 'pointer', border: '2px solid #e0d4c0', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {outing.notes && (
        <div style={{ background: cat.bg, borderRadius: 14, padding: 16, marginBottom: 18, borderLeft: `4px solid ${cat.color}` }}>
          <SectionLabel>Notes & Memories</SectionLabel>
          <div style={{ fontSize: 14, color: '#3a2a10', lineHeight: 1.75 }}>{outing.notes}</div>
        </div>
      )}

      {/* Map */}
      {outing.lat && outing.lng && (
        <div>
          <SectionLabel>Location</SectionLabel>
          <iframe
            title="location"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${outing.lng - 0.012},${outing.lat - 0.012},${outing.lng + 0.012},${outing.lat + 0.012}&layer=mapnik&marker=${outing.lat},${outing.lng}`}
            style={{ width: '100%', height: 200, border: 'none', borderRadius: 14 }}
          />
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#9a8a70', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
      {children}
    </div>
  )
}

const actionBtn = (bg, color) => ({
  background: bg, border: 'none', borderRadius: 10,
  padding: '8px 16px', cursor: 'pointer',
  fontWeight: 700, color, fontSize: 13,
})

const badge = (bg, color) => ({
  background: bg, borderRadius: 20,
  padding: '4px 14px', fontSize: 13,
  fontWeight: 700, color,
})
