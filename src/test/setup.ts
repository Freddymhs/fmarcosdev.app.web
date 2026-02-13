import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// Mock de resume.json
vi.mock('../../resume.json', () => ({
  default: {
    basics: {
      name: 'Freddy Huaylla',
      label: 'Fullstack Developer',
      email: 'test@example.com',
      profiles: [],
    },
    projects: [
      {
        name: 'Test Project',
        description: 'A test project',
        published: true,
      },
    ],
    work: [],
    studies: [],
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
    ],
    education: [],
    certificates: [],
  },
}))
