import SectionHeading from '../SectionHeading/SectionHeading'
import PhoneScreen from '../PhoneScreen/PhoneScreen'
import { airtimeSteps, productConcept } from '../../data/portfolioData'
import './ProductConcept.css'

function ProductConcept() {
  const { label, headline, middle, accent, paragraphs, badge } = productConcept

  return (
    <section className="section concept" id="concept" aria-labelledby="concept-title">
      <div className="container concept__grid">
        <div className="concept__intro">
          <SectionHeading label={label} id="concept-title">
            <span className="accent">{headline[0]}</span>
            <br />
            {middle}
            <br />
            <span className="accent">{accent}</span>
          </SectionHeading>
          {paragraphs.map((text) => (
            <p className="body-copy" data-reveal key={text}>
              {text}
            </p>
          ))}
          <p className="concept__badge" data-reveal>{badge}</p>
        </div>

        <ol className="concept__journey" data-reveal-stagger>
          {airtimeSteps.map((step, index) => (
            <li className="concept__step" key={step.id}>
              <PhoneScreen id={step.id} screen={step.screen} />
              <span className="concept__number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default ProductConcept
