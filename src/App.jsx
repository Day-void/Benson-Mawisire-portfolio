import { useEffect, useLayoutEffect, useState } from 'react'
import Transition from './components/Transition/Transition'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import BusinessProject from './components/BusinessProject/BusinessProject'
import DynamicProjects from './components/DynamicProjects/DynamicProjects'
import ProductConcept from './components/ProductConcept/ProductConcept'
import StrategyExercise from './components/StrategyExercise/StrategyExercise'
import Process from './components/Process/Process'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import AdminDashboard from './components/Admin/AdminDashboard'

function checkIsAdmin() {
  return (
    window.location.hash === '#admin' ||
    window.location.pathname === '/admin' ||
    window.location.pathname.startsWith('/admin/')
  )
}

function App() {
  const [isAdminView, setIsAdminView] = useState(checkIsAdmin)

  // Listen to hash / URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminView(checkIsAdmin())
    }
    window.addEventListener('hashchange', handleUrlChange)
    window.addEventListener('popstate', handleUrlChange)
    return () => {
      window.removeEventListener('hashchange', handleUrlChange)
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  const navigateToAdmin = () => {
    window.location.hash = 'admin'
    setIsAdminView(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToPublic = () => {
    if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname)
    }
    setIsAdminView(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Animation reveal observer for public view
  useLayoutEffect(() => {
    if (isAdminView) return undefined

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
  }, [isAdminView])

  if (isAdminView) {
    return <AdminDashboard onExitAdmin={navigateToPublic} />
  }

  return (
    <>
      <Transition />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <BusinessProject />
        <DynamicProjects onOpenAdmin={navigateToAdmin} />
        <ProductConcept />
        <StrategyExercise />
        <Process />
        <Contact />
      </main>
      <Footer onOpenAdmin={navigateToAdmin} />
    </>
  )
}

export default App
