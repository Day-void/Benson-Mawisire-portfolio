import { createContext, useContext, useEffect, useState } from 'react'
import * as defaultData from '../data/portfolioData'
import {
  exportAllData,
  getSiteContent,
  importAllData,
  resetAllSiteContent,
  resetSiteContentSection,
  saveSiteContentSection,
} from '../lib/supabase'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  // Start with default hardcoded data from portfolioData.js
  const [content, setContent] = useState({
    profile: defaultData.profile,
    aboutParagraphs: defaultData.aboutParagraphs,
    aboutSignoff: defaultData.aboutSignoff,
    skills: defaultData.skills,
    workflow: defaultData.workflow,
    businessProject: defaultData.businessProject,
    contentPlan: defaultData.contentPlan,
    productConcept: defaultData.productConcept,
    airtimeSteps: defaultData.airtimeSteps,
    strategyExercise: defaultData.strategyExercise,
    audienceFlow: defaultData.audienceFlow,
    sostac: defaultData.sostac,
    creativeConcept: defaultData.creativeConcept,
    processSteps: defaultData.processSteps,
    contact: defaultData.contact,
    demoPhoneNumber: defaultData.demoPhoneNumber,
    demoAmount: defaultData.demoAmount,
    navLinks: defaultData.navLinks,
  })

  const [loading, setLoading] = useState(true)

  // Load custom content overrides from Supabase / localStorage on mount
  const refreshContent = async () => {
    try {
      const overrides = await getSiteContent()
      if (overrides && Object.keys(overrides).length > 0) {
        setContent((prev) => ({
          ...prev,
          ...overrides,
        }))
      }
    } catch (err) {
      console.warn('Could not load site content overrides, using defaults:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshContent()
  }, [])

  /**
   * Update a specific section of the portfolio (e.g. 'profile', 'aboutParagraphs', 'contact')
   */
  const updateSection = async (sectionKey, newValues) => {
    setContent((prev) => ({
      ...prev,
      [sectionKey]: newValues,
    }))
    await saveSiteContentSection(sectionKey, newValues)
  }

  /**
   * Reset a specific section back to its original default content
   */
  const resetSection = async (sectionKey) => {
    if (defaultData[sectionKey] !== undefined) {
      setContent((prev) => ({
        ...prev,
        [sectionKey]: defaultData[sectionKey],
      }))
      await resetSiteContentSection(sectionKey)
    }
  }

  /**
   * Reset the entire website back to factory default content
   */
  const resetAll = async () => {
    setContent({
      profile: defaultData.profile,
      aboutParagraphs: defaultData.aboutParagraphs,
      aboutSignoff: defaultData.aboutSignoff,
      skills: defaultData.skills,
      workflow: defaultData.workflow,
      businessProject: defaultData.businessProject,
      contentPlan: defaultData.contentPlan,
      productConcept: defaultData.productConcept,
      airtimeSteps: defaultData.airtimeSteps,
      strategyExercise: defaultData.strategyExercise,
      audienceFlow: defaultData.audienceFlow,
      sostac: defaultData.sostac,
      creativeConcept: defaultData.creativeConcept,
      processSteps: defaultData.processSteps,
      contact: defaultData.contact,
      demoPhoneNumber: defaultData.demoPhoneNumber,
      demoAmount: defaultData.demoAmount,
      navLinks: defaultData.navLinks,
    })
    await resetAllSiteContent()
  }

  /**
   * Download a complete JSON backup file of all portfolio projects and text
   */
  const downloadBackup = async () => {
    const jsonStr = await exportAllData()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `benson-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Restore portfolio from a backup JSON file
   */
  const restoreBackup = async (file) => {
    const text = await file.text()
    await importAllData(text)
    await refreshContent()
  }

  return (
    <PortfolioContext.Provider
      value={{
        content,
        defaultData,
        loading,
        updateSection,
        resetSection,
        resetAll,
        downloadBackup,
        restoreBackup,
        refreshContent,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolioContent must be used within a PortfolioProvider')
  }
  return context
}
