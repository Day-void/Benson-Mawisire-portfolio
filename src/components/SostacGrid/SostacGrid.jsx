import { usePortfolioContent } from '../../context/PortfolioContext'
import './SostacGrid.css'

// The six SOSTAC stages - this one really is a sequence, so numbers stay.
function SostacGrid() {
  const { content } = usePortfolioContent()
  const sostac = content?.sostac || []
  return (
    <div className="sostac">
      <h3 className="sostac__title">Strategy framework: SOSTAC</h3>
      <ol className="sostac__list" data-reveal-stagger>
        {sostac.map((stage, index) => (
          <li className="sostac__card frame" key={stage.title}>
            <span className="sostac__number">{index + 1}</span>
            <h4>{stage.title}</h4>
            <p>{stage.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default SostacGrid
