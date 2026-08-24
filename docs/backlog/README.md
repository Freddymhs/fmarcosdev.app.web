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
| 5 | [HelicalScrollCards → npm](./FASE_5_helical-scroll-cards-npm-guide.md) | ✅ | Media | 1 |
| 6 | [Loading UX real (matar timer falso)](./FASE_6_LOADING_UX_REAL.md) | PENDIENTE | Alta | 10 |
| 7 | [UI components → @fmarcosdev/ui-core](./FASE_7_UI_CORE_LIBRARY.md) | PENDIENTE | Media | 5 |
| 8 | [UX Polish & Frontend Quality](./FASE_8_UX_POLISH_SEMI_SENIOR.md) | PENDIENTE | Alta | 14 |
| 9 | [Accesibilidad WCAG 2.1 / ARIA](./FASE_9_ACCESIBILIDAD_WCAG.md) | PENDIENTE | Alta | 9 |
| 10 | [Performance & Core Web Vitals](./FASE_10_PERFORMANCE_CORE_WEB_VITALS.md) | PENDIENTE | Alta | 10 |
| 11 | [Suspense-mode data fetching](./FASE_11_SUSPENSE_MODE_DATA_FETCHING.md) | PENDIENTE | Media | 4 |
| 12 | [Título de carrera visible en CV.pdf](./FASE_12_TITULO_CARRERA_CV_PDF.md) | PENDIENTE | Alta | 5 |

## Dependencias

```
FASE_0 (criticos) ──┐
                     ├──→ FASE_3 (verificar build/deploy) ──→ FASE_4 (deps deprecadas)
FASE_1 (cleanup) ───┘
                         FASE_2 (CSS vars) ← independiente, se puede hacer en paralelo

# FASE 12 corre el script `simulate-worflow-generate-docs`; conviene haber pasado
# FASE 3 (build/deploy verification) antes para detectar errores de TS/CI temprano.
```

## Verificacion final

```bash
npx tsc -b --noEmit   # 0 errores
npm run build          # genera dist/
npm run check-css-vars # 0 warnings (post FASE_2)
```

# FASE 12 (post-fix) — título de carrera visible en CV.pdf:
# pdftotext src/generate-resume-files-by-workflow/cv.pdf - | grep -E "Fullstack|Optimización"

## Decisiones Tecnicas

Carpeta `../decisions/` — documentar aqui decisiones arquitectonicas cuando surjan durante el desarrollo.
Formato: `DECISION_[TEMA].md` — explica el POR QUE, no el QUE.
