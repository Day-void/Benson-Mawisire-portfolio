import { contact, profile } from '../../data/portfolioData'
import './Contact.css'

function Contact() {
  const { headline, paragraphs, email, phone, phoneHref, portfolio } = contact

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div data-reveal="right">
          <h2 className="contact__title accent" id="contact-title">
            {headline[0]}
            <br />
            {headline[1]}
            <br />
            {headline[2]}
          </h2>
          <span className="contact__rule" aria-hidden="true" />
          {paragraphs.map((text) => (
            <p className="body-copy" data-reveal="right" key={text}>
              {text}
            </p>
          ))}
        </div>

        <address className="contact__details" data-reveal="left">
          <p className="contact__name">{profile.name}</p>
          <p>{profile.role}</p>
          <p className="contact__location">{profile.location}</p>

          <dl>
            <div>
              <dt>Email:</dt>
              <dd>
                <a href={`mailto:${email}`}>{email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone:</dt>
              <dd>
                <a href={`tel:${phoneHref}`}>{phone}</a>
              </dd>
            </div>
            <div>
              <dt>Portfolio:</dt>
              <dd>
                <a href={portfolio} target="_blank" rel="noreferrer">
                  {portfolio}
                </a>
              </dd>
            </div>
          </dl>
        </address>
      </div>
    </section>
  )
}

export default Contact
