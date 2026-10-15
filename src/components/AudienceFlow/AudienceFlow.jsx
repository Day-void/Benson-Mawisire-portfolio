import { usePortfolioContent } from '../../context/PortfolioContext'
import './AudienceFlow.css'

// Audience -> Insight -> Message -> Result. The last card is highlighted.
function AudienceFlow() {
  const { content } = usePortfolioContent()
  const audienceFlow = content?.audienceFlow || []
  return (
    <div className="audience-flow">
      <h3 className="audience-flow__title">Audience to message flow</h3>
      <ol className="audience-flow__list" data-reveal-stagger>
        {audienceFlow.map((item, index) => {
          const isResult = index === audienceFlow.length - 1
          return (
            <li
              key={item.title}
              className={`audience-flow__card ${isResult ? 'audience-flow__card--result' : 'frame'}`}
            >
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default AudienceFlow
