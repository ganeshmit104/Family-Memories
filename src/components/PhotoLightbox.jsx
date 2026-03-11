import { useState } from 'react'

export default function PhotoLightbox({ photos, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + photos.length) % photos.length) }
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % photos.length) }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.94)',
        zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', color: 'white', fontSize: 30, cursor: 'pointer' }}>✕</button>

      {photos.length > 1 && (
        <>
          <button onClick={prev} style={navBtn('left')}>‹</button>
          <button onClick={next} style={navBtn('right')}>›</button>
        </>
      )}

      <img
        onClick={e => e.stopPropagation()}
        src={photos[idx].data} alt=""
        style={{ maxWidth: '88vw', maxHeight: '84vh', borderRadius: 14, objectFit: 'contain' }}
      />

      {photos.length > 1 && (
        <div style={{ position: 'absolute', bottom: 18, color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
          {idx + 1} / {photos.length}
        </div>
      )}
    </div>
  )
}

const navBtn = (side) => ({
  position: 'absolute', [side]: 16,
  background: 'rgba(255,255,255,0.18)',
  border: 'none', color: 'white',
  fontSize: 28, borderRadius: '50%',
  width: 48, height: 48,
  cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
})
