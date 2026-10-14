import SectionHeading from '../SectionHeading/SectionHeading'
import { skills, workflow } from '../../data/portfolioData'
import './Skills.css'

function Skills() {
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading id="skills-title">
          What I <span className="accent">bring</span>
          <br />
          to the table
        </SectionHeading>

        <ul className="skills__grid" data-reveal-stagger>
          {skills.map((skill) => (
            <li className="skills__item" key={skill}>
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
