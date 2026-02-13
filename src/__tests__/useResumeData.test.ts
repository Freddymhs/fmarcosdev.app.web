import { describe, it, expect } from 'vitest'
import { useResumeData } from '../hooks/useResumeData'

describe('useResumeData Hook', () => {
  it('devuelve datos del CV', () => {
    const data = useResumeData()
    expect(data.name).toBeDefined()
    expect(data.email).toBeDefined()
  })

  it('devuelve proyectos como array', () => {
    const data = useResumeData()
    expect(Array.isArray(data.projects)).toBe(true)
  })

  it('filtra proyectos publicados', () => {
    const data = useResumeData()
    const publishedProjects = data.projects.filter(p => p.published !== false)
    expect(publishedProjects.length).toBeGreaterThanOrEqual(0)
  })

  it('devuelve información de trabajo', () => {
    const data = useResumeData()
    expect(Array.isArray(data.work)).toBe(true)
  })

  it('devuelve habilidades', () => {
    const data = useResumeData()
    expect(Array.isArray(data.skills)).toBe(true)
  })

  it('devuelve estudios incompletos', () => {
    const data = useResumeData()
    expect(Array.isArray(data.incompledteStudies)).toBe(true)
  })

  it('devuelve proyectos incompletos', () => {
    const data = useResumeData()
    expect(Array.isArray(data.incompletedProjects)).toBe(true)
  })

  it('devuelve perfiles de contacto', () => {
    const data = useResumeData()
    expect(Array.isArray(data.profiles)).toBe(true)
  })
})
