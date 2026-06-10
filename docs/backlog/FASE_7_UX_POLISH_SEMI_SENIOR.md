# FASE 7 — UX Polish & Frontend Quality (Semi Senior Level)

> Auditoría ejecutada 2026-06-06 con agente Explore.
> Contexto: SPA React 19 + Vite + TypeScript + React Router 7.

---

## 🔴 Críticos (bloqueantes)

### 7.0 — Social page no implementada
- **Archivo**: `src/components/pages/social/Social.tsx:2`
- **Problema**: Solo retorna el string `"social"`, no tiene UI real.
- **Fix**: Implementar la página o redirigir a `/about_me` y sacarla de las rutas activas.

### 7.1 — Tests Vitest no ejecutan
- **Archivo**: `package.json`
- **Problema**: Falta `@testing-library/dom` — los 3 archivos de test fallan al importar.
- **Fix**: `npm install --save-dev @testing-library/dom`

### 7.2 — Sitemap desincronizado
- **Archivo**: `public/sitemap.xml`
- **Problema**: `/social` existe en rutas pero no en el sitemap.
- **Fix**: Agregar `/social` al sitemap o eliminarlo de las rutas.

### 7.3 — Certificates sin SEOHead
- **Archivo**: `src/components/pages/certificates/Certificates.tsx`
- **Problema**: Única página sin meta tags únicos (title, description, og:*).
- **Fix**: Agregar `<SEOHead title="Certificados - Freddy Huaylla" description="..." />`.

---

## 🟡 Altos

### 7.4 — Error/loading states faltantes en 4 páginas
Páginas que usan `useResumeData()` pero no extraen `isLoading` ni `error`:
- `pages/aboutme/AboutMe.tsx:9`
- `pages/landing/Landing.tsx:14`
- `pages/projects/Projects.tsx:11`
- `pages/certificates/Certificates.tsx:83`

**Fix por página**: extraer `{ isLoading, error }` del hook y mostrar:
- Loading: skeleton o spinner
- Error: mensaje "No se pudo cargar el contenido"

### 7.5 — Cypress tests con selectores inválidos
- **Archivo**: `cypress/e2e/mobile-navigation.cy.ts:12,16`
- **Problema**: Busca `data-testid="sidebar-toggle"` que no existe en el DOM.
- **Fix**: Agregar `data-testid="sidebar-toggle"` al botón del Header o actualizar el selector.

### 7.6 — Sin Error Boundary
- **Problema**: 0 `ErrorBoundary` en todo el proyecto. Un error de render no capturado rompe toda la app.
- **Fix**: Agregar `ErrorBoundary` en `main.tsx` envolviendo `<App />` y opcionalmente por página.

---

## 🟡 Medios

### 7.7 — Scroll-to-top automático en cambio de ruta
- **Problema**: Al navegar entre páginas el scroll no resetea.
- **Fix**: Agregar hook `useScrollToTop()` en `MainLayout.tsx` que llame `window.scrollTo(0,0)` en `useEffect([pathname])`.

### 7.8 — Accesibilidad: elementos clickeables sin role
- `src/components/atoms/carousel/HolographicCard.tsx:35` — div con onClick sin `role="button"`
- `src/components/organisms/header/headerBlog.tsx:11` — span con cursor-pointer, debería ser `<button>`
- `src/components/organisms/modal/modalContent.tsx:31` — overlay con onClick sin `role="button"` ni `aria-label`

### 7.9 — Retry logic en useResumeData
- **Archivo**: `src/hooks/useResumeData.ts:65-80`
- **Problema**: Si el fetch falla una vez, no reintenta nunca.
- **Fix**: Agregar botón retry o auto-retry con backoff (1 reintento a los 3s).

### 7.10 — Sin data-testid en elementos críticos
- **Problema**: 0 `data-testid` en todo el codebase. Tests E2E frágiles.
- **Fix**: Agregar `data-testid` al menos en: nav links, sidebar toggle, botón download CV, cards de blog.

---

## 🟢 Mejoras (bajo impacto)

### 7.11 — Lazy loading de páginas
- **Problema**: Todas las páginas se importan estáticamente en `App.tsx`. Bundle único grande.
- **Fix**: `React.lazy()` + `<Suspense fallback={<LoadingSpinner />}>` por ruta.

### 7.12 — Timeout en fetch de useResumeData
- **Problema**: Si el servidor no responde, el fetch cuelga indefinidamente.
- **Fix**: `AbortController` con timeout de 5-10 segundos.

### 7.13 — Landing colgada si backend no responde
- **Problema**: La barra de progreso es artificial pero la landing espera `certificates` del hook. Si falla, la landing puede no avanzar.
- **Fix**: El timeout del progress interval ya maneja esto — verificar que avanza igual si `useResumeData` retorna error.

---

## Estado de tests

| Suite | Archivos | Tests | Estado |
|---|---|---|---|
| Vitest | 3 | ~21 | ❌ No ejecutan (falta @testing-library/dom) |
| Cypress E2E | 4 | ~18 | ⚠️ Algunos selectores inválidos |

---

## Checklist de verificación post-fix

```bash
npm test                          # Vitest — debe pasar los 21 tests
npm run cypress                   # Cypress — debe pasar los 18 tests
npm run build                     # Build limpio sin errores TS
npm run validate:sitemap          # Sitemap sincronizado
```
