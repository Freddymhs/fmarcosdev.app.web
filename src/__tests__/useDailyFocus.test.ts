import { describe, it, expect } from 'vitest'
import { useDailyFocus } from '../hooks/useDailyFocus'

describe('useDailyFocus Hook', () => {
  it('retorna undefined para array vacío', () => {
    const result = useDailyFocus([])
    expect(result).toBeUndefined()
  })

  it('retorna item del array', () => {
    const items = [{ id: 1, name: 'Item 1' }]
    const result = useDailyFocus(items)
    expect(result).toBeDefined()
    expect(items).toContain(result)
  })

  it('retorna item consistente para el mismo día', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]
    const result1 = useDailyFocus(items)
    const result2 = useDailyFocus(items)
    expect(result1).toEqual(result2)
  })

  it('retorna item dentro del rango de array', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const result = useDailyFocus(items)
    expect(items.indexOf(result!)).toBeGreaterThanOrEqual(0)
    expect(items.indexOf(result!)).toBeLessThan(items.length)
  })

  it('funciona con diferentes tipos de datos', () => {
    const stringItems = ['a', 'b', 'c']
    const result = useDailyFocus(stringItems)
    expect(result).toBeDefined()
    expect(stringItems).toContain(result)
  })
})
