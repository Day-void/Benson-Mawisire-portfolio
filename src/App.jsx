import { useLayoutEffect } from 'react'
import Transition from './components/Transition/Transition'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import BusinessProject from './components/BusinessProject/BusinessProject'
import ProductConcept from './components/ProductConcept/ProductConcept'
import StrategyExercise from './components/StrategyExercise/StrategyExercise'
import Process from './components/Process/Process'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

function App() {
  useLayoutEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || !('IntersectionObserver' in window)) return undefined

    const targets = new Set(document.querySelectorAll('[data-reveal]'))
    document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
      group.querySelectorAll(':scope > *').forEach((item, index) => {
        if (!item.hasAttribute('data-reveal')) {
          item.setAttribute('data-reveal', 'up')
        }
        item.style.setProperty('--reveal-delay', `${Math.min(index * 120, 600)}ms`)
        targets.add(item)
      })
    })

    document.documentElement.dataset.motionReady = 'true'
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => {
      observer.disconnect()
      delete document.documentElement.dataset.motionReady
    }
  }, [])

  return (
    <>
      <Transition />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <BusinessProject />
        <ProductConcept />
        <StrategyExercise />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
