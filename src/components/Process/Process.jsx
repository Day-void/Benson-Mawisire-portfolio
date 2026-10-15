import SectionHeading from '../SectionHeading/SectionHeading'
import { usePortfolioContent } from '../../context/PortfolioContext'
import './Process.css'

function Process() {
  const { content } = usePortfolioContent()
  const processSteps = content?.processSteps || []
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading id="process-title">
          <span className="accent">
            From insight
            <br />
            to execution
          </span>
        </SectionHeading>

        <ol className="process__list" data-reveal-stagger>
          {processSteps.map((step, index) => (
            <li className="process__card frame" key={step.title}>
              <span className="process__number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Process
