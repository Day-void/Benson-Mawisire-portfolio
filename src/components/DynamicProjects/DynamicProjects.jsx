import { useEffect, useState } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import { getProjects } from '../../lib/supabase'
import './DynamicProjects.css'

function DynamicProjects({ onOpenAdmin }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchList() {
      try {
        const data = await getProjects()
        if (mounted) {
          setProjects(data || [])
        }
      } catch (err) {
        console.error('Failed to load projects', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchList()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="section dynamic-projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="dynamic-projects__header" data-reveal="down">
          <div>
            <SectionHeading label="Managed Portfolio" id="projects-title">
              Selected Work &
              <br />
              <span className="accent">Live Projects</span>
            </SectionHeading>
          </div>

          <a
            href="#admin"
            onClick={(e) => {
              if (onOpenAdmin) {
                e.preventDefault()
                onOpenAdmin()
              }
            }}
            className="dynamic-projects__admin-link"
            title="Open Admin Dashboard to add or edit projects without touching code"
          >
            <span>⚙</span>
            <span>Manage Projects</span>
          </a>
        </div>

        {loading ? (
          <div className="dynamic-projects__empty" data-reveal>
            <p className="body-copy">Loading portfolio projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="dynamic-projects__empty" data-reveal>
            <p className="body-copy">No custom projects added yet.</p>
            <p className="body-copy" style={{ marginTop: '0.5rem' }}>
              <a
                href="#admin"
                onClick={(e) => {
                  if (onOpenAdmin) {
                    e.preventDefault()
                    onOpenAdmin()
                  }
                }}
                className="gold"
                style={{ textDecoration: 'underline' }}
              >
                Open Admin to add your first project
              </a>
            </p>
          </div>
        ) : (
          <div className="dynamic-projects__grid" data-reveal-stagger>
            {projects.map((proj) => (
              <article className="project-card" key={proj.id}>
                {proj.image_url && (
                  <div className="project-card__image-wrap">
                    <img
                      src={proj.image_url}
                      alt={proj.title}
                      className="project-card__image"
                      loading="lazy"
                    />
                    {proj.featured && (
                      <span className="project-card__featured-badge">Featured</span>
                    )}
                  </div>
                )}

                <div className="project-card__body">
                  {proj.category && (
                    <span className="project-card__category">{proj.category}</span>
                  )}
                  <h3 className="project-card__title">{proj.title}</h3>
                  <p className="project-card__desc">{proj.description}</p>

                  {proj.tags && proj.tags.length > 0 && (
                    <div className="project-card__tags">
                      {proj.tags.map((tag) => (
                        <span className="project-card__tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {proj.link && (
                    <a
                      href={proj.link}
                      target={proj.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="project-card__link"
                    >
                      View Case Study &rarr;
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DynamicProjects
