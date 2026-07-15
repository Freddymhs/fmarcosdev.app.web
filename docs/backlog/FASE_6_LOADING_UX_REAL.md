# FASE 6 — Loading UX real (matar el timer falso)

> Detectado 2026-07-15. Consolida y prioriza items ya anotados en FASE_8 (8.4, 8.9, 8.11, 8.12, 8.13)
> que apuntan al mismo problema raíz: la app es CSR pura, pero simula progreso en vez de reportarlo.

## Contexto — por qué importa

`Landing.tsx` no es un loader real. Es un `setInterval` que suma `+2.1%` cada 70ms (~2.3s) totalmente
desconectado de `useResumeData()`. Solo usa el hook para `certificates` (preload de imágenes). Cuando
el timer decorativo llega a 100%, redirige a `/about_me` — sin importar si los datos ya llegaron o no.

Y `AboutMe.tsx` (igual que `Projects.tsx` y `Certificates.tsx`) no extrae `isLoading`/`error` del hook:
recién al entrar arranca el fetch real, sin ningún estado visible. Resultado: 2.3s de teatro + un
segundo fetch invisible después, sin loading state — la peor combinación de percepción de rendimiento.

No es un problema de arquitectura CSR vs SSR (ver `docs/backlog/ideas nuevas fases.txt` — el proyecto
es SPA pura sin runtime de servidor, PPR no aplica). Es un problema de que el "loading" nunca estuvo
conectado al fetch real.

## Decisión de stack tomada

**Data fetching: `useResumeData` migra de `useEffect` + `fetch` crudo a TanStack Query (`useQuery`).**

Alternativas descartadas: fix mínimo sin deps nuevas (cierra la UX pero no los gaps de abajo); solo
tocar `Landing.tsx` (deja 8.4/8.9/8.11 pendientes de nuevo).

Por qué TanStack Query y no mínimo:
- Cierra `[gap]` real de wishlist inbox (sin triage aún): *"Resilience patterns (Circuit Breaker,
  Retry, Idempotency)"* y *"manejar de forma limpia los estados y errores en la interfaz"* — retry con
  backoff sale de la librería, no hay que escribirlo a mano (pide exactamente 8.9: "1 reintento a los 3s").
- Cachea entre componentes: hoy `App.tsx` (para `DailyFocusPill`) y cada página llaman
  `useResumeData()` por separado → fetches duplicados. `useQuery` con la misma `queryKey` los dedupea.
- `stale-while-revalidate` de fábrica, sin código propio.

Riesgo de gold-plating: ninguno relevante — es una librería, no una feature nueva, y ataca directamente
gaps ya marcados. No agregar Suspense-mode de TanStack Query (`useSuspenseQuery`) en esta fase — mezclar
Suspense de datos con Suspense de code-splitting (8.11) en el mismo golpe es más superficie de la que
esta fase necesita. Si más adelante se migra a Suspense-mode, que sea decisión aparte.

---

## 🔴 Críticos (bloqueantes de la UX real)

### 6.0 — Instalar y configurar TanStack Query
- **Paquete**: `@tanstack/react-query` (+ `@tanstack/react-query-devtools` como devDependency,
  cargado lazy y solo en dev — no debe pesar en el bundle de producción).
- **Archivo nuevo**: `src/queryClient.ts` — instancia de `QueryClient` (staleTime razonable,
  `refetchOnWindowFocus: false` para no re-disparar fetch en cada foco de ventana en un portfolio).
- **`src/main.tsx`**: envolver `<App />` con `<QueryClientProvider client={queryClient}>`.

### 6.1 — `useResumeData` sobre `useQuery`
- **Archivo**: `src/hooks/useResumeData.ts:60-80`
- **Problema**: `useEffect` + `fetch` manual, sin cache, sin retry, sin timeout.
- **Fix**: `queryKey: ["resume"]`, `queryFn` con `AbortSignal.timeout(8000)` (cierra 8.12), `retry: 1`,
  `retryDelay: 3000` (cierra 8.9 — spec exacta ya en el doc). Mantener la MISMA shape de retorno
  (`isLoading`, `error: string | null`, + todos los campos derivados) para no tocar los 10+ consumidores
  del hook. Agregar `refetch` al retorno — lo necesita 6.2 y 6.3 para el botón de reintentar.

### 6.2 — `Landing.tsx` deja de mentir
- **Archivo**: `src/components/pages/landing/Landing.tsx:20-54`
- **Problema**: el `setInterval` de 70ms/+2.1% y el chequeo `progress === 100` no tienen relación con
  si los datos llegaron. Sacar TODO el timer decorativo.
- **Fix**: progreso derivado de `isLoading`/`error` reales del hook. Mientras `isLoading` → barra en un
  valor intermedio fijo (ej. 55%) + mensaje random existente (`WELCOME_MESSAGES`, mantenerlo — no todo
  lo actual está mal, solo el timer). Al resolver sin error → barra a 100% y navegar tras un delay corto
  (~250ms, solo para que la transición CSS de la barra no corte en seco — NO un timer de espera). Si
  `error` → mostrar mensaje de error + botón "Reintentar" que llame `refetch()`.
- **Cuidado**: el efecto de navegación actual tiene
  `// eslint-disable-next-line react-hooks/exhaustive-deps` sobre `navigate` — mantenerlo, sigue aplicando.
- **Cuidado (regla global)**: `getRandomMessage` (`Math.random()`) debe seguir llamándose DENTRO de un
  `useEffect`, no directo en el body del componente — `react-hooks/purity` lo marca igual aunque esté
  envuelto en `useMemo`. El código actual ya lo hace bien (`useCallback` + set en `useEffect`); no
  regresarlo a una llamada directa en render al reescribir el componente.

### 6.3 — Loading/error states en las 4 páginas (8.4)
- **Archivos**: `pages/aboutme/AboutMe.tsx:9`, `pages/landing/Landing.tsx` (cubierto en 6.2),
  `pages/projects/Projects.tsx:11`, `pages/certificates/Certificates.tsx:83`
- **Problema**: ninguna extrae `isLoading`/`error` de `useResumeData()`.
- **Fix**: extraer y renderizar. Como se repite en 3 páginas (AboutMe, Projects, Certificates) →
  extraer a componente reutilizable en vez de copiar el mismo if/else 3 veces (regla DRY del proyecto:
  3+ repeticiones = helper). Sugerido: `src/components/atoms/page-state/PageState.tsx` con
  `{ isLoading, error, onRetry, children }` — loading → spinner (ver 6.4), error → mensaje + botón retry
  que llame `refetch`.

### 6.4 — Sin loading state visual reutilizable
- **Problema**: no existe ningún `Spinner`/skeleton en el proyecto (`grep -rli "spinner\|skeleton" src`
  no devuelve nada). Cada punto de loading (Landing, PageState de 6.3, Suspense fallback de 6.6) necesita
  el mismo indicador — no crear 3 versiones distintas.
- **Fix**: `src/components/atoms/spinner/Spinner.tsx`. Ya hay `lucide-react` como dependencia — usar
  `Loader2` con `animate-spin`, no traer librería nueva para esto. `role="status" aria-live="polite"`
  para no romper 8.8 (a11y) al agregarlo.

---

## 🟡 Altos

### 6.5 — Retry logic (8.9)
Cubierto por 6.1 (`retry: 1, retryDelay: 3000` en `useQuery`) — no requiere código propio de
backoff. Verificar en devtools de React Query que el retry efectivamente ocurre a los 3s ante un
502/timeout simulado.

### 6.6 — Lazy loading de páginas (8.11)
- **Archivo**: `src/App.tsx:20-27` (import) y `:40-59` (`componentByRoute`)
- **Problema**: las páginas se importan desde el barrel `src/components/pages/index.ts`, que a su vez
  importa TODAS las páginas de forma estática (`import AboutMe from "./aboutme/AboutMe"` etc.). Si se
  hace `React.lazy()` sobre el barrel, Vite igual empaqueta todo en un solo chunk — no separa nada.
- **Fix**: `React.lazy()` apuntando al módulo de cada página directamente
  (`lazy(() => import("./components/pages/aboutme/AboutMe"))`), NO al barrel. Landing (`/`) se queda
  eager — es la ruta inicial, no hay nada que ganar lazyloadeándola. Envolver el `element` no-landing en
  `renderRoute` (`App.tsx:69-87`) con `<Suspense fallback={<Spinner />}>`.

### 6.7 — Timeout en fetch (8.12)
Cubierto por 6.1 (`AbortSignal.timeout(8000)` en `queryFn`). Sin trabajo adicional.

### 6.8 — Landing colgada si backend no responde (8.13)
Cubierto por 6.2 + 6.1: con `isLoading`/`error` reales y retry con backoff, este item deja de ser un
caso separado — era síntoma del timer falso, no un bug aparte.

### 6.9 — Error Boundary (8.6)
- **Problema**: 0 `ErrorBoundary` en el proyecto. Un error de render no capturado rompe toda la app.
- **Fix**: el proyecto YA tiene `@sentry/react` instalado (`src/instrument.ts`) — usar
  `Sentry.ErrorBoundary` (viene incluido en el paquete, no hay que escribir una clase propia) envolviendo
  `<App />` en `main.tsx`, con `fallback` renderizando mensaje + botón recargar. Evita duplicar lo que
  Sentry ya resuelve y de paso reporta el error capturado.

---

## Checklist de verificación post-fix

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
npx tsc -b --noEmit
npm run build
npm test
```

Manual: throttlear red (DevTools → Slow 3G), entrar a `/` y confirmar que la barra de progreso refleja
el fetch real (no un timer fijo), que un fallo de red muestra error + reintentar, y que las páginas
AboutMe/Projects/Certificates muestran loading real si se navega directo a ellas (sin pasar por Landing).

## Referencia

Fuente de la decisión de stack: sesión `/work:resume:new-concept` 2026-07-15. Wishlist cruzado —
`[norte]` Core Web Vitals, Code splitting, Bundle analysis, a11y WCAG, Cypress E2E (ya asignados como
wishlist de proyecto en `resume.json`). `[gap]` inbox sin triage: Resilience patterns, manejo de
estados/errores en la interfaz. `[research]` `docs/backlog/ideas nuevas fases.txt`.

## Pendiente para después (no bloquea esta fase)

TanStack Query es `[research]` — no está hoy en `wishlist`/`wishlistInbox` de `resume.json`. Una vez
implementada esta fase, agregarla al `wishlist` del proyecto `fmarcosdev.app.web` en
`fmarcosdev.api.resume/resume.json` (vía `/work:resume:sync`, no a mano) para que quede registrada como
crecimiento intencional. Mencionado por vos en la idea original ("agregar luego al resumen") — se deja
para el flujo de sync, no para esta fase de código.
