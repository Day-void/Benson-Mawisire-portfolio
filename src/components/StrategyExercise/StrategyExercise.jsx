import SectionHeading from '../SectionHeading/SectionHeading'
import AudienceFlow from '../AudienceFlow/AudienceFlow'
import SostacGrid from '../SostacGrid/SostacGrid'
import CreativeConcept from '../CreativeConcept/CreativeConcept'
import { usePortfolioContent } from '../../context/PortfolioContext'
import './StrategyExercise.css'

function StrategyExercise() {
  const { content } = usePortfolioContent()
  const strategyExercise = content?.strategyExercise || {}
  const { label = '', headline = [], accent = '', slogan = '', paragraphs = [], disclaimer = '' } = strategyExercise

  return (
    <section className="section strategy" id="strategy" aria-labelledby="strategy-title">
      <div className="container strategy__stack">
        <div className="strategy__top" data-reveal>
          <div>
            <SectionHeading label={label} id="strategy-title">
              {headline[0]}
              <br />
              {headline[1]}
              <br />
              <span className="accent">{accent}</span>
            </SectionHeading>
            <p className="strategy__slogan" data-reveal>{slogan}</p>
            {paragraphs.map((text) => (
              <p className="body-copy" data-reveal key={text}>
                {text}
              </p>
            ))}
          </div>
          <CreativeConcept />
        </div>

        <SostacGrid />
        <AudienceFlow />

        <aside className="strategy__note frame" data-reveal>
          <strong>Strategy exercise only</strong>
          <span>{disclaimer}</span>
        </aside>
      </div>
    </section>
  )
}

export default StrategyExercise
