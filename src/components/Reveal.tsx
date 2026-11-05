import { useEffect, useRef, useState } from 'react'

type RevealProps = {
  as?: 'div' | 'article' | 'section'
  children: React.ReactNode
  className?: string
  delay?: number
}

export function Reveal({ as: Tag = 'div', children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const setRef = (node: HTMLElement | null) => {
    ref.current = node
  }

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const props = {
    ref: setRef,
    className: `reveal ${isVisible ? 'reveal-visible' : ''} ${className}`,
    style: { transitionDelay: `${delay}ms` },
    children,
  }

  if (Tag === 'article') return <article {...props} />
  if (Tag === 'section') return <section {...props} />
  return <div {...props} />
}
