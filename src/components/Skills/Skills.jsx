import SectionHeading from '../SectionHeading/SectionHeading'
import { usePortfolioContent } from '../../context/PortfolioContext'
import './Skills.css'

function Skills() {
  const { content } = usePortfolioContent()
  const skills = content?.skills || []
  const workflow = content?.workflow || []

  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading id="skills-title">
          What I <span className="accent">bring</span>
          <br />
          to the table
        </SectionHeading>

        <ul className="skills__grid" data-reveal-stagger>
          {skills.map((skill, i) => (
            <li className="skills__item" key={i}>
              {skill}
            </li>
          ))}
        </ul>

        <ol className="skills__flow" aria-label="How I work" data-reveal-stagger>
          {workflow.map((step) => (
            <li key={step} className="skills__step">
              <span>{step}</span>
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Skills
