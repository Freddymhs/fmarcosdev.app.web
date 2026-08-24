# FASE 11 — Suspense-mode data fetching (useSuspenseQuery)

> Detectado 2026-07-16, vía `/work:resume:new-concept`. Depende de FASE 6 ya implementada
> (TanStack Query + Spinner + Suspense de rutas + Sentry ErrorBoundary). FASE 6.9 dejó anotado
> explícitamente: *"No agregar Suspense-mode de TanStack Query (`useSuspenseQuery`) en esta
> fase... si más adelante se migra a Suspense-mode, que sea decisión aparte."* — esta es esa
> decisión aparte.

## Contexto — por qué importa

FASE 6 deja `useResumeData` sobre `useQuery` clásico: cada página extrae `isLoading`/`error` a
mano y los renderiza vía `PageState.tsx` (6.3). Funciona, pero es el patrón "moderado" — el dato
real de por qué esta fase existe es que **Suspense para data-fetching es el modelo mental que
React 19 empuja como default** (mismo patrón que RSC/Next App Router usan por debajo, aunque este
proyecto sea CSR puro y no tenga runtime de servidor). Practicarlo acá, aunque sea en un portfolio
CSR, es la forma de tener el patrón en el cuerpo para una entrevista sin haber tocado Next.js
todavía.

No es una fase independiente de FASE 6 — es su continuación directa una vez esa esté cerrada.

## Decisión de stack tomada

**1. Alcance: migración completa.** Los 4 hooks de página (`useResumeData` y cualquier query
puntual futura) pasan de `useQuery` a `useSuspenseQuery`. Se retira `PageState.tsx` (creado en
6.3) — ya no hay `isLoading`/`error` que chequear a mano, el `<Suspense>` de ruta (6.6) atrapa la
espera y el error boundary (ver punto 2) atrapa el fallo.

Alternativa descartada: migración híbrida (solo `useResumeData` a Suspense-mode, queries futuras
en `useQuery` normal). Se descartó por dejar 2 patrones de loading conviviendo en la misma app sin
necesidad real — el proyecto solo tiene un hook de datos hoy.

**2. Error handling: `QueryErrorResetBoundary` anidado + botón "Reintentar" por página**, no el
Sentry `ErrorBoundary` global de 6.9 reutilizado tal cual. `useSuspenseQuery` lanza el error como
excepción — un Error Boundary genérico lo atrapa, pero sin `reset()` conectado a un refetch, el
usuario solo puede recargar la página entera (regresión respecto al botón "Reintentar" que 6.2 ya
construyó).

Alternativa descartada: reusar el Sentry `ErrorBoundary` global sin capa intermedia. Más simple,
cero código nuevo, pero pierde la UX de retry inline y — más importante para la narrativa de
entrevista — es exactamente el patrón que `[gap]` "Resilience patterns (Retry...)" y "manejar de
forma limpia los estados y errores en la interfaz" (`wishlistInbox`, sin triage) piden demostrar.
Perder el retry acá sería mostrar MENOS manejo de errores que antes de migrar.

**3. Boundary placement: un solo `<Suspense>` compartido**, el mismo de ruta que 6.6 ya envuelve
alrededor de cada `lazy()`. No se agrega un `<Suspense>` interno separado solo para el dato.

Alternativa descartada: `<Suspense>` anidado (uno externo para el chunk de código, uno interno
para el dato). Permitiría fallbacks distintos por etapa, pero hoy usan el MISMO `Spinner` (6.4 ya
estableció "un solo indicador, no 3 versiones") — la separación no compra nada real todavía y es
estructura extra en las 4 páginas. Si en el futuro se necesita un fallback distinto por etapa, se
separa entonces.

Riesgo de gold-plating: bajo — las 3 decisiones son extensión directa de lo que FASE 6 ya dejó
armado (mismo Spinner, mismo Suspense de ruta, mismo hook), no una reescritura paralela.

---

## 🔴 Críticos (la migración en sí)

### 11.0 — `useResumeData` de `useQuery` a `useSuspenseQuery`
- **Archivo**: `src/hooks/useResumeData.ts` (post-FASE 6, hoy todavía en `useState`/`useEffect`
  crudo — líneas exactas se confirman una vez 6.1 esté implementada).
- **Problema**: `useSuspenseQuery` no devuelve `isLoading`/`error` — el componente que lo llama
  suspende hasta tener el dato, o lanza la excepción hacia el Error Boundary más cercano.
- **Fix**: cambiar `useQuery` → `useSuspenseQuery` en el hook. Mantener `queryKey: ["resume"]`,
  `retry`/`retryDelay`/`AbortSignal.timeout` tal cual 6.1 los dejó — solo cambia el tipo de query,
  no la config de red. El retorno deja de incluir `isLoading`/`error`; los consumidores que
  todavía los desestructuren rompen en build (esperado — son los que hay que tocar en 11.1).

### 11.1 — Retirar `PageState.tsx` de los 4 consumidores
- **Archivos**: `AboutMe.tsx`, `Projects.tsx`, `Certificates.tsx` (y `Landing.tsx` si sigue
  usando el hook tras 6.2).
- **Problema**: cada uno envuelve su contenido en `<PageState isLoading={...} error={...}>`
  (6.3). Con Suspense-mode ese chequeo ya no existe — `PageState` queda sin uso.
- **Fix**: quitar el wrapper `<PageState>` de las 4 páginas, dejar el JSX de contenido directo.
  Borrar `src/components/atoms/page-state/PageState.tsx` una vez confirmado que ningún otro
  consumidor lo usa (`grep -rn "PageState" src`).

### 11.2 — `QueryErrorResetBoundary` + botón "Reintentar"
- **Archivo nuevo**: `src/components/atoms/query-error-boundary/QueryErrorBoundary.tsx`.
- **Fix**: componente que envuelve `<QueryErrorResetBoundary>` (de `@tanstack/react-query`) +
  un Error Boundary propio (clase o `react-error-boundary` si se prefiere no escribir la clase a
  mano) con `fallbackRender` mostrando mensaje de error + botón "Reintentar" que llama
  `resetErrorBoundary()` (conectado al `reset()` de `QueryErrorResetBoundary`, que a su vez
  reintenta la query suspendida). Un solo componente, reusado en las 4 rutas — mismo principio DRY
  que el `Spinner` de 6.4.

### 11.3 — Envolver las rutas con `QueryErrorBoundary` dentro del `<Suspense>` de 6.6
- **Archivo**: `src/App.tsx`, función `renderRoute` (hoy `:69-87` en la versión pre-FASE-6).
- **Fix**: `<QueryErrorBoundary><Suspense fallback={<Spinner />}>{element}</Suspense></QueryErrorBoundary>`
  — el error boundary va AFUERA del Suspense (si fuera adentro, un throw durante la suspensión no
  tiene boundary que lo atrape antes de llegar ahí). Confirma la decisión 3: sigue siendo el mismo
  `<Suspense>` de ruta, no uno nuevo.

---

## Checklist de verificación post-fix

```bash
npx tsc -b --noEmit
npm run build
npm test
```

Manual: throttlear red (DevTools → Slow 3G) y confirmar que las 4 rutas muestran el mismo Spinner
de siempre mientras suspende. Simular un 500/timeout en el endpoint del resume y confirmar que
aparece el botón "Reintentar" (no la pantalla de error global de Sentry) y que reintentar sí
vuelve a disparar la query. Confirmar que `PageState.tsx` ya no tiene imports activos antes de
borrarlo.

## Referencia

Fuente de la decisión: sesión `/work:resume:new-concept` 2026-07-16. `[gap]` Resilience patterns
(Retry), manejo limpio de estados/errores en la interfaz (`wishlistInbox`, sin triage). `[feature]`
`useSuspenseQuery`, `QueryErrorResetBoundary` — continuación directa de la decisión de TanStack
Query que FASE 6 ya tomó, sin señal de wishlist propia hasta ahora.

## Pendiente para después (ya resuelto, no repetir)

A diferencia de FASE 6/10 (que dejan esto pendiente), acá `TanStack Query` y `React Suspense
(data-fetching)` ya se agregaron al `wishlist` de `fmarcosdev.app.web` en
`fmarcosdev.api.resume/resume.json` — por confirmación explícita de Freddy en la misma sesión que
generó este doc, no por el flujo normal de `/work:resume:sync`. No volver a proponerlo.
