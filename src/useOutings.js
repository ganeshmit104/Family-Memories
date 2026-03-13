import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

function fromDB(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    date: row.date,
    rating: row.rating,
    notes: row.notes,
    city: row.city,
    lat: row.lat,
    lng: row.lng,
    kidFriendly: row.kid_friendly,
    wouldReturn: row.would_return,
    photos: row.photos || [],
  }
}

function toDB(outing, userId) {
  return {
    id: outing.id,
    user_id: userId,
    name: outing.name,
    category: outing.category,
    date: outing.date,
    rating: outing.rating,
    notes: outing.notes || '',
    city: outing.city || '',
    lat: outing.lat || null,
    lng: outing.lng || null,
    kid_friendly: outing.kidFriendly,
    would_return: outing.wouldReturn,
    photos: outing.photos || [],
  }
}

export function useOutings(user) {
  const [outings, setOutings] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoaded(false)
    // Photos are now Storage URLs (small strings) — safe to load all at once
    supabase
      .from('outings')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Load error:', error)
        else setOutings((data || []).map(fromDB))
        setLoaded(true)
      })
  }, [user])

  const saveOuting = useCallback(async (outing) => {
    if (!user) return
    const row = toDB(outing, user.id)
    const { error } = await supabase.from('outings').upsert(row, { onConflict: 'id' })
    if (error) { console.error('Save error:', error); return }
    setOutings(prev =>
      prev.find(o => o.id === outing.id)
        ? prev.map(o => o.id === outing.id ? outing : o)
        : [outing, ...prev]
    )
  }, [user])

  const deleteOuting = useCallback(async (id) => {
    if (!user) return
    const { error } = await supabase.from('outings').delete().eq('id', id)
    if (error) console.error('Delete error:', error)
    else setOutings(prev => prev.filter(o => o.id !== id))
  }, [user])

  const stats = {
    total: outings.length,
    photos: outings.reduce((s, o) => s + (o.photos?.length || 0), 0),
    kidFriendly: outings.filter(o => o.kidFriendly).length,
    avgRating: outings.length
      ? (outings.reduce((s, o) => s + o.rating, 0) / outings.length).toFixed(1)
      : '-',
  }

  return { outings, loaded, saveOuting, deleteOuting, stats }
}
