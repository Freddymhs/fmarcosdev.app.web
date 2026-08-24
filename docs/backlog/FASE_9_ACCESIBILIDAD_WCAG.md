# FASE 9 — Accesibilidad WCAG 2.1 / ARIA

> Detectado 2026-07-15. Consolida 8.8 (elementos clickeables sin role) y cierra el resto del gap
> de accesibilidad formal que quedó "opcional-sin-prioridad" en una entrevista real reciente.

## Contexto — por qué importa

El proyecto tiene accesibilidad parcial y accidental: hay algunos `aria-label` sueltos
(`ScrollToTopButton`, `Sidebar`, `ContactInfoList`) y un bloque `prefers-reduced-motion` en
`index.css`, pero no hay auditoría formal ni gate en CI. FASE 8.8 ya había marcado 3 divs
clickeables sin `role`, pero nunca se cerró.

Este portfolio es, en palabras de Freddy, "muy importante" — quiere practicar WCAG acá de verdad,
no solo tenerlo anotado como deseo. Dos señales lo confirman:

- **`[norte]`**: `a11y (WCAG 2.1, ARIA)` está en el `wishlist` de este proyecto en `resume.json`.
- **`[gap]`**: en `interview-gaps.yaml`, slug `apiux-frontend-2026-07` (2026-07-01), el
  `stack_pedido` incluye `UX-UI-accesibilidad-responsive` y `tecnica_md_preguntas` incluye
  `P6-UXUI-accesibilidad`. El insight de esa sesión dice literalmente: *"Accesibilidad formal WCAG
  queda como opcional-sin-prioridad-dias"* — un posting real la pidió y quedó sin drillear.

## Decisión de stack tomada

**Testing: `cypress-axe` como gate en CI + `@axe-core/react` en dev (runtime, no gate).**

Alternativas descartadas:
- `vitest-axe` solo: jsdom no renderiza layout real — contraste de color, orden de foco y
  solapamiento visual no son fiables sin un browser real.
- `@axe-core/react` solo: da feedback en consola durante desarrollo pero no bloquea nada en CI —
  sin gate, la regresión vuelve a colarse.

Por qué esta combinación: el proyecto ya tiene Cypress instalado (`[norte]` Cypress E2E, ya
wishlist de este proyecto) — `cypress-axe` corre axe-core sobre un browser real dentro de los
tests E2E existentes, sin sumar infraestructura nueva. `@axe-core/react` da señal inmediata en
`npm run dev` sin esperar al CI.

Riesgo de gold-plating: bajo — es tooling de auditoría, no una feature nueva. El 🔴 de esta fase
son fixes concretos que NO requieren el tooling nuevo; el tooling (🟡) formaliza y previene
regresión futura, no es bloqueante para shippear el 🔴.

---

## 🔴 Críticos (quick-wins, sin tooling nuevo)

### 9.0 — `lang="en"` incorrecto sobre contenido en español
- **Archivo**: `index.html:2`
- **Problema**: `<html lang="en">` mientras todo el contenido visible es español. Viola
  WCAG 3.1.1 (Language of Page) — un lector de pantalla anuncia el idioma equivocado y aplica la
  pronunciación en inglés sobre texto en español.
- **Fix**: `<html lang="es">`.

### 9.1 — Sin skip-link "saltar al contenido"
- **Archivo**: `src/components/templates/app-layout/MainLayout.tsx:95` (header), `:115` (main),
  `:133` (footer)
- **Problema**: existen los landmarks `<header>/<main>/<footer>` pero no hay forma de saltar el
  header (nav + sidebar) con teclado antes de llegar al contenido — cada navegación por teclado
  obliga a tabular todo el header primero.
- **Fix**: agregar un link `Saltar al contenido` como primer elemento focuseable del layout
  (visualmente oculto salvo foco — patrón `sr-only focus:not-sr-only`), apuntando a
  `id="main-content"` agregado al `<main>` de la línea 115, con `tabIndex={-1}` para que el foco
  programático funcione al hacer click en el link.

### 9.2 — Elementos clickeables sin `role` (cierra 8.8)
- **Archivos**:
  - `src/components/atoms/carousel/HolographicCard.tsx:35` — div con `onClick` sin `role="button"`
  - `src/components/organisms/header/headerBlog.tsx:11` — span con `cursor-pointer`, debería ser
    `<button>`
  - `src/components/organisms/modal/modalContent.tsx:31` — overlay con `onClick` sin
    `role="button"` ni `aria-label`
- **Problema**: elementos interactivos no nativos, invisibles para tecnología asistiva y sin
  soporte de teclado (`Enter`/`Space`).
- **Fix**: donde sea posible, cambiar a `<button>` nativo (headerBlog). Donde el elemento deba
  seguir siendo `div` (overlay de modal, card del carousel), agregar `role="button"`,
  `tabIndex={0}`, `aria-label` descriptivo, y un `onKeyDown` que dispare el mismo handler en
  `Enter`/`Space`.

### 9.3 — Auditoría de `alt` text
- **Problema**: solo se detectó 1 `<img>` crudo en todo `src/`, sin `alt`. El resto del contenido
  visual pasa por componentes de Cloudinary/carousel/certificados cuyo `alt` no fue auditado
  explícitamente.
- **Fix**: recorrer cada punto de render de imagen (Cloudinary components, `HolographicCard`,
  cards de certificados en `Certificates.tsx`) y confirmar `alt` descriptivo real para imágenes de
  contenido, o `alt=""` explícito y consciente para imágenes puramente decorativas — nunca `alt`
  ausente.

### 9.4 — `prefers-reduced-motion` incompleto
- **Archivo**: `src/index.css:58-62`
- **Problema**: el media query `prefers-reduced-motion: reduce` solo cubre la view-transition de
  cambio de página. Las animaciones más pesadas —`HelicoidalCards.tsx` (`animate-pulse`,
  `transition-all duration-300`, `transform` continuo con `Math.random()` en `animationDelay`) y
  `AnimatedTimeline.tsx`— ignoran la preferencia del usuario.
- **Fix**: extender el bloque `@media (prefers-reduced-motion: reduce)` para neutralizar o reducir
  significativamente duración/easing de esas animaciones también, no solo la view-transition.

---

## 🟡 Altos (adopción de tooling)

### 9.5 — Instalar y configurar `cypress-axe`
- **Paquete**: `cypress-axe` (+ `axe-core` como peer dep).
- **Setup**: importar en `cypress/support/e2e.ts` (`injectAxe`), agregar `cy.checkA11y()` al final
  de los specs E2E existentes (`cypress/e2e/`) para cada ruta principal (`/`, `/about_me`,
  `/projects`, `/certificates`).
- **Gate en CI**: el spec debe fallar el pipeline ante cualquier violación de nivel `serious` o
  `critical` — no solo loguear.

### 9.6 — Instalar `@axe-core/react` en dev
- **Paquete**: `@axe-core/react` como devDependency.
- **Archivo**: `src/main.tsx` — inicializar condicionalmente con `import.meta.env.DEV`, reportando
  violaciones por consola. No debe pesar en el bundle de producción (import dinámico o guard de
  build).

### 9.7 — Auditoría de landmarks y jerarquía de encabezados
- **Problema**: `Sidebar.tsx:54` ya usa `<nav>` correctamente, pero no está confirmado que cada
  página tenga una jerarquía `h1`→`h6` sin saltos, ni que los landmarks (`header`/`nav`/`main`/
  `footer`) sean únicos por página cuando corresponde.
- **Fix**: recorrer las 4 páginas (`Landing`, `AboutMe`, `Projects`, `Certificates`) confirmando un
  único `h1` por página y que la jerarquía de encabezados no salte niveles.

### 9.8 — Auditoría de estados de foco visibles
- **Problema**: no está confirmado que todos los elementos interactivos (botones, links, cards con
  `tabIndex`) tengan un estado `:focus-visible` perceptible — crítico para navegación por teclado.
- **Fix**: revisar `tailwind.config.js` y los componentes interactivos, asegurando un anillo de foco
  consistente (mismo token de color en todo el proyecto, no ad-hoc por componente).

---

## Checklist de verificación post-fix

```bash
npm install -D cypress-axe axe-core
npm install @axe-core/react
npx tsc -b --noEmit
npm run build
npm run cypress
```

Manual: navegar el sitio completo solo con teclado (Tab/Shift+Tab/Enter/Space) confirmando que el
skip-link aparece primero, que el foco nunca se pierde, y que el orden de tabulación es lógico.
Verificar con un lector de pantalla (VoiceOver/NVDA) que el `lang` correcto se anuncia y que los
elementos de 9.2 son operables. Correr `cy.checkA11y()` contra las 4 rutas y confirmar 0
violaciones `serious`/`critical`.

## Referencia

Fuente de la decisión de stack: sesión `/work:resume:new-concept` 2026-07-15, decisiones
aprobadas por Freddy. `[norte]` `a11y (WCAG 2.1, ARIA)`, `Cypress (E2E)` — ambas ya asignadas como
wishlist de este proyecto en `resume.json`. `[gap]` slug `apiux-frontend-2026-07` en
`interview-gaps.yaml` — accesibilidad formal pedida en un posting real y marcada como debilidad sin
cerrar. `[feature]` `@axe-core/react` y `cypress-axe` — implícitos en "practicar WCAG de verdad en
este proyecto", sin señal de wishlist propia pero requeridos para operacionalizarlo.
