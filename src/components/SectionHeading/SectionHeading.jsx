import './SectionHeading.css'

// Reusable heading block: small gold label, big headline, red rule.
// Pass the headline as children so each section can colour its own words.
function SectionHeading({ label, children, id }) {
  return (
    <header className="section-heading" data-reveal>
      {label && <p className="section-heading__label">{label}</p>}
      <h2 className="section-heading__title" id={id}>
        {children}
      </h2>
      <span className="section-heading__rule" aria-hidden="true" />
    </header>
  )
}

export default SectionHeading
