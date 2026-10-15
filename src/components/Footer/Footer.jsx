import { usePortfolioContent } from '../../context/PortfolioContext'
import './Footer.css'

function Footer({ onOpenAdmin }) {
  const { content } = usePortfolioContent()
  const profile = content?.profile || {}

  return (
    <footer className="footer">
      <div className="container footer__inner" data-reveal>
        <p>
          © {new Date().getFullYear()} {profile.name || 'Benson Mawisire'}
        </p>
        <p>{profile.location || 'Harare, Zimbabwe'}</p>
        <a
          href="#admin"
          onClick={(e) => {
            if (onOpenAdmin) {
              e.preventDefault()
              onOpenAdmin()
            }
          }}
          style={{ opacity: 0.35, fontSize: '0.8rem', textDecoration: 'none', transition: 'opacity 0.2s' }}
          onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.target.style.opacity = '0.35')}
          title="Admin CMS Portal"
        >
          ⚙ CMS Portal
        </a>
      </div>
    </footer>
  )
}

export default Footer
