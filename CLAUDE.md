# CLAUDE.md — fmarcosdev.app.web

## Variables de entorno

- `VITE_API_GATEWAY_URL` NO debe incluir `/api` — ni en `.env.local` ni en Vercel.
  El prefijo `/api` se agrega en el código donde se construye la URL (ej. `blog.tsx`).
  Ejemplo correcto: `http://localhost:3001` / `https://gateway.fmarcos.dev`.

- `VITE_SENTRY_DSN` — DSN de Sentry para error tracking. Vacío/ausente → Sentry
  desactivado (ver `src/instrument.ts`). Definir en Vercel (producción) o `.env.local` (dev).

## SEO / Routing

- `public/sitemap.xml` debe estar sincronizado con `ACTIVE_ROUTES` en `src/constants.ts`.
  Si una ruta se agrega o se quita de `ACTIVE_ROUTES`, actualizar el sitemap en el mismo cambio.
  Una URL en el sitemap que no sea ruta activa causa redirects en Search Console.

- El workflow genera `dist/404.html` copiando `dist/index.html` post-build.
  Esto es necesario para que GitHub Pages sirva la SPA en accesos directos a rutas (ej. `/about_me`).
  No eliminar ese paso del workflow.

## Resume data — assumptions & semantics

- **SSOT cross-repo**: schema de `resume.json` se valida contra `fmarcosdev.api.resume/CLAUDE.md`
  § Convenciones (blast radius cross-repo). Cambios de shape disparan updates sincronizados en
  `src/types/resume.ts` + `src/hooks/useResumeData.ts` + `src/__tests__/useResumeData.test.ts`
  en el mismo flujo.

- **`useResumeData` lee `education?.[0]?.studies`** — asume UNA entry en `education[]`. Si
  en el futuro hay múltiples instituciones (universidad + bootcamp), solo la primera contribuye.
  Caso real 2026-08-19: mover `studies` root → `education[0].studies` requirió sincronizar
  api.resume service + app.web hook/types/test mock.

- **Semántica `incompledteStudies`**: filtra `completed === false && startDate !== ""` = "in-progress"
  (con fecha de inicio asignada). NO es equivalente a `isPendingStudy` del api.resume service,
  que incluye cualquier study sin `completed:true`. La divergencia es intencional — Daily Focus
  necesita foco activo, no wishlist completa de estudios pendientes.
