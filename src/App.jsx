import { useState, useCallback } from 'react'
import { CATEGORIES } from './constants'
import { useOutings } from './useOutings'
import Modal from './components/Modal'
import OutingCard from './components/OutingCard'
import MapView from './components/MapView'
import AddForm from './components/AddForm'
import DetailView from './components/DetailView'

export default function App() {
  const { outings, loaded, saveOuting, deleteOuting, stats } = useOutings()
  const [view, setView] = useState('list') // 'list' | 'map'
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [filterCat, setFilterCat] = useState('All')
  const [search, setSearch] = useState('')

  const handleSave = useCallback((outing) => {
    saveOuting(outing)
    setShowAdd(false)
    setEditing(null)
  }, [saveOuting])

  const handleDelete = useCallback((id) => {
    deleteOuting(id)
    setViewing(null)
  }, [deleteOuting])

  const filtered = outings
    .filter(o => filterCat === 'All' || o.category === filterCat)
    .filter(o =>
      !search ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.city?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f0' }}>

      {/* ── Header ── */}
      <header style={{
        background: 'linear-gradient(160deg, #1e1408 0%, #3a2510 60%, #4a3020 100%)',
        padding: '36px 24px 28px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          background: 'radial-gradient(ellipse at 30% 60%, #e8a020 0%, transparent 55%), radial-gradient(ellipse at 75% 20%, #c0663a 0%, transparent 45%)',
        }} />
        <div style={{ fontSize: 44, marginBottom: 6 }}>📖</div>
        <h1 style={{ fontFamily: "'Lora', serif", color: '#fdf8f0', fontSize: 30, margin: '0 0 6px', fontWeight: 700, position: 'relative' }}>
          Family Memory Book
        </h1>
        <p style={{ color: '#c0a070', fontSize: 14, margin: '0 0 24px', position: 'relative' }}>
          All the places we've explored together
        </p>

        {/* Stats */}
        {outings.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', position: 'relative' }}>
            {[
              [stats.total, 'Places'],
              [stats.photos, 'Photos'],
              [stats.kidFriendly, 'Kid-Friendly'],
              [stats.avgRating + '★', 'Avg Rating'],
            ].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 24, color: '#e8a020', fontWeight: 700 }}>{v}</div>
                <div style={{ fontSize: 11, color: '#9a7a50', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* ── Controls ── */}
      <div style={{ padding: '16px 20px 0', maxWidth: 880, margin: '0 auto' }}>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 6, background: '#f0e8d8', borderRadius: 16, padding: 5, marginBottom: 14 }}>
          {[['list', '🗂️', 'Places'], ['map', '🗺️', 'Map View']].map(([v, emoji, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 12,
                background: view === v ? '#2a1f0e' : 'transparent',
                color: view === v ? '#fdf8f0' : '#7a6a50',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        {view === 'list' && (
          <>
            {/* Search + Add */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <input
                placeholder="🔍  Search places..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, minWidth: 180, padding: '10px 14px', borderRadius: 12,
                  border: '1.5px solid #e0d4c0', background: '#fffdf8',
                  fontSize: 14, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  background: '#c0663a', color: 'white', border: 'none',
                  borderRadius: 12, padding: '10px 22px', fontSize: 14,
                  fontWeight: 700, cursor: 'pointer', fontFamily: "'Lora', serif",
                }}
              >
                + Add Place
              </button>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
              {['All', ...CATEGORIES.map(c => c.label)].map(cat => {
                const c = CATEGORIES.find(x => x.label === cat)
                const active = filterCat === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    style={{
                      padding: '7px 14px', borderRadius: 20,
                      border: `1.5px solid ${active ? (c?.color || '#c0663a') : '#e0d4c0'}`,
                      background: active ? (c?.color || '#c0663a') + '18' : 'transparent',
                      color: active ? (c?.color || '#c0663a') : '#7a6a50',
                      fontSize: 13, cursor: 'pointer', fontWeight: 700,
                      whiteSpace: 'nowrap', transition: 'all 0.15s',
                    }}
                  >
                    {c ? `${c.emoji} ` : '🗺️ '}{cat}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Content ── */}
      <main style={{ padding: '16px 20px 60px', maxWidth: 880, margin: '0 auto' }}>

        {/* Map View */}
        {view === 'map' && (
          <div>
            <MapView outings={outings} />
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  background: '#c0663a', color: 'white', border: 'none',
                  borderRadius: 14, padding: '12px 28px', fontSize: 15,
                  fontWeight: 700, cursor: 'pointer', fontFamily: "'Lora', serif",
                }}
              >
                + Add Place
              </button>
            </div>
          </div>
        )}

        {/* List View — loading */}
        {view === 'list' && !loaded && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9a8a70' }}>Loading memories...</div>
        )}

        {/* List View — empty */}
        {view === 'list' && loaded && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>{outings.length === 0 ? '🗺️' : '🔍'}</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 20, color: '#5a4a30', marginBottom: 8 }}>
              {outings.length === 0 ? 'Start Your Memory Book' : 'No places found'}
            </div>
            <p style={{ color: '#9a8a70', fontSize: 14, marginBottom: 22 }}>
              {outings.length === 0
                ? 'Add your first family outing and start building memories!'
                : 'Try a different search or filter'}
            </p>
            {outings.length === 0 && (
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  background: '#c0663a', color: 'white', border: 'none',
                  borderRadius: 14, padding: '13px 30px', fontSize: 15,
                  fontWeight: 700, cursor: 'pointer', fontFamily: "'Lora', serif",
                }}
              >
                + Add First Place
              </button>
            )}
          </div>
        )}

        {/* List View — cards grid */}
        {view === 'list' && loaded && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {filtered.map(o => (
              <OutingCard key={o.id} outing={o} onClick={setViewing} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {(showAdd || editing) && (
        <Modal onClose={() => { setShowAdd(false); setEditing(null) }}>
          <AddForm
            onSave={handleSave}
            onClose={() => { setShowAdd(false); setEditing(null) }}
            initial={editing}
          />
        </Modal>
      )}

      {viewing && !editing && (
        <Modal onClose={() => setViewing(null)}>
          <DetailView
            outing={viewing}
            onClose={() => setViewing(null)}
            onEdit={o => { setEditing(o); setViewing(null) }}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </div>
  )
}
