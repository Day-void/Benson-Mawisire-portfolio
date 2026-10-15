import { usePortfolioContent } from '../../context/PortfolioContext'
import thumbs from '../../assets/content-thumbs.jpg'
import './ContentPlan.css'

// Weekly content calendar: one column per day, plus the post thumbnails.
function ContentPlan() {
  const { content } = usePortfolioContent()
  const contentPlan = content?.contentPlan || []
  return (
    <div className="content-plan frame">
      <h3 className="content-plan__title">Content plan overview</h3>

      <div className="content-plan__scroll">
        <table className="content-plan__table">
          <thead>
            <tr>
              {contentPlan.map(({ day }) => (
                <th key={day} scope="col">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {contentPlan.map(({ day, theme }) => (
                <td key={day}>{theme}</td>
              ))}
            </tr>
            <tr className="content-plan__goals">
              {contentPlan.map(({ day, goal }) => (
                <td key={day}>{goal}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <img
        className="content-plan__thumbs"
        src={thumbs}
        alt="Seven branded social posts, one for each day of the week"
        width="1076"
        height="208"
      />
    </div>
  )
}

export default ContentPlan
