import { CATEGORIES } from '../constants'
import { formatDate } from '../utils'
import StarRating from './StarRating'

export default function OutingCard({ outing, onClick }) {
  const cat = CATEGORIES.find(c => c.label === outing.category) || CATEGORIES[0]
  const hasPhoto = outing.photos?.length > 0

  return (
    <div
      onClick={() => onClick(outing)}
      className="outing-card"
      style={{
        background: '#fffdf8', borderRadius: 20, overflow: 'hidden',
        border: '1.5px solid #ede4d4', cursor: 'pointer',
        transition: 'transform 0.18s, box-shadow 0.18s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Photo / Category Header */}
      {hasPhoto ? (
        <div style={{ position: 'relative', height: 155 }}>
          <img src={outing.photos[0].data} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45))' }} />
          {outing.photos.length > 1 && (
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
              +{outing.photos.length - 1}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 28 }}>{cat.emoji}</div>
        </div>
      ) : (
        <div style={{ height: 80, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>
          {cat.emoji}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 5 }}>
          {outing.category}
        </div>
        <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, fontWeight: 700, color: '#2a1f0e', marginBottom: 6, lineHeight: 1.3 }}>
          {outing.name}
        </div>
        {outing.city && (
          <div style={{ fontSize: 12, color: '#9a8a70', marginBottom: 8 }}>📍 {outing.city}</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <StarRating value={outing.rating} size={15} />
          <div style={{ fontSize: 11, color: '#b0a080' }}>{formatDate(outing.date)}</div>
        </div>
        {outing.kidFriendly && (
          <div style={{ marginTop: 8, fontSize: 11, color: '#a06000', fontWeight: 700 }}>👶 Kid-friendly</div>
        )}
      </div>
    </div>
  )
}
