# FASE 2: Cleanup de CSS Variables No Usadas

**Status**: ✅ COMPLETADO
**Prioridad**: Baja
**Dependencias**: Ninguna (independiente de FASE_0 y FASE_1)

El script `check-css-vars` reporta 23 CSS variables definidas pero no usadas. Solo 5 de 28 se usan activamente. No bloquea el build (es warning), pero es deuda tecnica.

## Tareas

### Tarea 2.1: Auditar CSS variables

- Archivo: archivo CSS principal donde se definen las variables (probablemente `src/index.css` o similar)
- Que hacer:
  - Verificar que las 23 variables realmente no se usan (ni en CSS, ni en JS via `getComputedStyle`, ni en componentes inline)
  - Listar cuales son seguras de eliminar
- Variables reportadas como no usadas:
  - `--color-just-white`, `--color-text-secondary`, `--color-card-background`
  - `--color-separator`, `--color-highlight-yellow`, `--color-skill-tag`
  - `--color-progress-light`, `--color-footer-dark`, `--color-section-cream`
  - `--font-family-mono`
  - `--spacing-card-padding`, `--spacing-section-gap`, `--spacing-component-gap`, `--spacing-section-margin`
  - `--radius-button`, `--radius-card`, `--radius-section`
  - `--shadow-card-light`, `--shadow-card-hover`, `--shadow-modal`
  - `--transition-button`, `--transition-card`, `--transition-page`

### Tarea 2.2: Eliminar variables no usadas

- Archivo: mismo archivo CSS de tarea 2.1 (modificar)
- Que hacer:
  - Eliminar las variables confirmadas como no usadas en tarea 2.1
  - Si alguna se usa via JS o en un contexto no detectado por el script, mantenerla

### Tarea 2.3: Verificar script check-css-vars

- Archivo: `scripts/check-css-vars.js` (revisar)
- Que hacer:
  - Verificar que el script busca usos en archivos `.tsx`, `.ts`, `.css` y no solo en `.css`
  - Si el script tiene falsos positivos por no buscar en JSX inline styles, corregirlo

## Criterios de Aceptacion

- [ ] `npm run check-css-vars` reporta 0 variables no usadas (o solo las intencionalmente reservadas)
- [ ] No se rompe ningun estilo visual del sitio
