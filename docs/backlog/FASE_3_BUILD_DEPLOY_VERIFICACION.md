# FASE 3: Verificacion de Build y Deploy Pipeline

**Status**: PENDIENTE
**Prioridad**: Alta
**Dependencias**: FASE_0, FASE_1

Verificar que el fix del build script (`||` → `&&`) funciona end-to-end: local, GitHub Actions y Vercel.

## Tareas

### Tarea 3.1: Verificar build local

- Que hacer:
  - Ejecutar `npm run build` en branch `development`
  - Confirmar que genera `dist/` correctamente
  - Ejecutar `npm run review` para verificar que preview funciona

### Tarea 3.2: Verificar GitHub Actions workflow

- Archivo: `.github/workflows/` (revisar, NO modificar salvo que falle)
- Que hacer:
  - Leer el workflow que se activa en push a `development`
  - Verificar que el workflow usa `npm run build` (y no un build command custom)
  - Confirmar que el workflow sincroniza `development` → `main` correctamente
  - Si el workflow tiene un build command diferente al de `package.json`, alinearlo

### Tarea 3.3: Verificar config de Vercel

- Archivo: `vercel.json` (revisar)
- Que hacer:
  - Verificar que `outputDirectory` apunta a `dist`
  - Verificar que el build command en Vercel settings usa `npm run build` del package.json
  - Si Vercel tiene un override del build command, documentarlo

### Tarea 3.4: Push y validar deploy

- Que hacer:
  - Push a `development`
  - Esperar que GitHub Actions ejecute el workflow
  - Verificar que el commit automatico llega a `main`
  - Verificar que Vercel deploya exitosamente desde `main`
  - Confirmar que https://fmarcos.dev muestra el sitio correctamente

## Criterios de Aceptacion

- [ ] `npm run build` local genera `dist/` sin errores
- [ ] GitHub Actions workflow pasa en verde
- [ ] Vercel deploy status: READY
- [ ] https://fmarcos.dev carga correctamente
