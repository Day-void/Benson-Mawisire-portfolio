import SectionHeading from '../SectionHeading/SectionHeading'
import ContentPlan from '../ContentPlan/ContentPlan'
import { usePortfolioContent } from '../../context/PortfolioContext'
import logo from '../../assets/brand-logo.jpg'
import postGrow from '../../assets/post-grow.jpg'
import postSmart from '../../assets/post-smart.jpg'
import stickers from '../../assets/brand-stickers.jpg'
import './BusinessProject.css'

function BusinessProject() {
  const { content } = usePortfolioContent()
  const businessProject = content?.businessProject || {}
  const { label = '', headline = [], accent = [], paragraphs = [] } = businessProject

  return (
    <section className="section project" id="work" aria-labelledby="project-title">
      <div className="container project__grid">
        <div className="project__intro">
          <SectionHeading label={label} id="project-title">
            {headline[0]}
            <br />
            {headline[1]}
            <br />
            <span className="accent">{accent[0]}</span>
            <br />
            <span className="accent">{accent[1]}</span>
          </SectionHeading>
          {paragraphs.map((text) => (
            <p className="body-copy" data-reveal key={text}>
              {text}
            </p>
          ))}
        </div>

        <div className="project__gallery" data-reveal-stagger>
          <figure className="project__logo">
            <div className="frame">
              <img src={logo} alt="BensonDreams Digital Services logo" />
            </div>
            <figcaption className="caption">Brand logo</figcaption>
          </figure>

          <figure className="project__post">
            <div className="frame">
              <img src={postGrow} alt="Social post: Let’s grow your business" />
            </div>
            <figcaption className="caption">Promotional social post</figcaption>
          </figure>

          <figure className="project__post">
            <div className="frame">
              <img src={postSmart} alt="Social post: Smart content. Strong results." />
            </div>
            <figcaption className="caption">Promotional social post</figcaption>
          </figure>

          <figure className="project__stickers">
            <div className="frame">
              <img src={stickers} alt="BensonDreams round brand stickers" />
            </div>
            <figcaption className="caption">Brand stickers</figcaption>
          </figure>

          <figure className="project__plan">
            <ContentPlan />
            <figcaption className="caption">Content planning sample</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

export default BusinessProject
