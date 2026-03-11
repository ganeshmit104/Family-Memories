import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEY } from './constants'

export function useOutings() {
  const [outings, setOutings] = useState([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setOutings(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to load outings:', e)
    }
    setLoaded(true)
  }, [])

  // Save to localStorage whenever outings change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(outings))
    } catch (e) {
      console.warn('Failed to save outings:', e)
    }
  }, [outings, loaded])

  const saveOuting = useCallback((outing) => {
    setOutings(prev =>
      prev.find(o => o.id === outing.id)
        ? prev.map(o => o.id === outing.id ? outing : o)
        : [outing, ...prev]
    )
  }, [])

  const deleteOuting = useCallback((id) => {
    setOutings(prev => prev.filter(o => o.id !== id))
  }, [])

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
