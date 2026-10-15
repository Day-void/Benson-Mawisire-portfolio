import SectionHeading from '../SectionHeading/SectionHeading'
import { usePortfolioContent } from '../../context/PortfolioContext'
import illustration from '../../assets/about-illustration.jpg'
import './About.css'

function About() {
  const { content } = usePortfolioContent()
  const aboutParagraphs = content?.aboutParagraphs || []
  const aboutSignoff = content?.aboutSignoff || ''

  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div>
          <SectionHeading id="about-title">About me</SectionHeading>
          {aboutParagraphs.map((text, i) => (
            <p className="body-copy" data-reveal="right" key={i}>
              {text}
            </p>
          ))}
          <p className="about__signoff" data-reveal="right">{aboutSignoff}</p>
        </div>

        <div className="about__art" data-reveal="left">
          <img
            src={illustration}
            alt="Illustration of a head profile with a target, connected to an audience, a web page and a growth chart"
            width="900"
            height="941"
          />
        </div>
      </div>
    </section>
  )
}

export default About
