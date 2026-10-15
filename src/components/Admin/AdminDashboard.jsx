import { useEffect, useState } from 'react'
import {
  adminSignIn,
  adminSignOut,
  createProject,
  deleteProject,
  getAdminSession,
  getProjects,
  isSupabaseConfigured,
  updateAdminPassword,
  updateProject,
  uploadProjectImage,
} from '../../lib/supabase'
import { usePortfolioContent } from '../../context/PortfolioContext'
import './AdminDashboard.css'

function AdminDashboard({ onExitAdmin }) {
  const { content, updateSection, resetSection, resetAll, downloadBackup, restoreBackup } =
    usePortfolioContent()

  const [session, setSession] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('projects')

  // Status feedback
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Password change state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Projects list state
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  // Project Modal / Editing state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [savingProject, setSavingProject] = useState(false)
  const [projectFormError, setProjectFormError] = useState('')
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: '',
    link: '',
    tags: '',
    featured: false,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  // Site Content Section Form States
  const [profileForm, setProfileForm] = useState(content.profile || {})
  const [aboutForm, setAboutForm] = useState({
    paragraphs: (content.aboutParagraphs || []).join('\n\n'),
    signoff: content.aboutSignoff || '',
  })
  const [skillsForm, setSkillsForm] = useState({
    skills: (content.skills || []).join('\n'),
    workflow: (content.workflow || []).join(', '),
  })
  const [contactForm, setContactForm] = useState(content.contact || {})
  const [caseStudiesForm, setCaseStudiesForm] = useState({
    businessProject: content.businessProject || {},
    productConcept: content.productConcept || {},
    strategyExercise: content.strategyExercise || {},
  })

  // Show setup guide modal
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  // Sync section forms when context content loads/changes
  useEffect(() => {
    if (content.profile) setProfileForm(content.profile)
    if (content.aboutParagraphs) {
      setAboutForm({
        paragraphs: (content.aboutParagraphs || []).join('\n\n'),
        signoff: content.aboutSignoff || '',
      })
    }
    if (content.skills) {
      setSkillsForm({
        skills: (content.skills || []).join('\n'),
        workflow: (content.workflow || []).join(', '),
      })
    }
    if (content.contact) setContactForm(content.contact)
    if (content.businessProject) {
      setCaseStudiesForm({
        businessProject: content.businessProject || {},
        productConcept: content.productConcept || {},
        strategyExercise: content.strategyExercise || {},
      })
    }
  }, [content])

  // Check auth session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const s = await getAdminSession()
        setSession(s)
      } catch (err) {
        console.error('Session check failed', err)
      } finally {
        setCheckingAuth(false)
      }
    }
    checkSession()
  }, [])

  // Load projects once authenticated
  useEffect(() => {
    if (session) {
      loadProjects()
    }
  }, [session])

  function showSuccess(msg) {
    setSuccessMessage(msg)
    setErrorMessage('')
    setTimeout(() => setSuccessMessage(''), 4500)
  }

  function showError(msg) {
    setErrorMessage(msg)
    setSuccessMessage('')
    setTimeout(() => setErrorMessage(''), 5500)
  }

  async function loadProjects() {
    setLoadingProjects(true)
    try {
      const data = await getProjects()
      setProjects(data || [])
    } catch (err) {
      console.error('Failed to load projects', err)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Handle Login
  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    try {
      const s = await adminSignIn(email, password)
      setSession(s)
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials.')
    } finally {
      setLoggingIn(false)
    }
  }

  // Handle Logout
  async function handleLogout() {
    await adminSignOut()
    setSession(null)
  }

  /* =========================================================
     PROJECT ACTIONS
     ========================================================= */

  function handleOpenCreateProject() {
    setEditingProject(null)
    setProjectFormData({
      title: '',
      category: 'Digital Marketing & Strategy',
      description: '',
      image_url: '',
      link: '',
      tags: 'Strategy, Social Media, Content',
      featured: true,
    })
    setImageFile(null)
    setImagePreview('')
    setProjectFormError('')
    setIsModalOpen(true)
  }

  function handleOpenEditProject(project) {
    setEditingProject(project)
    setProjectFormData({
      title: project.title || '',
      category: project.category || '',
      description: project.description || '',
      image_url: project.image_url || '',
      link: project.link || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      featured: Boolean(project.featured),
    })
    setImageFile(null)
    setImagePreview(project.image_url || '')
    setProjectFormError('')
    setIsModalOpen(true)
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function handleSaveProject(e) {
    e.preventDefault()
    if (!projectFormData.title.trim()) {
      setProjectFormError('Project title is required.')
      return
    }

    setSavingProject(true)
    setProjectFormError('')

    try {
      let finalImageUrl = projectFormData.image_url
      if (imageFile) {
        finalImageUrl = await uploadProjectImage(imageFile)
      }

      const payload = {
        title: projectFormData.title.trim(),
        category: projectFormData.category.trim(),
        description: projectFormData.description.trim(),
        image_url: finalImageUrl,
        link: projectFormData.link.trim(),
        tags: projectFormData.tags,
        featured: projectFormData.featured,
      }

      if (editingProject) {
        await updateProject(editingProject.id, payload)
        showSuccess(`Updated "${payload.title}" successfully!`)
      } else {
        await createProject(payload)
        showSuccess(`Created "${payload.title}" successfully!`)
      }

      setIsModalOpen(false)
      loadProjects()
    } catch (err) {
      console.error('Save failed', err)
      setProjectFormError(err.message || 'Failed to save project.')
    } finally {
      setSavingProject(false)
    }
  }

  async function handleDeleteProject(id, title) {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProject(id)
        showSuccess(`Deleted "${title}".`)
        loadProjects()
      } catch (err) {
        showError('Failed to delete project: ' + err.message)
      }
    }
  }

  /* =========================================================
     SITE CONTENT SAVE ACTIONS
     ========================================================= */

  async function handleSaveProfile(e) {
    e.preventDefault()
    try {
      await updateSection('profile', profileForm)
      showSuccess('Profile & Hero details saved! Live site updated.')
    } catch (err) {
      showError('Failed to save profile: ' + err.message)
    }
  }

  async function handleSaveAbout(e) {
    e.preventDefault()
    try {
      const paragraphs = aboutForm.paragraphs
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)
      await updateSection('aboutParagraphs', paragraphs)
      await updateSection('aboutSignoff', aboutForm.signoff.trim())
      showSuccess('About section saved! Live site updated.')
    } catch (err) {
      showError('Failed to save About section: ' + err.message)
    }
  }

  async function handleSaveSkills(e) {
    e.preventDefault()
    try {
      const skillsList = skillsForm.skills
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
      const workflowList = skillsForm.workflow
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean)
      await updateSection('skills', skillsList)
      await updateSection('workflow', workflowList)
      showSuccess('Skills and Workflow saved! Live site updated.')
    } catch (err) {
      showError('Failed to save Skills: ' + err.message)
    }
  }

  async function handleSaveContact(e) {
    e.preventDefault()
    try {
      await updateSection('contact', contactForm)
      showSuccess('Contact details saved! Live site updated.')
    } catch (err) {
      showError('Failed to save Contact: ' + err.message)
    }
  }

  async function handleSaveCaseStudies(e) {
    e.preventDefault()
    try {
      await updateSection('businessProject', caseStudiesForm.businessProject)
      await updateSection('productConcept', caseStudiesForm.productConcept)
      await updateSection('strategyExercise', caseStudiesForm.strategyExercise)
      showSuccess('Case Studies & Concepts saved! Live site updated.')
    } catch (err) {
      showError('Failed to save Case Studies: ' + err.message)
    }
  }

  /* =========================================================
     PASSWORD CHANGE ACTION
     ========================================================= */

  async function handleChangePassword(e) {
    e.preventDefault()
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match. Please re-enter.')
      return
    }

    setChangingPassword(true)
    try {
      await updateAdminPassword(newPassword)
      setNewPassword('')
      setConfirmPassword('')
      showSuccess('Admin password changed successfully! Remember your new password.')
    } catch (err) {
      showError('Failed to update password: ' + err.message)
    } finally {
      setChangingPassword(false)
    }
  }

  /* =========================================================
     RESET & BACKUP ACTIONS (FOOLPROOF SAFETY)
     ========================================================= */

  async function handleResetSectionConfirm(sectionKey, sectionLabel) {
    if (
      window.confirm(
        `Are you sure you want to restore "${sectionLabel}" to original defaults? Any custom edits in this section will be replaced with original text.`
      )
    ) {
      try {
        await resetSection(sectionKey)
        showSuccess(`"${sectionLabel}" restored to defaults.`)
      } catch (err) {
        showError('Reset failed: ' + err.message)
      }
    }
  }

  async function handleResetAllConfirm() {
    if (
      window.confirm(
        'CAUTION: Are you sure you want to restore the ENTIRE portfolio back to factory defaults? All custom text edits will be reverted.'
      )
    ) {
      try {
        await resetAll()
        showSuccess('Entire website restored to original factory defaults.')
      } catch (err) {
        showError('Reset failed: ' + err.message)
      }
    }
  }

  async function handleBackupUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (window.confirm('Restore website from this backup file? This will apply all saved projects and text.')) {
      try {
        await restoreBackup(file)
        loadProjects()
        showSuccess('Backup restored successfully! All projects and text updated.')
      } catch (err) {
        showError('Failed to restore backup: ' + err.message)
      }
    }
  }

  if (checkingAuth) {
    return (
      <div className="admin-page admin-login-wrapper">
        <p className="body-copy">Checking admin credentials...</p>
      </div>
    )
  }

  /* =========================================================
     LOGIN SCREEN
     ========================================================= */

  if (!session) {
    return (
      <div className="admin-page">
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <h2>Portfolio Admin CMS</h2>
            <p>Sign in to edit your projects, copy, and settings without touching code.</p>

            {loginError && <div className="form-error">{loginError}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <input
                  id="admin-email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
                <button
                  type="submit"
                  className="btn btn--primary"
                  style={{ flex: 1 }}
                  disabled={loggingIn}
                >
                  {loggingIn ? 'Signing in...' : 'Sign In'}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={onExitAdmin}
                >
                  Back to Site
                </button>
              </div>
            </form>

            <div className="admin-notice">
              <strong>Status:</strong>{' '}
              {isSupabaseConfigured ? (
                <span style={{ color: '#4ade80' }}>Connected to Supabase Cloud</span>
              ) : (
                <span>
                  Running in <strong>Local Preview Mode</strong>. Default password is <code>admin123</code> (or any 6+ character password). You can change this password anytime in the dashboard.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================
     AUTHENTICATED DASHBOARD
     ========================================================= */

  return (
    <div className="admin-page">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__brand">
            <h1>Benson Mawisire CMS</h1>
            {isSupabaseConfigured ? (
              <span className="admin-badge admin-badge--cloud">
                <span>●</span> Supabase Cloud
              </span>
            ) : (
              <span
                className="admin-badge admin-badge--local"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowSetupGuide(true)}
                title="Click to view instructions for connecting free Supabase"
              >
                <span>○</span> Local Mode (Click to connect Cloud)
              </span>
            )}
          </div>

          <div className="admin-header__actions">
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={onExitAdmin}
            >
              &larr; View Live Site
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="admin-tabs" aria-label="CMS Navigation">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'projects' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            📁 Projects
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'profile' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Hero & Profile
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'about' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            📝 About Me
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'skills' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            ⚡ Skills & Workflow
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'caseStudies' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('caseStudies')}
          >
            💼 Case Studies & Copy
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'contact' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            📞 Contact Info
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'password' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 Password
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'backup' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            🛡️ Backup & Safety
          </button>
        </nav>
      </header>

      {/* Main Admin Content */}
      <main className="admin-content">
        {/* Success / Error Banners */}
        {successMessage && (
          <div className="form-success">
            <span>{successMessage}</span>
            <button
              type="button"
              onClick={() => setSuccessMessage('')}
              style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>
        )}
        {errorMessage && (
          <div className="form-error">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 1: PROJECTS
           ------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div>
            <div className="admin-toolbar">
              <div>
                <h2>Portfolio Projects</h2>
                <p>Manage project cards with custom cover images, tags, and case study links.</p>
              </div>

              <button
                type="button"
                className="btn btn--primary"
                onClick={handleOpenCreateProject}
              >
                + Add New Project
              </button>
            </div>

            {loadingProjects ? (
              <p className="body-copy">Loading projects...</p>
            ) : projects.length === 0 ? (
              <div className="dynamic-projects__empty">
                <p className="body-copy">No custom projects yet. Click "+ Add New Project" to create one.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Thumbnail</th>
                      <th>Title & Category</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj.id}>
                        <td style={{ width: '80px' }}>
                          {proj.image_url ? (
                            <img
                              src={proj.image_url}
                              alt=""
                              className="admin-table-thumb"
                            />
                          ) : (
                            <div
                              className="admin-table-thumb"
                              style={{
                                display: 'grid',
                                placeItems: 'center',
                                color: 'var(--muted)',
                                fontSize: '0.7rem',
                              }}
                            >
                              No img
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="admin-table-title">{proj.title}</div>
                          <div className="admin-table-category">{proj.category}</div>
                        </td>
                        <td>
                          {proj.tags && proj.tags.length > 0 ? (
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                              {proj.tags.map((t) => (
                                <span key={t} className="project-card__tag">
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>-</span>
                          )}
                        </td>
                        <td>
                          {proj.featured ? (
                            <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem' }}>
                              ★ Featured
                            </span>
                          ) : (
                            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Standard</span>
                          )}
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="btn btn--secondary btn--small"
                              onClick={() => handleOpenEditProject(proj)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn--danger btn--small"
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: HERO & PROFILE
           ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h3>Hero Section & Profile Information</h3>
                <p>Edit your name, primary title, tagline, and location shown at the top of the portfolio.</p>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--small"
                onClick={() => handleResetSectionConfirm('profile', 'Profile & Hero')}
              >
                ↺ Restore Defaults
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.name || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Professional Role / Headline</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.role || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  placeholder="e.g. Digital Marketer & Strategist"
                  required
                />
              </div>

              <div className="form-group">
                <label>Hero Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.title || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  placeholder="e.g. Digital Marketing Portfolio"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.tagline || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  placeholder="e.g. Strategy. Creativity. Digital Growth."
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.location || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  placeholder="e.g. Harare, Zimbabwe"
                />
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary">
                  Save Hero & Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: ABOUT ME
           ------------------------------------------------------------- */}
        {activeTab === 'about' && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h3>About Me Section</h3>
                <p>Edit the story paragraphs and signoff quote in your About section.</p>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--small"
                onClick={() => {
                  handleResetSectionConfirm('aboutParagraphs', 'About Paragraphs')
                  handleResetSectionConfirm('aboutSignoff', 'About Signoff')
                }}
              >
                ↺ Restore Defaults
              </button>
            </div>

            <form onSubmit={handleSaveAbout}>
              <div className="form-group">
                <label>About Paragraphs (Separate paragraphs with a blank line)</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '180px' }}
                  value={aboutForm.paragraphs}
                  onChange={(e) => setAboutForm({ ...aboutForm, paragraphs: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Signoff Quote / Highlight Line</label>
                <input
                  type="text"
                  className="form-control"
                  value={aboutForm.signoff}
                  onChange={(e) => setAboutForm({ ...aboutForm, signoff: e.target.value })}
                  placeholder="e.g. Always learning. Always optimizing. Always delivering value."
                />
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary">
                  Save About Section
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: SKILLS & WORKFLOW
           ------------------------------------------------------------- */}
        {activeTab === 'skills' && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h3>Skills & Workflow Strip</h3>
                <p>Edit your core skills grid and the 5-step strategic workflow strip.</p>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--small"
                onClick={() => {
                  handleResetSectionConfirm('skills', 'Skills')
                  handleResetSectionConfirm('workflow', 'Workflow')
                }}
              >
                ↺ Restore Defaults
              </button>
            </div>

            <form onSubmit={handleSaveSkills}>
              <div className="form-group">
                <label>Skills (One skill per line)</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '180px' }}
                  value={skillsForm.skills}
                  onChange={(e) => setSkillsForm({ ...skillsForm, skills: e.target.value })}
                  placeholder="Social Media Marketing&#10;SEO & Performance&#10;Email Marketing"
                  required
                />
              </div>

              <div className="form-group">
                <label>Workflow Phases (Comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={skillsForm.workflow}
                  onChange={(e) => setSkillsForm({ ...skillsForm, workflow: e.target.value })}
                  placeholder="Research, Strategise, Create, Execute, Measure"
                />
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary">
                  Save Skills & Workflow
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: CASE STUDIES & COPY
           ------------------------------------------------------------- */}
        {activeTab === 'caseStudies' && (
          <div>
            {/* Business Marketing Project */}
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h3>Business Marketing Project (BensonDreams)</h3>
                  <p>Edit headline and paragraph copy for the business marketing case study.</p>
                </div>
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  onClick={() => handleResetSectionConfirm('businessProject', 'Business Project')}
                >
                  ↺ Restore
                </button>
              </div>

              <form onSubmit={handleSaveCaseStudies}>
                <div className="form-group">
                  <label>Section Label</label>
                  <input
                    type="text"
                    className="form-control"
                    value={caseStudiesForm.businessProject?.label || ''}
                    onChange={(e) =>
                      setCaseStudiesForm({
                        ...caseStudiesForm,
                        businessProject: {
                          ...caseStudiesForm.businessProject,
                          label: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Description Paragraphs (One per line)</label>
                  <textarea
                    className="form-control"
                    style={{ minHeight: '130px' }}
                    value={(caseStudiesForm.businessProject?.paragraphs || []).join('\n\n')}
                    onChange={(e) =>
                      setCaseStudiesForm({
                        ...caseStudiesForm,
                        businessProject: {
                          ...caseStudiesForm.businessProject,
                          paragraphs: e.target.value.split('\n\n').filter(Boolean),
                        },
                      })
                    }
                  />
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn--primary">
                    Save Case Studies Copy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 6: CONTACT INFORMATION
           ------------------------------------------------------------- */}
        {activeTab === 'contact' && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h3>Contact & Social Details</h3>
                <p>Update your email address, phone number, portfolio link, and call-to-action message.</p>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--small"
                onClick={() => handleResetSectionConfirm('contact', 'Contact Information')}
              >
                ↺ Restore Defaults
              </button>
            </div>

            <form onSubmit={handleSaveContact}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={contactForm.email || ''}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number (Display text)</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactForm.phone || ''}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      phone: e.target.value,
                      phoneHref: e.target.value.replace(/[^0-9+]/g, ''),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>External Portfolio URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={contactForm.portfolio || ''}
                  onChange={(e) => setContactForm({ ...contactForm, portfolio: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Closing Paragraphs (One per line)</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '120px' }}
                  value={(contactForm.paragraphs || []).join('\n\n')}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      paragraphs: e.target.value.split('\n\n').filter(Boolean),
                    })
                  }
                />
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary">
                  Save Contact Info
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 7: CHANGE ADMIN PASSWORD
           ------------------------------------------------------------- */}
        {activeTab === 'password' && (
          <div className="admin-card" style={{ maxWidth: '600px' }}>
            <div className="admin-card__header">
              <div>
                <h3>Change Admin Password</h3>
                <p>Update the password you use to log into this CMS dashboard.</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>New Password (Min 6 characters)</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={changingPassword}
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>

            <div className="admin-notice" style={{ marginTop: '1.5rem' }}>
              <strong>Tip:</strong> In Local Mode, your new password is saved in your browser storage. When Supabase Cloud is connected, it updates your Supabase authentication record directly.
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 8: BACKUP & SAFETY (FOOLPROOF CONTROLS)
           ------------------------------------------------------------- */}
        {activeTab === 'backup' && (
          <div>
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h3>Foolproof Safety: Export & Import Backups</h3>
                  <p>
                    Download a full JSON backup of all your projects and custom text at any time. If you ever want to migrate devices or restore a previous version, simply upload the backup file.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={downloadBackup}
                >
                  ↓ Download Full Backup (.json)
                </button>

                <label className="btn btn--secondary" style={{ cursor: 'pointer' }}>
                  ↑ Restore From Backup (.json)
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleBackupUpload}
                  />
                </label>
              </div>
            </div>

            {/* Disaster Recovery Reset */}
            <div className="admin-card" style={{ borderColor: 'rgba(192, 36, 28, 0.4)' }}>
              <div className="admin-card__header">
                <div>
                  <h3 style={{ color: '#ff6b6b' }}>Factory Reset</h3>
                  <p>
                    If you made mistakes or want to revert the entire website back to its original layout and default text from the start, click below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn--danger"
                onClick={handleResetAllConfirm}
              >
                ⚠ Restore Entire Website to Original Defaults
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {projectFormError && <div className="form-error">{projectFormError}</div>}

            <form onSubmit={handleSaveProject}>
              <div className="form-group">
                <label htmlFor="proj-title">Project Title *</label>
                <input
                  id="proj-title"
                  type="text"
                  className="form-control"
                  placeholder="e.g. EcoCash 360 Growth Campaign"
                  value={projectFormData.title}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="proj-category">Category / Specialization</label>
                <input
                  id="proj-category"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Social Media & Performance Marketing"
                  value={projectFormData.category}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, category: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="proj-desc">Project Description</label>
                <textarea
                  id="proj-desc"
                  className="form-control"
                  placeholder="Briefly explain the challenge, strategy executed, and results delivered..."
                  value={projectFormData.description}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, description: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Project Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <div style={{ marginTop: '0.4rem' }}>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Or paste an image URL (e.g. https://...)"
                    value={projectFormData.image_url}
                    onChange={(e) => {
                      setProjectFormData({ ...projectFormData, image_url: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                  />
                </div>

                {imagePreview && (
                  <div className="image-upload-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="image-upload-remove"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview('')
                        setProjectFormData({ ...projectFormData, image_url: '' })
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="proj-link">External / Case Study Link (Optional)</label>
                <input
                  id="proj-link"
                  type="text"
                  className="form-control"
                  placeholder="https://... or #work"
                  value={projectFormData.link}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, link: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="proj-tags">Tags (Comma-separated)</label>
                <input
                  id="proj-tags"
                  type="text"
                  className="form-control"
                  placeholder="Content Strategy, SEO, Paid Ads"
                  value={projectFormData.tags}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, tags: e.target.value })
                  }
                />
              </div>

              <div className="checkbox-group">
                <input
                  id="proj-featured"
                  type="checkbox"
                  checked={projectFormData.featured}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, featured: e.target.checked })
                  }
                />
                <label htmlFor="proj-featured" style={{ cursor: 'pointer', color: 'var(--cream)' }}>
                  Highlight as Featured Project
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={savingProject}
                >
                  {savingProject ? 'Saving Project...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Connection Guide Modal */}
      {showSetupGuide && (
        <div className="modal-overlay" onClick={() => setShowSetupGuide(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Connect Free Supabase Cloud</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowSetupGuide(false)}
              >
                &times;
              </button>
            </div>

            <div style={{ lineHeight: 1.6, color: 'var(--muted)', fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                Your CMS is currently in <strong>Local Mode</strong> (all changes and password updates are safely stored in your browser).
              </p>
              <p style={{ marginBottom: '1rem' }}>
                To sync your edits across devices with <strong>Supabase</strong>:
              </p>

              <ol style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li>
                  Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="gold">supabase.com</a>.
                </li>
                <li>
                  In your Supabase dashboard, open <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>.
                </li>
                <li>
                  Copy & paste the contents of <code>supabase_schema.sql</code> and click <strong>Run</strong>.
                </li>
                <li>
                  Open <strong>Project Settings &rarr; API</strong>, copy your <strong>Project URL</strong> and <strong>anon public key</strong>.
                </li>
                <li>
                  Create a file named <code>.env</code> in your project root:
                  <pre style={{ background: '#080808', padding: '0.8rem', border: '1px solid var(--gold-line)', marginTop: '0.4rem', color: 'var(--cream)', fontSize: '0.85rem' }}>
VITE_SUPABASE_URL=https://your-project.supabase.co{'\n'}
VITE_SUPABASE_ANON_KEY=your-anon-public-key
                  </pre>
                </li>
              </ol>

              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setShowSetupGuide(false)}
                style={{ width: '100%' }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
