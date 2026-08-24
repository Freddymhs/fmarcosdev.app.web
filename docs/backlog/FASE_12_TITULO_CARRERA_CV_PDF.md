# FASE 12 — Título técnico visible en CV.pdf

> Detectado 2026-07-27, vía `/work:resume:new-concept`. Sin dependencias duras de
> fases previas. Conviene ejecutar después de FASE 3 (build/deploy verification) para
> confirmar que el script local `simulate-worflow-generate-docs` corre limpio.

## Contexto — por qué importa

El campo técnico de carrera vive en `basics.label` del JSON
(`fmarcosdev.api.resume/resume.json:55`). El theme ya lo renderiza en HTML
(`jsonresume-theme-dev-ats-es/views/basics.hbs:4-6`). El PDF se genera **en CI
de app.web** (`curl /api/resume` → `resume export` → `wkhtmltopdf` → `pandoc`) y
se commitea estático. El último commit del PDF es 2026-06-10; la edición del JSON
es de julio. Tres causas posibles para que el PDF descargado no muestre el título:

1. Artefacto stale (CI no disparó desde el push).
2. `publications[0].title` descartado por theme (no hay `publications.hbs`).
3. Campo nuevo `basics.title` agregado por error — no existe en JSON Resume
   schema 1.0.0 ni en el theme.

El feature se shippea hoy sin tocar código nuevo si el problema es (1) o (3).
Solo la rama (2) exige archivos nuevos en el theme.

## Decisión de stack tomada

**1. Campo a renderizar = `basics.label`** (no `basics.title` ni `headline`).
Fuente: `[feature]` — JSON Resume schema 1.0.0 lo define así; el type
`fmarcosdev.app.web/src/types/resume.ts:55-70` ya lo tipa. Crear un `basics.title`
nuevo sería romper el contrato. Si lo que ves en el JSON es `publications[0].title`,
esa es una cadena distinta a la carrera — cubre la decisión 2.

**2. Renderizar `publications`** vía nueva `views/publications.hbs` + `{{> publications }}`
agregado en `resume.hbs` después de awards. Fuente: `[feature]`. Sin publicaciones hoy,
el theme pierde el campo silenciosamente. Si se descarta esta necesidad, no se crea
el archivo.

**3. Pin del theme a `1.0.7`** en `package.json` script y workflow CI. Fuente: `[feature]` —
el paquete `jsonresume-theme-dev-ats-es@latest` está unpublished desde 2026-07-25;
`npm install …@latest` rompe CI hoy. Pin evita la rotura. Republicar `1.0.8` es
trabajo separado, fuera de F1.

Riesgo de gold-plating: bajo. Solo una de las 3 ramas exige código nuevo en el theme;
las otras dos son operativa (regen + pin).

---

## 🔴 Críticos (el fix en sí)

### 12.0 — Diagnosticar qué campo falta
- **Archivo**: consola, ningún cambio.
- **Comando**:
  ```bash
  jq '.basics | {name, label, title}' ../fmarcosdev.api.resume/resume.json
  jq '.publications[0].title // empty' ../fmarcosdev.api.resume/resume.json
  ```
- **Decisión**:
  - Si `basics.label` tiene el texto esperado → problema = stale, ir a 12.1.
  - Si falta y existe `publications[0].title` → problema = theme, ir a 12.2.
  - Si existe un `basics.title` que vos agregaste → renombrar, ir a 12.3.

### 12.1 — Pin theme a `1.0.7` + regen local
- **Archivos**:
  - `package.json:11` — reemplazar `jsonresume-theme-dev-ats-es@latest` → `@1.0.7`.
  - `.github/workflows/generate-resume.yml:52` — mismo reemplazo.
- **Comando**:
  ```bash
  npm install jsonresume-theme-dev-ats-es@1.0.7
  npm run simulate-worflow-generate-docs
  ```
- **Verificación**: `pdftotext src/generate-resume-files-by-workflow/cv.pdf -` debe
  contener la cadena de `basics.label`. Si OK → commit + push a main de app.web;
  el workflow regenera y commitea el `cv.pdf` nuevo.

### 12.2 — Rama publications: crear partial + incluir en layout
- **Archivos**:
  - Crear `jsonresume-theme-dev-ats-es/views/publications.hbs`:
    ```hbs
    {{#each resume.publications}}
    <section class="item">
      {{#if title}}<h2>{{title}}</h2>{{/if}}
      {{#if publisher}}<em>{{publisher}}</em>{{/if}}
      {{#if date}}<span class="date">{{date}}</span>{{/if}}
      {{#if url}}<div>{{{wrapURL url}}}</div>{{/if}}
    </section>
    {{/each}}
    ```
  - `jsonresume-theme-dev-ats-es/resume.hbs` línea 43 (después de awards):
    ```hbs
    <div class="section">{{> publications }}</div>
    ```
  - `fmarcosdev.app.web/src/types/resume.ts:95-104` — agregar a `Resume`:
    ```ts
    publications?: Array<{
      title?: string;
      publisher?: string;
      url?: string;
      date?: string;
    }>;
    ```
- **Después**: regen local (mismo comando de 12.1).

### 12.3 — Rama basics.title → basics.label
- **Archivo**: `fmarcosdev.api.resume/resume.json`.
- **Fix**: renombrar el campo `basics.title` → `basics.label`. Theme y type ya esperan `label`.
- **Después**: regen local (12.1).

### 12.4 — Eliminar el archivo de spec previo
- Solo si quedó algún `feat-titulo-en-cv-pdf.md` o `FASE_titulo-carrera-cv-pdf.md`
  suelto en la raíz de `fmarcos` — es el doc de ideación que esta fase reemplaza.
- **Comando**: `ls /home/fmarcosdev/Volumes/Extended/github/PRODUCTION/fmarcos/feat-titulo-en-cv-pdf.md 2>/dev/null && rm "$_"`

---

## Checklist de verificación post-fix

```bash
# A. JSON intacto
jq '.basics.label, .publications[0].title // empty' \
  ../fmarcosdev.api.resume/resume.json

# B. HTML regenerado contiene las cadenas esperadas
grep -E "Fullstack|Optimización" \
  src/generate-resume-files-by-workflow/cv.html

# C. PDF extraído contiene las cadenas esperadas
pdftotext src/generate-resume-files-by-workflow/cv.pdf - | \
  grep -E "Fullstack|Optimización"

# D. Timestamp del PDF posterior al JSON
stat -c '%y' src/generate-resume-files-by-workflow/cv.pdf
stat -c '%y' ../fmarcosdev.api.resume/resume.json
```

## Referencia

Origen: `/work:resume:new-concept` ejecutado 2026-07-27 sobre la feature spec
provisional `feat-titulo-en-cv-pdf.md` (mismo dir raíz). Sin techs nuevas en
ningún norte ni gap; rama publications es la única que exige código nuevo y se
limita a 1 partial + 1 include + 1 type. Sin tracking de Reminders necesario al
cerrar — la tarea es operacional, no de práctica.
