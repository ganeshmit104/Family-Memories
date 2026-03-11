import { useState } from 'react'

export default function StarRating({ value, onChange, size = 22 }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            fontSize: size,
            cursor: onChange ? 'pointer' : 'default',
            color: s <= (hover || value) ? '#e8a020' : '#ddd',
            transition: 'color 0.12s',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
