import { creativeConcept } from '../../data/portfolioData'
import tent from '../../assets/xash-tent.jpg'
import './CreativeConcept.css'

// Left: the poster copy rebuilt as text. Right: the table-tent mockup photo.
function CreativeConcept() {
  const { brand, headline, subline, points, footer } = creativeConcept

  return (
    <div className="creative">
      <h3 className="creative__title">Campaign creative concept</h3>

      <div className="creative__panel frame">
        <div className="creative__poster">
          <p className="creative__brand">{brand}</p>
          <p className="creative__headline">{headline}</p>
          <p className="creative__subline">{subline}</p>
          <ul className="creative__points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="creative__footer">{footer}</p>
        </div>

        <img
          className="creative__tent"
          src={tent}
          alt="Table-top sign reading: Turn your shop into a Xash Point"
          width="648"
          height="470"
        />
      </div>
    </div>
  )
}

export default CreativeConcept
