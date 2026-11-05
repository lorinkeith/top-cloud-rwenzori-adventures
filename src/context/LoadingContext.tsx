import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const LoadingContext = createContext<() => () => void>(() => () => {})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(0)
  const register = useCallback(() => {
    setPending(count => count + 1)
    let finished = false
    return () => {
      if (finished) return
      finished = true
      setPending(count => Math.max(0, count - 1))
    }
  }, [])
  const loading = pending > 0
  useEffect(() => {
    if (!loading) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [loading])
  return <LoadingContext.Provider value={register}>
    <div inert={loading} aria-busy={loading}>{children}</div>
    {loading ? <div className="gorilla-loader" role="status" aria-live="polite" aria-label="Loading, please wait">
      <div><img src="/gorilla-loader.svg" alt="" aria-hidden="true" /><div className="gorilla-loader-dots" aria-hidden="true"><span /><span /><span /></div></div>
    </div> : null}
  </LoadingContext.Provider>
}

export function useLoadingTask(active: boolean) {
  const register = useContext(LoadingContext)
  useEffect(() => {
    if (active) return register()
  }, [active, register])
}
