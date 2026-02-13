import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useLayoutDimensions from '../hooks/useLayoutDimensions'

describe('useLayoutDimensions Hook', () => {
  it('hook se define como función', () => {
    expect(useLayoutDimensions).toBeDefined()
    expect(typeof useLayoutDimensions).toBe('function')
  })

  it('se ejecuta sin errores', () => {
    expect(() => {
      renderHook(() => useLayoutDimensions())
    }).not.toThrow()
  })

  it('retorna objeto con propiedades esperadas', () => {
    const { result } = renderHook(() => useLayoutDimensions())
    expect(result.current).toHaveProperty('dimensions')
    expect(result.current).toHaveProperty('measureLayoutElements')
    expect(result.current).toHaveProperty('getCSSHeight')
    expect(result.current).toHaveProperty('isLoading')
  })

  it('dimensions tiene estructura correcta', () => {
    const { result } = renderHook(() => useLayoutDimensions())
    const { dimensions } = result.current
    expect(dimensions).toHaveProperty('headerHeight')
    expect(dimensions).toHaveProperty('footerHeight')
    expect(dimensions).toHaveProperty('availableHeight')
    expect(dimensions).toHaveProperty('availableHeightVh')
  })

  it('limpia listeners en unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useLayoutDimensions())

    unmount()
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    removeSpy.mockRestore()
  })
})
