# FASE 0: Errores Criticos de Tipo

**Status**: PENDIENTE
**Prioridad**: Alta
**Dependencias**: Ninguna

Errores que representan problemas reales de tipado: propiedades duplicadas, modulos inexistentes, type mismatches, tipos implicitos `any`.

## Tareas

### Tarea 0.1: constants.ts — Propiedades duplicadas (TS1117)

- Archivo: `src/constants.ts` (modificar)
- Que hacer:
  - Lineas 466-489: Objeto `TECH_STACK_COLORS` tiene computed keys que resuelven al mismo string value
  - Identificar cuales constantes `TECH_*` tienen valores de string identicos
  - Eliminar las entradas duplicadas del objeto, dejando solo una por valor unico
- Referencia: Las constantes se definen desde ~linea 100 en el mismo archivo

### Tarea 0.2: HelicoidalCards.tsx — Modulo inexistente y tipo incompleto

- Archivo: `src/components/organisms/blog/HelicoidalCards.tsx` (modificar)
- Que hacer:
  - Linea 7: Eliminar import de `./devmode` (archivo no existe en el repo)
  - Linea 227: Verificar si `filter` falta en el return del objeto `CardPosition` — el tipo lo exige pero el return no lo incluye en algun code path
  - Linea 276: `id` no existe en tipo `CardData` — verificar `src/types/cardData.ts` y agregar `id` si falta, o corregir la destructuracion
- Referencia: `src/types/cardPosition.ts`, `src/types/cardData.ts`

### Tarea 0.3: HolographicCarousel.tsx — Tipo implicito any[]

- Archivo: `src/components/organisms/blog/HolographicCarousel.tsx` (modificar)
- Que hacer:
  - Linea 123: `groupedCards` tiene tipo implicito `any[]`
  - Tiparlo explicitamente: `const groupedCards: CardData[][] = []` o el tipo correcto segun el contexto
  - Linea 231: Mismo problema, derivado del tipo implicito de linea 123
- Referencia: Verificar que `CardData` se importe desde `src/types/cardData.ts`

### Tarea 0.4: Projects.tsx — complexity type mismatch

- Archivo: `src/components/pages/projects/Projects.tsx` (modificar)
- Que hacer:
  - Linea 33: `complexity: string` no es asignable a `"Simple" | "Medio" | "Complejo"`
  - Opcion A: Usar `as const` en la data de proyectos para que TS infiera el literal
  - Opcion B: Castear con type assertion en el punto de asignacion
  - Opcion C: Relajar el tipo `Complexity` a `string` si no se valida en runtime
- Referencia: Interface `Project` (buscar donde define `Complexity`)

### Tarea 0.5: App.tsx — string | undefined no asignable a string

- Archivo: `src/App.tsx` (modificar)
- Que hacer:
  - Linea 45: Props `project` y `study` de `DailyFocusPill` esperan `string` pero reciben `string | undefined`
  - El codigo ya tiene `|| ''` pero TS no lo infiere como string
  - Verificar si el problema esta en el tipo de retorno del hook o en las props del componente
  - Fix: Ajustar tipo de props en DailyFocusPill a `string | undefined`, o asegurar que el valor pase por `?? ''`
- Referencia: Componente `DailyFocusPill` (buscar su definicion)

### Tarea 0.6: Header.tsx — RefObject y callback type mismatches

- Archivo: `src/components/organisms/header/Header.tsx` (modificar)
- Que hacer:
  - Linea 105: `RefObject<HTMLElement | null>` no asignable a `Ref<HTMLDivElement>` — cambiar `useRef<HTMLElement>` a `useRef<HTMLDivElement>`
  - Linea 113: `(() => void) | undefined` no asignable a `() => void` — usar `onToggleSidebar ?? (() => {})` o hacer la prop opcional

## Criterios de Aceptacion

- [ ] `npx tsc -b --noEmit` no muestra errores TS1117, TS2307, TS2322, TS2339, TS2741, TS7034
- [ ] Los 6 archivos compilan sin errores de tipo
- [ ] La funcionalidad visual del sitio no cambia (solo fixes de tipado)
