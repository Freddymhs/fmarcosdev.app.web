# FASE 10 — Performance & Core Web Vitals

> Detectado 2026-07-15. Complementa FASE 6.6 (lazy loading por ruta, ya cubierto — no repetir
> aquí) con medición formal, bundle analysis y pipeline de imágenes.

## Contexto — por qué importa

El proyecto es una SPA CSR pura sin ninguna medición de performance formalizada: no hay Lighthouse
en CI, no hay bundle analysis, y el pipeline de imágenes es manual. La auditoría de esta fase
encontró dos bugs concretos ya verificados en el repo:

- **`three@0.177` (dependencia pesada, ~1MB) no se importa en ningún lado de `src/`** — confirmado
  con `grep -rn "from \"three\"\|@react-three" src` sin resultados. Es peso muerto, probablemente
  huérfano tras el `Particles` que FASE 7 marca como "no mover — visual específico del portfolio".
- **`index.html:11-41` tiene resource hints rotos**: un `<link rel="preload" as="image" href="" />`
  vacío (línea 16) y varios `preload` con el prefijo `public/certificates/...`, que en el build de
  Vite no resuelve a la ruta servida (`/certificates/...`) — son 404 silenciosos que no ayudan al
  LCP y potencialmente lo dañan (el browser reserva prioridad de red para un recurso que no carga).

Es `[norte]` puro: `Core Web Vitals`, `Lighthouse`, `next/image`, `Code splitting`, `Bundle
analysis` están en el `wishlist` de este proyecto en `resume.json` — señal de dirección elegida por
Freddy, sin gap de entrevista asociado todavía.

## Decisión de stack tomada

**Medición: `@lhci/cli` (Lighthouse CI, budgets LCP/CLS/TBT) en GitHub Actions + `web-vitals` →
Sentry para datos de campo reales.**

Alternativas descartadas:
- `unlighthouse` (auto-crawl multi-ruta): overkill — el proyecto tiene 4 rutas conocidas y fijas,
  no hace falta descubrimiento automático.
- Lighthouse manual (`npx lighthouse` ad-hoc): no deja rastro en CI, se re-ejecuta a mano cada vez,
  no previene regresión.

Por qué esta combinación: `@lhci/cli` corre en el workflow de GitHub Actions ya existente
(`.github/workflows/generate-resume.yml`) con budgets que fallan el build si LCP/CLS/TBT empeoran
— eso es `[norte]` Lighthouse operacionalizado como gate, no solo auditoría puntual. `web-vitals` →
Sentry aprovecha `@sentry/react` (ya instalado, `src/instrument.ts`) para tener datos de campo
reales de usuarios, complementando el lab-data de Lighthouse sin sumar un vendor de observabilidad
nuevo.

**Bundle analysis: `rollup-plugin-visualizer`.**

Alternativa descartada: `vite-bundle-visualizer` (ejecución `npx` puntual, no genera un artefacto
persistente en cada build de CI). `rollup-plugin-visualizer` se integra directo en
`vite.config.ts` y genera el treemap en cada `npm run build`.

**Imágenes: Cloudinary (`f_auto,q_auto` + srcset) para todo lo que ya pasa por CDN + conversión a
WebP para los PNG locales de `public/certificates/`.**

Alternativa descartada: `@unpic/react` — dependencia nueva redundante, el proyecto ya tiene
`@cloudinary/react`/`@cloudinary/url-gen` instalados y en uso; no hace falta un segundo sistema de
imágenes.

Riesgo de gold-plating: bajo si se respeta el fasing — el 🔴 son los quick-wins sin tooling nuevo
(sacar `three`, arreglar preloads, agregar `width`/`height`); el tooling de medición (🟡) y el
pipeline de imágenes/chunking (🟢) son incrementales y no bloquean el 🔴.

---

## 🔴 Críticos (quick-wins, sin tooling nuevo)

### 10.0 — Remover `three@0.177`
- **Archivo**: `package.json:48`
- **Problema**: confirmado 0 imports reales (`from "three"`, `@react-three/*`) en todo `src/`.
  Dependencia pesada (~1MB) sin uso — bundle muerto.
- **Fix**: `npm uninstall three @types/three`. Verificar build tras remover (por si algún tipo se
  referenciaba indirectamente).

### 10.1 — Preloads rotos en `index.html`
- **Archivo**: `index.html:11-41`
- **Problema**: línea 16 tiene `<link rel="preload" as="image" href="" />` (href vacío — no hace
  nada útil, ocupa presupuesto de prioridad de red). Las líneas 12-41 usan
  `href="public/certificates/..."` — Vite sirve `public/` como raíz, así que la ruta correcta en
  runtime es `/certificates/...`, no `public/certificates/...`. Hoy son 404 silenciosos.
- **Fix**: eliminar el preload vacío; corregir el prefijo de ruta en los preload restantes a
  `/certificates/...`.

### 10.2 — `width`/`height` explícitos para prevenir CLS
- **Problema**: no está confirmado que todas las imágenes (Cloudinary components, cards de
  certificados) declaren `width`/`height` (o `aspect-ratio` vía CSS) — sin esto, el layout salta
  cuando la imagen carga.
- **Fix**: auditar cada punto de render de imagen y fijar dimensiones explícitas o
  `aspect-ratio` en el contenedor.

### 10.3 — Referencia cruzada: code-splitting por ruta
- **Cubierto en FASE 6.6** (`React.lazy()` + `<Suspense>` en `App.tsx`) — no repetir aquí. Si esta
  fase se ejecuta en paralelo con FASE 6, verificar que 6.6 esté cerrado antes de dar por
  completada la sección de performance de código.

---

## 🟡 Altos (adopción de tooling de medición)

### 10.4 — Instalar y configurar `@lhci/cli`
- **Paquete**: `@lhci/cli` como devDependency.
- **Setup**: agregar job al workflow existente `.github/workflows/generate-resume.yml` (o uno
  nuevo dedicado) corriendo `lhci autorun` contra el build de `dist/`, con budgets definidos para
  LCP, CLS y TBT que fallen el pipeline si se superan.

### 10.5 — Instrumentar `web-vitals` → Sentry
- **Paquete**: `web-vitals`.
- **Archivo**: `src/main.tsx` o `src/instrument.ts` — capturar `onLCP`/`onCLS`/`onINP` y reportar
  a Sentry (`@sentry/react` ya instalado) como datos de campo reales, complementando el lab-data de
  Lighthouse CI.

### 10.6 — Instalar `rollup-plugin-visualizer`
- **Archivo**: `vite.config.ts:12-29` (bloque `plugins`)
- **Setup**: agregar el plugin generando el treemap en cada build (`stats.html`, no commiteado —
  agregar a `.gitignore` si no está). Usar el resultado para identificar candidatos a
  `manualChunks`: `highlight.js`, `react-markdown`, `react-responsive-carousel` son las
  dependencias pesadas ya identificadas en el análisis de esta fase.

---

## 🟢 Mejoras (pipeline de imágenes + chunking)

### 10.7 — Cloudinary `f_auto,q_auto` + srcset responsive
- **Problema**: no está confirmado que todos los usos de `@cloudinary/react`/`@cloudinary/url-gen`
  apliquen `f_auto,q_auto` (formato/calidad automáticos) y `srcset` responsive.
- **Fix**: auditar los componentes que consumen Cloudinary y estandarizar la transformación
  `f_auto,q_auto` + `srcset` en un helper único (evitar repetir la config de transformación en cada
  punto de uso).

### 10.8 — Convertir PNG locales de `public/certificates/` a WebP
- **Problema**: las imágenes de certificados son `.png` servidas tal cual, sin pasar por Cloudinary
  ni tener variante moderna de formato.
- **Fix**: convertir a WebP en build-time (ej. `vite-imagetools` o un script de conversión en
  `scripts/`), sirviendo `<picture>` con fallback PNG si hace falta soporte legacy.

### 10.9 — `manualChunks` en `vite.config.ts`
- **Archivo**: `vite.config.ts`
- **Problema**: sin `build.rollupOptions.output.manualChunks`, las dependencias pesadas
  (`highlight.js`, `react-markdown`, `react-responsive-carousel`) viajan en el bundle principal en
  vez de en un chunk separado descargable bajo demanda.
- **Fix**: basado en el treemap de 10.6, separar esas dependencias en chunks propios.

---

## Checklist de verificación post-fix

```bash
npm uninstall three @types/three
npm install -D @lhci/cli rollup-plugin-visualizer
npm install web-vitals
npx tsc -b --noEmit
npm run build
npx lhci autorun
```

Manual: throttlear red (DevTools → Slow 4G), medir LCP/CLS/TBT en las 4 rutas con Lighthouse local
antes/después. Confirmar en el treemap de `rollup-plugin-visualizer` que `three` desapareció del
bundle y que las dependencias pesadas quedaron en chunks separados. Confirmar que los preloads de
`index.html` ya no dan 404 en la pestaña Network.

## Referencia

Fuente de la decisión de stack: sesión `/work:resume:new-concept` 2026-07-15, decisiones aprobadas
por Freddy. `[norte]` `Core Web Vitals`, `Lighthouse`, `next/image`, `Code splitting`, `Bundle
analysis` — todas ya asignadas como wishlist de este proyecto en `resume.json`. `[feature]`
`@lhci/cli`, `web-vitals`, `rollup-plugin-visualizer` — herramientas concretas para operacionalizar
ese norte, sin señal de wishlist propia pero requeridas para medirlo de verdad en vez de solo
declararlo como intención.

## Pendiente para después (no bloquea esta fase)

`@lhci/cli`, `web-vitals` y `rollup-plugin-visualizer` son `[feature]` — no están hoy en
`wishlist`/`wishlistInbox` de `resume.json`. Una vez implementada esta fase, considerar agregar
`Lighthouse CI` y `Bundle analysis` (ya en wishlist como conceptos) con la tecnología concreta usada
al `wishlist` del proyecto vía `/work:resume:sync` (no a mano), para que quede registrado el
crecimiento intencional real, igual que se dejó pendiente en FASE 6 para TanStack Query.
