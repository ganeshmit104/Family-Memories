import { useRef } from 'react'
import { generateId, readFileAsDataURL } from '../utils'

export default function PhotoUploader({ photos, onChange }) {
  const inputRef = useRef()

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      const data = await readFileAsDataURL(file)
      onChange(prev => [...(prev || []), { id: generateId(), data }])
    }
    e.target.value = ''
  }

  const remove = (id) => onChange(prev => prev.filter(p => p.id !== id))

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {(photos || []).map(p => (
          <div key={p.id} style={{ position: 'relative', width: 88, height: 88 }}>
            <img
              src={p.data} alt=""
              style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 12, border: '2px solid #e0d4c0' }}
            />
            <button
              onClick={() => remove(p.id)}
              style={{
                position: 'absolute', top: -7, right: -7,
                background: '#c04040', color: 'white',
                border: 'none', borderRadius: '50%',
                width: 22, height: 22, cursor: 'pointer',
                fontSize: 12, fontWeight: 700, lineHeight: 1,
              }}
            >✕</button>
          </div>
        ))}
        <button
          onClick={() => inputRef.current.click()}
          style={{
            width: 88, height: 88, borderRadius: 12,
            border: '2px dashed #c0b090', background: '#faf7f0',
            cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <span style={{ fontSize: 22 }}>📷</span>
          <span style={{ fontSize: 10, color: '#9a8a70', fontWeight: 700 }}>Add Photo</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
    </div>
  )
}
