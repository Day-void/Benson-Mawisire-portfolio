import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Default initial projects for demo / local storage fallback
const INITIAL_LOCAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'BensonDreams Brand Identity & Content Strategy',
    category: 'Brand Strategy & Social Media',
    description:
      'Developed an end-to-end visual identity and 7-day content engine for a digital services personal brand, driving brand recognition and inbound conversions.',
    image_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    link: 'https://vibrant-grow-showcase.lovable.app',
    tags: ['Content Strategy', 'Brand Identity', 'Social Media'],
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'proj-2',
    title: 'Wevhu MobApp Airtime Frictionless UX',
    category: 'Product & Growth Concept',
    description:
      'Designed a 5-step rapid airtime top-up customer journey reducing cognitive load and checkout drop-off across local payment gateways.',
    image_url:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    link: '#concept',
    tags: ['Product Concept', 'Mobile UX', 'Conversion Optimisation'],
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'proj-3',
    title: 'Xash Point Merchant Acquisition Campaign',
    category: 'Digital Marketing & Merchant Strategy',
    description:
      'Strategic market activation using the SOSTAC framework to position local convenience stores as neighborhood digital service hubs.',
    image_url:
      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    link: '#strategy',
    tags: ['SOSTAC', 'Audience Research', 'B2B Acquisition'],
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
]

const LOCAL_STORAGE_KEY = 'benson_portfolio_projects'
const LOCAL_AUTH_KEY = 'benson_admin_session'
const LOCAL_PASSWORD_KEY = 'benson_admin_custom_password'
const LOCAL_CONTENT_KEY = 'benson_site_content'

/* ==============================================================
   PROJECTS API
   ============================================================== */

function getLocalProjects() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_LOCAL_PROJECTS))
      return INITIAL_LOCAL_PROJECTS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_LOCAL_PROJECTS
  }
}

function saveLocalProjects(projects) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects))
  } catch (err) {
    console.error('Failed to save to localStorage', err)
  }
}

export async function getProjects() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (!error && data) {
      return data
    }
    console.warn('Supabase query failed, falling back to local projects:', error)
  }

  return getLocalProjects()
}

export async function createProject(project) {
  const newProject = {
    ...project,
    tags: Array.isArray(project.tags)
      ? project.tags
      : (project.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select()
      .single()

    if (error) throw error
    return data
  }

  const projects = getLocalProjects()
  const localProject = {
    ...newProject,
    id: 'local-' + Date.now(),
  }
  projects.unshift(localProject)
  saveLocalProjects(projects)
  return localProject
}

export async function updateProject(id, updates) {
  const sanitizedUpdates = {
    ...updates,
    tags: Array.isArray(updates.tags)
      ? updates.tags
      : (updates.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const projects = getLocalProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index !== -1) {
    projects[index] = { ...projects[index], ...sanitizedUpdates }
    saveLocalProjects(projects)
    return projects[index]
  }
  throw new Error('Project not found')
}

export async function deleteProject(id) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return true
  }

  const projects = getLocalProjects()
  const filtered = projects.filter((p) => p.id !== id)
  saveLocalProjects(filtered)
  return true
}

/* ==============================================================
   SITE CONTENT API (Edit Whole Portfolio)
   ============================================================== */

function getLocalSiteContent() {
  try {
    const raw = localStorage.getItem(LOCAL_CONTENT_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveLocalSiteContent(content) {
  try {
    localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(content))
  } catch (err) {
    console.error('Failed to save site content to localStorage', err)
  }
}

export async function getSiteContent() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('site_content').select('*')
    if (!error && data) {
      const mapped = {}
      data.forEach((row) => {
        mapped[row.key] = row.value
      })
      return mapped
    }
    console.warn('Supabase site_content query failed, using local storage fallback:', error)
  }

  return getLocalSiteContent()
}

export async function saveSiteContentSection(key, value) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('site_content').upsert(
      {
        key,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
    if (error) throw error
  }

  // Always mirror in localStorage for instantaneous offline/backup resilience
  const current = getLocalSiteContent()
  current[key] = value
  saveLocalSiteContent(current)
  return true
}

export async function resetSiteContentSection(key) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('site_content').delete().eq('key', key)
  }

  const current = getLocalSiteContent()
  delete current[key]
  saveLocalSiteContent(current)
  return true
}

export async function resetAllSiteContent() {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('site_content').delete().neq('key', '')
  }
  localStorage.removeItem(LOCAL_CONTENT_KEY)
  return true
}

/* ==============================================================
   BACKUP & EXPORT / IMPORT (Foolproof Safety)
   ============================================================== */

export async function exportAllData() {
  const projects = await getProjects()
  const siteContent = await getSiteContent()
  return JSON.stringify(
    {
      version: '1.0',
      exported_at: new Date().toISOString(),
      projects,
      site_content: siteContent,
    },
    null,
    2
  )
}

export async function importAllData(jsonString) {
  const data = JSON.parse(jsonString)
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid backup file format.')
  }

  if (Array.isArray(data.projects)) {
    saveLocalProjects(data.projects)
  }

  if (data.site_content && typeof data.site_content === 'object') {
    saveLocalSiteContent(data.site_content)
    if (isSupabaseConfigured && supabase) {
      for (const [key, value] of Object.entries(data.site_content)) {
        await supabase.from('site_content').upsert(
          {
            key,
            value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        )
      }
    }
  }

  return true
}

/* ==============================================================
   IMAGE UPLOAD API
   ============================================================== */

export async function uploadProjectImage(file) {
  if (!file) return null

  // File size validation: warn / block if > 8MB
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image file is too large (maximum 8MB). Please choose a smaller image.')
  }

  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('project-images').getPublicUrl(filePath)
    return data.publicUrl
  }

  // Base64 local fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/* ==============================================================
   AUTHENTICATION & PASSWORD MANAGEMENT
   ============================================================== */

export async function adminSignIn(email, password) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data.session
  }

  // Local / demo mode password check
  const ADMIN_EMAIL = 'mawisirebenson4@gmail.com'
  if (email !== ADMIN_EMAIL) {
    throw new Error('Unrecognised email address.')
  }
  const customPassword = localStorage.getItem(LOCAL_PASSWORD_KEY) || 'admin123'
  if (password === customPassword || (!localStorage.getItem(LOCAL_PASSWORD_KEY) && password.length >= 6)) {
    const demoSession = {
      user: { email: ADMIN_EMAIL },
      isLocal: true,
      expiresAt: Date.now() + 86400000,
    }
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoSession))
    return demoSession
  }
  throw new Error('Incorrect password. Please verify and try again.')
}

export async function updateAdminPassword(newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.')
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return true
  }

  // Local mode: save customized password in localStorage
  localStorage.setItem(LOCAL_PASSWORD_KEY, newPassword)
  return true
}

export async function adminSignOut() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut()
  }
  localStorage.removeItem(LOCAL_AUTH_KEY)
}

export async function getAdminSession() {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession()
    return data.session
  }

  try {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (session.expiresAt && session.expiresAt > Date.now()) {
      return session
    }
    localStorage.removeItem(LOCAL_AUTH_KEY)
    return null
  } catch {
    return null
  }
}
