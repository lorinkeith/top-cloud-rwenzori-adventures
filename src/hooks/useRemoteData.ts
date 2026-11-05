import { useEffect, useState } from 'react'
import { hasSupabaseConfig } from '../lib/supabaseClient'
import { useLoadingTask } from '../context/LoadingContext'

// Refresh while visible and on focus. No static fallback after a configured query fails:
// deleted or unpublished packages must never reappear as demo content.
export function useRemoteData<T>(load: () => Promise<T>, fallback: T, key = '') {
  const [state, setState] = useState<{ key: string; data: T; loading: boolean; error: string }>({ key, data: fallback, loading: hasSupabaseConfig, error: '' })
  useEffect(() => {
    if (!hasSupabaseConfig) return
    let alive = true
    let version = 0
    const refresh = async () => {
      const request = ++version
      try {
        const data = await load()
        if (alive && request === version) setState({ key, data, loading: false, error: '' })
      } catch {
        if (alive && request === version) setState({ key, data: fallback, loading: false, error: 'Content is temporarily unavailable. Please try again.' })
      }
    }
    void refresh()
    const onFocus = () => { if (!document.hidden) void refresh() }
    const interval = window.setInterval(onFocus, 15000)
    window.addEventListener('focus', onFocus)
    return () => { alive = false; window.clearInterval(interval); window.removeEventListener('focus', onFocus) }
    // Callers use stable service functions; key identifies parameterized resources.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const result = state.key === key ? state : { key, data: fallback, loading: hasSupabaseConfig, error: '' }
  useLoadingTask(result.loading)
  return result
}
