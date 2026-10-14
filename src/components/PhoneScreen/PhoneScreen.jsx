import { demoAmount, demoPhoneNumber } from '../../data/portfolioData'
import './PhoneScreen.css'

// Small inline icons so there are no extra image files to manage.
const icons = {
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </svg>
  ),
  dollar: <span className="phone-screen__glyph">$</span>,
  pencil: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />
    </svg>
  ),
  bank: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 12.5l4 4 8-9" />
    </svg>
  ),
}

// One mock phone. `screen` comes from airtimeSteps in portfolioData.js
function PhoneScreen({ id, screen }) {
  const { icon, prompt, presets, methods, cta } = screen

  return (
    <div className="phone-screen" role="img" aria-label={`App screen: ${prompt}`}>
      <div className="phone-screen__notch" />
      <p className="phone-screen__brand">
        <span className="accent">WE</span>
        <span className="gold">VHU</span>
      </p>

      <div className="phone-screen__icon">{icons[icon]}</div>
      <p className="phone-screen__prompt">{prompt}</p>

      {id === 'phone' && <div className="phone-screen__field">{demoPhoneNumber}</div>}

      {presets && (
        <div className="phone-screen__presets">
          {presets.map((p) => (
            <span key={p}>{p}</span>
          ))}
          <span className="phone-screen__other">Other amount</span>
        </div>
      )}

      {id === 'confirm' && (
        <div className="phone-screen__field phone-screen__field--big">
          {demoAmount}
          <small>USD</small>
        </div>
      )}

      {methods && (
        <div className="phone-screen__methods">
          {methods.map((m, i) => (
            <span key={m} className={i === 0 ? 'is-active' : ''}>
              {m}
              <b aria-hidden="true">›</b>
            </span>
          ))}
        </div>
      )}

      {id === 'confirmation' && (
        <div className="phone-screen__field phone-screen__field--receipt">
          {demoPhoneNumber}
          <strong>{demoAmount}</strong>
        </div>
      )}

      <span
        className={`phone-screen__cta ${id === 'confirmation' ? 'phone-screen__cta--gold' : ''}`}
      >
        {cta}
      </span>
      {id === 'confirmation' && <span className="phone-screen__link">View receipt</span>}
    </div>
  )
}

export default PhoneScreen
