# FASE 1: Cleanup de Imports y Variables No Usados

**Status**: PENDIENTE
**Prioridad**: Media
**Dependencias**: FASE_0

Errores TS6133 (declared but never read). Si `noUnusedLocals` o `noUnusedParameters` estan activos en tsconfig, estos tambien bloquean `tsc -b`.

## Tareas

### Tarea 1.1: NavigationFooter.tsx — imports y destructuring no usados

- Archivo: `src/components/organisms/footer/NavigationFooter.tsx` (modificar)
- Que hacer:
  - Linea 4: Eliminar `HOME_PAGE` del import (no se usa)
  - Linea 86: Eliminar `label` del destructuring en el `.map()` (no se usa)

### Tarea 1.2: footer.tsx — prop no usada

- Archivo: `src/components/organisms/footer/footer.tsx` (modificar)
- Que hacer:
  - Linea 171: `showContactInfo` esta en la interface `FooterAreaProps` pero el componente usa `Omit<>` para excluirlo
  - Eliminar `showContactInfo` de la interface si no se usa en ningun otro lugar

### Tarea 1.3: ContactInfoList.tsx — variable no usada

- Archivo: `src/components/organisms/header/ContactInfoList.tsx` (modificar)
- Que hacer:
  - Linea 48: `url` destructurado pero no leido en ese scope
  - Verificar si realmente no se usa (puede ser un falso positivo del line number del build log)
  - Si no se usa: eliminar del destructuring

### Tarea 1.4: Header.tsx — imports no usados

- Archivo: `src/components/organisms/header/Header.tsx` (modificar)
- Que hacer:
  - Linea 5: Eliminar import de `useMediaQuery` (no se usa)
  - Linea 9: Eliminar import de `HeaderAreaProps` (no se usa)

### Tarea 1.5: HelicoidalCards.tsx — variables no usadas

- Archivo: `src/components/organisms/blog/HelicoidalCards.tsx` (modificar)
- Que hacer:
  - Linea 219: `blur` declarado pero no leido — verificar si se usa en el return. Si no, eliminar
  - Linea 225: `brightness` declarado pero no leido — misma verificacion
  - Nota: En FASE_0 ya se toca este archivo. Coordinar para hacer ambos fixes juntos

## Criterios de Aceptacion

- [ ] `npx tsc -b --noEmit` no muestra errores TS6133
- [ ] No quedan imports ni variables sin usar en los 5 archivos
- [ ] No se elimino codigo que si se usaba (verificar con `npm run dev`)
