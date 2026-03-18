# FASE 4: Dependencias Deprecadas

**Status**: PENDIENTE
**Prioridad**: Baja
**Dependencias**: FASE_3 (deploy estable primero)

El build log de Vercel muestra multiples `npm warn deprecated`. No bloquean el build pero son riesgo de seguridad y compatibilidad futura.

## Tareas

### Tarea 4.1: Auditar dependencias deprecadas

- Que hacer:
  - Ejecutar `npm audit` y `npm outdated`
  - Listar paquetes deprecados criticos del build log:
    - `puppeteer@16.2.0` (< 22.8.2 no soportado)
    - `rimraf@3.0.2`
    - `glob@7.2.3`
    - `inflight@1.0.6` (memory leak)
    - `superagent@6.1.0` (vulnerabilidad publica)
    - `formidable@1.2.6`
    - `lodash.isequal`, `lodash.get` (deprecados a favor de nativos)
  - Clasificar: directas vs transitivas

### Tarea 4.2: Actualizar dependencias directas

- Archivo: `package.json` (modificar)
- Que hacer:
  - Actualizar las dependencias directas que tengan versiones deprecadas
  - Ejecutar `npm run build` despues de cada update para verificar que no rompe
  - NO actualizar transitivas manualmente (se resuelven con updates de directas)

### Tarea 4.3: Evaluar puppeteer

- Archivo: `package.json` (revisar)
- Que hacer:
  - `puppeteer@16.2.0` es una dependencia pesada. Verificar si se usa activamente
  - Si solo se usa para el workflow de CV generation, considerar moverla al workflow de GitHub Actions
  - Si no se usa: eliminar

## Criterios de Aceptacion

- [ ] `npm audit` no muestra vulnerabilidades high/critical
- [ ] `npm outdated` no muestra dependencias deprecadas directas
- [ ] Build sigue pasando despues de updates
