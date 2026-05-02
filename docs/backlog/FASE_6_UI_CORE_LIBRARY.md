# FASE 6: Extraer componentes a @fmarcosdev/ui-core

**Status**: PENDIENTE
**Prioridad**: Media
**Objetivo**: Construir una biblioteca de componentes propia bajo `@fmarcosdev/ui-core`,
extrayendo los componentes genéricos del proyecto web.

---

## Análisis de candidatos

### ✅ Listos para mover (sin deps del proyecto)

| Componente | Ruta actual | Deps externas | Bloqueante |
|---|---|---|---|
| `IconButton` | `atoms/button/IconButton.tsx` | ninguna | ninguno |
| `MoreItemsTooltip` | `atoms/tooltip/MoreItemsTooltip.tsx` | `tailwind-variants` | ninguno |

### ⚠️ Requieren abstracción previa (usan colores/tokens del proyecto)

| Componente | Problema | Solución |
|---|---|---|
| `ProgressBar` | Usa `var(--color-text-primary)` hardcoded | Recibir `color` como prop |
| `FeaturePill` | Usa `bg-read-color text-white-area-color` (tokens locales) | Recibir `className` o `variant` |
| `TechPill` | Importa `TECH_STACK_COLORS` del proyecto | Recibir `colorMap` como prop |
| `ScrollToTopButton` | Importa `SCROLL_CONFIG` del proyecto | Recibir `threshold` como prop |

### ❌ No mover (demasiado acoplados al proyecto)

| Componente | Razón |
|---|---|
| `SEOHead` | Lógica específica de este sitio |
| `LayoutDebugPanel` | Dev tool interna |
| `Particles` | Visual específico del portfolio |
| `Card` (ProjectCard) | Importa tipo `Project` del proyecto |
| `HolographicCard`, `CarouselArrow` | Parte del carousel del portfolio |
| `FeaturePillGroup`, `TechPillGroup` | Dependen de pills con tokens locales |

---

## Tareas

### Tarea 6.1: Mover IconButton y MoreItemsTooltip (sin cambios)

- Igual que HelicalScrollCards — copiar tal cual, publicar
- Archivos: `atoms/button/IconButton.tsx`, `atoms/tooltip/MoreItemsTooltip.tsx`
- Actualizar barrel `src/index.ts` de `ui-core` con los nuevos exports
- En `app.web`: reemplazar imports locales por `@fmarcosdev/ui-core`
- Dependencias a agregar en `ui-core`: `tailwind-variants` (peerDep o dep directa)

### Tarea 6.2: Abstraer y mover ProgressBar

- Agregar prop `color?: string` para reemplazar el CSS var hardcodeado
- Publicar en `ui-core`
- Actualizar consumer en `app.web` pasando el color del proyecto

### Tarea 6.3: Abstraer y mover FeaturePill y TechPill

- `FeaturePill`: reemplazar tokens locales por props `className` o `variant`
- `TechPill`: recibir `colorMap: Record<string, string>` como prop en lugar de importar `TECH_STACK_COLORS`
- Publicar en `ui-core`
- Actualizar consumers en `app.web`

### Tarea 6.4: Abstraer y mover ScrollToTopButton

- Recibir `threshold?: number` como prop en lugar de `SCROLL_CONFIG`
- Requiere `lucide-react` como peerDep en `ui-core`
- Publicar en `ui-core`

### Tarea 6.5: Bump de versión y publish de ui-core

- Cada tarea de abstracción = nuevo minor en `ui-core` (0.2.0, 0.3.0, etc.)
- Verificar que `app.web` construye tras cada update

---

## Criterios de Aceptación

- [ ] `@fmarcosdev/ui-core` contiene al menos `IconButton`, `MoreItemsTooltip`, `ProgressBar`, `FeaturePill`, `TechPill`, `ScrollToTopButton`
- [ ] Ningún componente movido importa nada de `app.web`
- [ ] `npm run build` en `app.web` pasa sin errores tras cada migración
- [ ] Los componentes abstraídos funcionan igual visualmente (sin regresión de estilos)

---

## Nota arquitectónica

`tailwind-variants` es la única dependencia no-React de estos componentes.
Decisión: moverla a `peerDependencies` en `ui-core` — el consumer (app.web) ya la tiene instalada.
