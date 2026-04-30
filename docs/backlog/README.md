# Backlog: Fix TypeScript Errors + Build Pipeline

## Contexto

El build script fue corregido de `||` a `&&` (`package.json` linea 10), por lo que `tsc -b` debe pasar sin errores para que `vite build` genere `dist/`. Actualmente hay ~30 errores TypeScript distribuidos en 9 archivos que bloquean el deploy a Vercel. Ademas hay 23 CSS variables sin usar y dependencias deprecadas.

## Fases

| Fase | Nombre | Status | Prioridad | Tareas |
|------|--------|--------|-----------|--------|
| 0 | [Errores criticos de tipo](./FASE_0_ERRORES_CRITICOS.md) | ✅ | Alta | 6 |
| 1 | [Cleanup imports/variables](./FASE_1_CLEANUP_UNUSED.md) | ✅ | Media | 5 |
| 2 | [CSS variables no usadas](./FASE_2_CSS_VARS_CLEANUP.md) | ✅ | Baja | 3 |
| 3 | [Verificacion build y deploy](./FASE_3_BUILD_DEPLOY_VERIFICACION.md) | ✅ | Alta | 4 |
| 4 | [Dependencias deprecadas](./FASE_4_DEPENDENCIAS_DEPRECADAS.md) | ✅ | Baja | 3 |

## Dependencias

```
FASE_0 (criticos) ──┐
                     ├──→ FASE_3 (verificar build/deploy) ──→ FASE_4 (deps deprecadas)
FASE_1 (cleanup) ───┘
                         FASE_2 (CSS vars) ← independiente, se puede hacer en paralelo
```

## Verificacion final

```bash
npx tsc -b --noEmit   # 0 errores
npm run build          # genera dist/
npm run check-css-vars # 0 warnings (post FASE_2)
```

## Decisiones Tecnicas

Carpeta `../decisions/` — documentar aqui decisiones arquitectonicas cuando surjan durante el desarrollo.
Formato: `DECISION_[TEMA].md` — explica el POR QUE, no el QUE.
