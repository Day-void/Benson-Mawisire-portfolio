import { useEffect, useRef } from 'react'
import './ParticlesContainer.css'

/**
 * Interactive connected particles background adapted from modern-portfolio-main/components/ParticlesContainer.tsx
 * Features:
 * - Floating nodes connected with dynamic web lines
 * - Mouse hover repulsion (particles dodge cursor)
 * - Boundary bouncing
 * - High-DPI canvas rendering
 * - Reduced-motion support
 */
function ParticlesContainer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let animationFrameId
    let width = (canvas.width = canvas.parentElement.offsetWidth)
    let height = (canvas.height = canvas.parentElement.offsetHeight)

    const mouse = {
      x: null,
      y: null,
      radius: 160,
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseout', handleMouseLeave, { passive: true })

    const handleResize = () => {
      if (!canvas.parentElement) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.parentElement.offsetWidth
      height = canvas.parentElement.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    // Initialize particles
    const particleCount = Math.max(30, Math.min(70, Math.floor((width * height) / 14000)))
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1.2,
      })
    }

    const maxLinkDistance = 140

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse repulse interaction (same mode as tsparticles 'repulse')
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius
            const angle = Math.atan2(dy, dx)
            p.x += Math.cos(angle) * force * 3.5
            p.y += Math.sin(angle) * force * 3.5
          }
        }

        p.x += p.vx
        p.y += p.vy

        // Bounce on boundaries
        if (p.x < 0) {
          p.x = 0
          p.vx *= -1
        } else if (p.x > width) {
          p.x = width
          p.vx *= -1
        }

        if (p.y < 0) {
          p.y = 0
          p.vy *= -1
        } else if (p.y > height) {
          p.y = height
          p.vy *= -1
        }

        // Draw particle dot in gold
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(184, 149, 90, 0.55)'
        ctx.fill()

        // Connect nearby particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < maxLinkDistance) {
            const alpha = (1 - dist / maxLinkDistance) * 0.28
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(184, 149, 90, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="particles-container" aria-hidden="true">
      <canvas ref={canvasRef} className="particles-canvas" />
    </div>
  )
}

export default ParticlesContainer
