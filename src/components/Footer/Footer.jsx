import { profile } from '../../data/portfolioData'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner" data-reveal>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>{profile.location}</p>
      </div>
    </footer>
  )
}

export default Footer
