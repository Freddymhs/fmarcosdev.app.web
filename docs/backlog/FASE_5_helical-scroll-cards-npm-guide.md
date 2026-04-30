# Guía: Publicar `HelicalScrollCards` en npm

> Documento de referencia para extraer el componente `HelicalScrollCards` de `fmarcosdev.app.web`
> y publicarlo como paquete reutilizable en npm bajo el scope `@fmarcosdev`.

---

## Índice

1. [¿Qué estamos empaquetando?](#1-qué-estamos-empaquetando)
2. [Estructura del nuevo repositorio](#2-estructura-del-nuevo-repositorio)
3. [Configurar `package.json`](#3-configurar-packagejson)
4. [Configurar el bundler (tsup)](#4-configurar-el-bundler-tsup)
5. [Configurar TypeScript](#5-configurar-typescript)
6. [Limpiar el código antes de publicar](#6-limpiar-el-código-antes-de-publicar)
7. [El archivo de entrada (`index.ts`)](#7-el-archivo-de-entrada-indexts)
8. [Flujo de publicación en npm](#8-flujo-de-publicación-en-npm)
9. [Versionado semántico](#9-versionado-semántico)
10. [README del paquete](#10-readme-del-paquete)
11. [Checklist final](#11-checklist-final)

---

## 1. ¿Qué estamos empaquetando?

### El componente

`HelicalScrollCards` es un componente React + Three.js (WebGL) que renderiza tarjetas en una
estructura de hélice 3D con scroll virtualizado. Actualmente vive en:

```
src/components/organisms/blog/HelicalScrollCards.tsx  ← el componente
```

### Por qué vale la pena subirlo

| Característica      | Descripción                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| Virtualización real | Solo renderiza N slots simultáneos, sin importar cuántos items haya                |
| Paginación lazy     | Llama `onLoadMore` automáticamente al acercarse al final                           |
| Touch + wheel       | Soporte nativo para móvil y desktop                                                |
| SSR-safe            | Detecta cliente antes de montar Three.js                                           |
| Genérico TypeScript | `<T extends CardItem>` — acepta cualquier tipo de dato                             |
| Configurable        | `theme`, `config`, `cardConfig` son todos opcionales con defaults                  |
| Renderers custom    | `renderCardLabel`, `renderCardTitle`, `renderCardDate` para personalizar contenido |
| Cache de texturas   | LRU cache de 50 texturas para no re-dibujar lo que ya existe                       |

### Lo que NO incluye el paquete

Estas dependencias son del proyecto web, **no del componente**:

- `highlight.js/styles/github.css` — para syntax highlighting del blog
- `katex/dist/katex.min.css` — para fórmulas matemáticas
- Cualquier cosa de `blog.tsx` — ese es el consumer, no el componente

---

## 2. Estructura del nuevo repositorio

Crea un repo nuevo. Nombre sugerido: `helical-scroll-cards`.

```
helical-scroll-cards/
├── src/
│   ├── HelicalScrollCards.tsx   ← copia directa del componente
│   └── index.ts                 ← barrel de exports
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
└── .npmignore
```

> **No copies** `blog.tsx`, `HelicoidalCards.tsx`, ni `HolographicCarousel.tsx`.
> Solo necesitas `HelicalScrollCards.tsx`.

---

## 3. Configurar `package.json`

Este es el archivo más crítico del paquete. Copia esto y ajusta donde indica:

```json
{
  "name": "@fmarcosdev/helical-scroll-cards",
  "version": "1.0.0",
  "description": "3D helix scroll component for React with Three.js. Virtualized, paginated, touch-ready.",
  "author": "fmarcosdev",
  "license": "MIT",
  "keywords": [
    "react",
    "three.js",
    "3d",
    "helix",
    "scroll",
    "cards",
    "virtualized",
    "webgl",
    "animation"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/fmarcosdev/helical-scroll-cards"
  },
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "build:watch": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run typecheck && npm run build"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "three": ">=0.150.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": false
    }
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.177.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.177.0",
    "tsup": "^8.0.0",
    "typescript": "~5.7.0"
  }
}
```

### Por qué `peerDependencies` y no `dependencies`

```
❌ dependencies   → npm instala react y three DENTRO de tu paquete
                    el proyecto del usuario tendrá DOS versiones de three
                    → crash garantizado con WebGL context

✅ peerDependencies → npm usa el react y three que YA tiene el proyecto
                      tu paquete solo avisa "necesito estas versiones"
```

---

## 4. Configurar el bundler (tsup)

`tsup` es el estándar actual para librerías TypeScript. Es zero-config y genera
CJS + ESM + declaraciones `.d.ts` en un solo comando.

### Instalar

```bash
npm install -D tsup
```

### `tsup.config.ts`

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // CommonJS + ES Modules
  dts: true, // Genera los .d.ts (tipos)
  sourcemap: true,
  clean: true, // Limpia /dist antes de cada build
  splitting: false,
  treeshake: true,
  external: [
    // NO bundlear las peerDependencies
    "react",
    "react/jsx-runtime", // ← crítico: JSX automático genera imports a este subpath
    "react-dom",
    "three",
  ],
  esbuildOptions(options) {
    options.jsx = "automatic"; // React 17+ JSX transform
  },
});
```

### Verificar el output

Después de correr `npm run build`, deberías ver:

```
dist/
├── index.js      ← ESM (para Vite, Next.js, bundlers modernos)
├── index.cjs     ← CommonJS (para Node, Jest legacy)
├── index.d.ts    ← Tipos TypeScript
└── index.js.map  ← Sourcemap
```

---

## 5. Configurar TypeScript

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

> **Por qué no tiene `declaration`, `outDir` ni `sourceMap`:**
> tsup genera los `.d.ts` y sourcemaps él solo (via `dts: true` y `sourcemap: true`).
> Si los dejas en el tsconfig, TypeScript y tsup entran en conflicto sobre quién emite qué.
> El tsconfig de este repo es solo para el script `typecheck` (`tsc --noEmit`).

> Los flags `strict`, `noUnusedLocals` y `noUnusedParameters` te van a ayudar a
> detectar el código muerto antes de publicar.

---

## 6. Limpiar el código antes de publicar

Hay 4 cosas que **debes corregir** en `HelicalScrollCards.tsx` antes de publicar.
Son pequeñas pero afectan calidad y podrían causar warnings en proyectos de usuarios.

### 6.1 — `let` en línea 456 → usar objeto mutable

**Problema:** La regla del proyecto (y buenas prácticas) prohíbe `let`.
Además el eslint-disable-next-line es una señal de que algo está forzado.

```typescript
// ❌ Antes
// eslint-disable-next-line prefer-const
let { width, height } = updateSize();

// ✅ Después — extraer a objeto mutable
const size = updateSize(); // { width, height }
// luego si necesitas "reasignar": size.width = newWidth (el objeto es const, las props no)
```

O mejor aún, usar `updateSize()` directamente en cada lugar donde se necesita:

```typescript
// ✅ Alternativa — eliminar la variable mutable
const { width: initialWidth, height: initialHeight } = updateSize();
```

### 6.2 — `let touchStartY` en líneas 577-578 → es dead code

**Problema:** `touchStartY` se asigna pero **nunca se lee** en ningún otro lugar.
Solo `lastTouchY` es el que realmente se usa en `handleTouchMove`.

```typescript
// ❌ Antes — touchStartY nunca se lee, es dead code
let touchStartY = 0;
let lastTouchY = 0;

const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY; // ← se setea pero nunca se lee
  lastTouchY = touchStartY;
};

// ✅ Después — eliminar touchStartY, refactorizar con ref
const lastTouchYRef = { current: 0 };

const handleTouchStart = (e: TouchEvent) => {
  lastTouchYRef.current = e.touches[0].clientY;
};

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  const currentY = e.touches[0].clientY;
  const deltaY = lastTouchYRef.current - currentY;
  lastTouchYRef.current = currentY;

  if (Math.abs(deltaY) > 2) {
    handleScroll(deltaY > 0 ? 0.3 : -0.3);
  }
};
```

### 6.3 — `footerBg`/`footerText` en DEFAULT_THEME no usados en el canvas

**Problema:** Están declarados en `HelixTheme` y `DEFAULT_THEME` pero el código de
`createCardTexture` nunca los dibuja. Dos opciones:

```typescript
// Opción A — eliminarlos de la interfaz (si no planeas implementar footer)
// Borrar footerBg y footerText de HelixTheme y DEFAULT_THEME

// Opción B — documentarlos como "reservados para versión futura"
export interface HelixTheme {
  // ...campos actuales...
  /** @reserved Reservado para uso futuro. No tiene efecto visual en v1.x */
  footerBg?: string;
  /** @reserved Reservado para uso futuro. No tiene efecto visual en v1.x */
  footerText?: string;
}
```

La **Opción A** es la correcta si no lo vas a implementar ahora.
No publiques API que no funciona — confunde a los usuarios.

### 6.4 — `sceneRef` se asigna pero nunca se lee

```typescript
const sceneRef = useRef<THREE.Scene | null>(null);
// ...
sceneRef.current = scene; // se asigna
// pero scene se usa directamente, no via sceneRef.current
```

Si no necesitas `sceneRef` externamente, elimínalo. `noUnusedLocals` de TypeScript
te avisará de esto al compilar.

---

## 7. El archivo de entrada (`index.ts`)

Este archivo define qué es público (API del paquete) y qué es interno.

```typescript
// src/index.ts

// Componente principal
export { default as HelicalScrollCards } from "./HelicalScrollCards";

// Tipos públicos — exportar todos los que el usuario necesita para tipar sus props
export type {
  CardItem,
  CardConfig,
  HelixConfig,
  HelixTheme,
  HelicalScrollCardsProps,
} from "./HelicalScrollCards";

// NO exportar DEFAULT_THEME ni HELIX_DEFAULTS — son implementación interna
```

### Cómo lo usará el usuario con este export

```typescript
import { HelicalScrollCards } from "@fmarcosdev/helical-scroll-cards";
import type { CardItem, HelixTheme } from "@fmarcosdev/helical-scroll-cards";
```

---

## 8. Flujo de publicación en npm

Ya tienes cuenta en npm (tienes `@fmarcosdev/ui-core` publicado).
El flujo es idéntico.

### Primera vez: login y verificar scope

```bash
npm login
# te pedirá usuario, password y OTP si tienes 2FA activo

# Verificar que el scope @fmarcosdev está configurado
npm whoami
```

### Build y publish

```bash
# 1. Verificar tipos
npm run typecheck

# 2. Build
npm run build

# 3. Ver qué archivos incluirá el paquete (dry-run)
npm pack --dry-run

# 4. Publicar (primera vez con --access public para scopes)
npm publish --access public
```

### Para publicar como scope privado (si prefieres)

```bash
npm publish --access restricted
# requiere plan de pago en npm
```

### `.npmignore`

Crea este archivo para evitar subir archivos innecesarios:

```
src/
tsconfig.json
tsup.config.ts
*.map
node_modules/
```

> `files` en `package.json` ya restringe a `dist/`, pero `.npmignore` es la
> capa defensiva adicional.

---

## 9. Versionado semántico

Sigue semver estrictamente desde el día 1. Los usuarios dependen de esto para
saber si una actualización puede romper su código.

```
MAJOR.MINOR.PATCH
  │      │     └── Bug fix, sin cambios de API
  │      └──────── Feature nueva, sin romper API existente
  └─────────────── Cambio que rompe API (breaking change)
```

### Ejemplos aplicados a este componente

| Cambio                                         | Versión               |
| ---------------------------------------------- | --------------------- | ------- |
| Fix del dead code `touchStartY`                | `1.0.1`               |
| Nuevo prop `onCardClick`                       | `1.1.0`               |
| Cambiar `CardItem.id` de `string               | number`a solo`string` | `2.0.0` |
| Remover `footerBg`/`footerText` de la interfaz | `2.0.0`               |

### Comandos npm para versionar

```bash
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

Estos comandos actualizan `package.json` y crean un git tag automáticamente.

---

## 10. README del paquete

El README es lo primero que ve alguien en npmjs.com. Debe tener esto:

```markdown
# @fmarcosdev/helical-scroll-cards

3D helix scroll component for React + Three.js.
Virtualized, paginated, SSR-safe, fully typed.

## Install

npm install @fmarcosdev/helical-scroll-cards

## Peer dependencies

npm install three react react-dom

## Basic usage

import { HelicalScrollCards } from "@fmarcosdev/helical-scroll-cards";

const items = [
{ id: 1, title: "My first article", publishedAt: "2024-01-15" },
{ id: 2, title: "Another post", publishedAt: "2024-02-20" },
];

export function MyPage() {
return (
<div style={{ width: "100%", height: "100vh" }}>
<HelicalScrollCards items={items} />
</div>
);
}

## With pagination

export function MyPageWithPagination() {
const { articles, hasMore, loadingMore, loadMore } = useMyArticles();

return (
<div style={{ width: "100%", height: "100vh" }}>
<HelicalScrollCards
        items={articles}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />
</div>
);
}

## Props

| Prop            | Type                   | Default               | Description                      |
| --------------- | ---------------------- | --------------------- | -------------------------------- |
| items           | T[]                    | []                    | Array de items a mostrar         |
| config          | HelixConfig            | —                     | Configuración de la hélice       |
| theme           | Partial<HelixTheme>    | —                     | Colores del tema                 |
| scrollSpeed     | number                 | 0.5                   | Velocidad del scroll             |
| clockwise       | boolean                | false                 | Dirección de la hélice           |
| hasMore         | boolean                | false                 | Si hay más items para cargar     |
| loadingMore     | boolean                | false                 | Si está cargando más items       |
| onLoadMore      | () => void             | —                     | Callback para cargar más         |
| renderCardTitle | (item: T) => string    | —                     | Render custom del título         |
| renderCardDate  | (item: T) => DateParts | —                     | Render custom de la fecha        |
| loadingText     | string                 | "Loading more..."     | Texto del loader                 |
| emptyText       | string                 | "No items to display" | Texto del estado vacío           |
| debug           | boolean                | false                 | Muestra línea de hélice y bordes |

## TypeScript

import type { CardItem, HelixConfig, HelixTheme } from "@fmarcosdev/helical-scroll-cards";

interface MyArticle extends CardItem {
id: number;
title: string;
publishedAt: string;
category: string;
}

## Requirements

- React >= 18
- Three.js >= 0.150.0
- Browser with WebGL support
```

---

## 11. Checklist final

Antes de correr `npm publish`, verifica cada punto:

### Código

- [ ] Eliminados los `let` (línea 456 y 577-578 del componente original)
- [ ] Eliminado `touchStartY` (dead code)
- [ ] Eliminado o documentado `footerBg`/`footerText` de `HelixTheme`
- [ ] Eliminado `sceneRef` si no se usa externamente
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` genera `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`

### package.json

- [ ] `"name": "@fmarcosdev/helical-scroll-cards"` con scope correcto
- [ ] `react`, `react-dom` y `three` están en `peerDependencies`, NO en `dependencies`
- [ ] `"files": ["dist"]` presente
- [ ] `"exports"` configurado con `import`, `require` y `types`
- [ ] `"prepublishOnly"` corre typecheck + build automáticamente

### Antes de publicar

- [ ] `npm pack --dry-run` muestra solo los archivos de `dist/` + `package.json` + `README.md`
- [ ] `npm whoami` muestra tu usuario de npm
- [ ] `version` en `package.json` es `"1.0.0"` (primera publicación)

### Publicar

```bash
npm publish --access public
```

### Verificar post-publicación

```bash
# Instalar en un proyecto de prueba
npm install @fmarcosdev/helical-scroll-cards

# Verificar que los tipos funcionan
npx tsc --noEmit
```

---

## Referencia rápida de comandos

```bash
# Setup inicial del repo
mkdir helical-scroll-cards && cd helical-scroll-cards
npm init -y
npm install -D tsup typescript @types/react @types/three react react-dom three

# Build
npm run build

# Publicar
npm publish --access public

# Actualizar versión y publicar
npm version patch && npm publish
```

---

> Guía generada el 2026-04-24 basada en análisis de `HelicalScrollCards.tsx` v8.0
> del proyecto `fmarcosdev.app.web`. Componente ubicado en
> `src/components/organisms/blog/HelicalScrollCards.tsx`.
