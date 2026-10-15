import { usePortfolioContent } from '../../context/PortfolioContext'
import targetArt from '../../assets/hero-target.jpg'
import ParticlesContainer from '../ParticlesContainer/ParticlesContainer'
import './Hero.css'

function Hero() {
  const { content } = usePortfolioContent()
  const profile = content?.profile || {}

  return (
    <section className="hero" id="top">
      <ParticlesContainer />
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__name">
            {profile.name ? (
              profile.name.split(' ').map((part, i) => (
                <span key={i}>
                  {part}
                  {i === 0 && <br />}
                </span>
              ))
            ) : (
              <>
                Benson
                <br />
                Mawisire
              </>
            )}
          </h1>
          <span className="hero__rule" aria-hidden="true" />
          <p className="hero__title">{profile.title}</p>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__location">
            <span aria-hidden="true" className="hero__dash" />
            {profile.location}
          </p>
        </div>

        <div className="hero__art">
          <img src={targetArt} alt="" width="900" height="1057" />
        </div>
      </div>
    </section>
  )
}

export default Hero
