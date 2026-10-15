import { useState } from 'react'
import { usePortfolioContent } from '../../context/PortfolioContext'
import './Navbar.css'

function Navbar() {
  const { content } = usePortfolioContent()
  const profile = content?.profile || {}
  const navLinks = content?.navLinks || []
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#top" className="navbar__brand" onClick={closeMenu}>
          <span className="navbar__mark" aria-hidden="true" />
          {profile.name || 'Benson Mawisire'}
        </a>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav
          id="primary-nav"
          className={`navbar__links ${open ? 'navbar__links--open' : ''}`}
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
