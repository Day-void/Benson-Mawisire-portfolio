import { profile } from '../../data/portfolioData'
import targetArt from '../../assets/hero-target.jpg'
import ParticlesContainer from '../ParticlesContainer/ParticlesContainer'
import './Hero.css'

function Hero() {
  return (
    <section className="hero" id="top">
      <ParticlesContainer />
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__name">
            Benson
            <br />
            Mawisire
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
