import { useEffect, useState } from 'react'
import './Transition.css'

/**
 * Three-tier transition curtains inspired by modern-portfolio-main/components/Transition.tsx
 * Staggered sweeps (0.15s, 0.35s, 0.55s) revealing the page on mount,
 * automatically removing themselves after completion.
 */
function Transition() {
  const [active, setActive] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false)
    }, 1400)
    return () => clearTimeout(timer)
  }, [])

  if (!active) return null

  return (
    <div className="transition-curtains" aria-hidden="true">
      <div className="transition-curtain transition-curtain--1" />
      <div className="transition-curtain transition-curtain--2" />
      <div className="transition-curtain transition-curtain--3" />
    </div>
  )
}

export default Transition
