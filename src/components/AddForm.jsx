import { useState } from 'react'
import { CATEGORIES } from '../constants'
import { generateId, geocode } from '../utils'
import StarRating from './StarRating'
import PhotoUploader from './PhotoUploader'

const inp = {
  width: '100%', padding: '11px 14px', borderRadius: 12,
  border: '1.5px solid #e0d4c0', background: '#faf7f2',
  fontSize: 15, fontFamily: 'inherit', color: '#2a1f0e',
  outline: 'none', boxSizing: 'border-box',
}
const lbl = {
  fontSize: 12, fontWeight: 700, color: '#7a6a50',
  marginBottom: 6, display: 'block',
  textTransform: 'uppercase', letterSpacing: 0.9,
}

export default function AddForm({ onSave, onClose, initial }) {
  const [form, setForm] = useState(initial || {
    name: '',
    category: CATEGORIES[0].label,
    date: new Date().toISOString().split('T')[0],
    rating: 4,
    notes: '',
    city: '',
    kidFriendly: true,
    wouldReturn: true,
    photos: [],
  })
  const [geocoding, setGeocoding] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) return
    let outing = { ...form, id: initial?.id || generateId() }
    if (!outing.lat && (form.name || form.city)) {
      setGeocoding(true)
      const geo = await geocode(form.name, form.city)
      if (geo) outing = { ...outing, ...geo }
      setGeocoding(false)
    }
    onSave(outing)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: '#2a1f0e', margin: 0 }}>
          {initial ? '✏️ Edit Outing' : '✨ New Outing'}
        </h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9a8a70' }}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Name */}
        <div>
          <label style={lbl}>Place Name *</label>
          <input style={inp} placeholder="e.g. Springbank Park" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        {/* City */}
        <div>
          <label style={lbl}>City / Area</label>
          <input style={inp} placeholder="e.g. London, Ontario" value={form.city} onChange={e => set('city', e.target.value)} />
        </div>

        {/* Category */}
        <div>
          <label style={lbl}>Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => set('category', cat.label)}
                style={{
                  padding: '10px 12px', borderRadius: 12,
                  border: `2px solid ${form.category === cat.label ? cat.color : '#e0d4c0'}`,
                  background: form.category === cat.label ? cat.bg : 'transparent',
                  color: form.category === cat.label ? cat.color : '#7a6a50',
                  fontSize: 13, cursor: 'pointer', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>{cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date + Rating */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={lbl}>Date</label>
            <input type="date" style={inp} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Rating</label>
            <div style={{ paddingTop: 10 }}>
              <StarRating value={form.rating} onChange={v => set('rating', v)} size={28} />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div>
          <label style={lbl}>📷 Photos</label>
          <PhotoUploader
            photos={form.photos}
            onChange={photos => set('photos', typeof photos === 'function' ? photos(form.photos) : photos)}
          />
        </div>

        {/* Notes */}
        <div>
          <label style={lbl}>Notes & Memories</label>
          <textarea
            style={{ ...inp, minHeight: 80, resize: 'vertical' }}
            placeholder="What made it special? Any tips for next time?"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        {/* Flags */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[['kidFriendly', '👶 Kid-friendly'], ['wouldReturn', '🔄 Would return']].map(([k, l]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#5a4a30', fontWeight: 600 }}>
              <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} style={{ width: 18, height: 18, accentColor: '#c0663a' }} />
              {l}
            </label>
          ))}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={geocoding}
          style={{
            background: geocoding ? '#c0a080' : '#c0663a',
            color: 'white', border: 'none', borderRadius: 14,
            padding: '14px 0', fontSize: 16, fontWeight: 700,
            cursor: geocoding ? 'default' : 'pointer',
            fontFamily: "'Lora', serif", marginTop: 4,
            transition: 'background 0.15s',
          }}
        >
          {geocoding ? '📍 Pinning location...' : initial ? 'Save Changes' : 'Add to Memory Book'}
        </button>
      </div>
    </div>
  )
}
