# Análisis Completo del Proyecto fmarcosdev.app.web

## Resumen Ejecutivo
Es un portafolio web personal profesional construido con **React 19 + TypeScript + Vite**, implementando **Atomic Design** y con un sistema automatizado de generación de CV.

## Arquitectura Técnica

### Stack Principal
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS v4.0.17 + Tailwind Variants
- **Routing**: React Router v7.4.0
- **3D Graphics**: Three.js v0.177.0
- **Build**: Vite con plugins de React y TailwindCSS

### Estructura de Componentes (Atomic Design)
```
src/components/
├── atoms/          # Elementos básicos (Button, Particles, ProgressBar)
├── molecules/      # Grupos simples (JobExperience, ProjectCard, DebugInfo)  
├── organisms/      # Secciones complejas (Header, Footer, Blog components)
├── pages/          # Páginas completas (Landing, AboutMe, Blog, Projects)
└── templates/      # Layouts (MainLayout, LandingLayout, PageContentLayout)
```

### Sistema de Rutas
- `/` - Landing con layout especial
- `/about_me` - Página principal (ruta por defecto)
- `/social` - Enlaces sociales (deshabilitada en navegación)
- `/certificates` - Certificaciones profesionales
- `/projects` - Portfolio de proyectos
- `/blog` - Blog con elementos 3D interactivos

## Características Destacadas

### Sistema Automatizado de CV (GitHub Actions)
- **Trigger**: Push a branch `development`
- **Proceso**: 
  1. Genera HTML desde `resume.json` usando `jsonresume-theme-dev-ats-es`
  2. Convierte a PDF con `wkhtmltopdf`  
  3. Convierte a DOCX con `pandoc`
  4. Commit automático y sync con `main`
- **Output**: CV en 3 formatos almacenados en `src/generate-resume-files-by-workflow/`

### Blog Interactivo 3D
- **HolographicCarousel**: Carrusel con efectos holográficos
- **HelicoidalCards**: Cartas con animaciones helicoidales
- **Oscilospira**: Componente con efectos oscilatorios
- Todos basados en Three.js

### Gestión de Datos
- **`resume.json`**: Fuente única de verdad (JSON Resume schema)
- **`constants.ts`**: 80+ tecnologías definidas con colores TailwindCSS específicos
- **Hooks personalizados**: `useResumeData`, `useLayoutDimensions`, `useMediaQuery`

## Configuración y Build

### Scripts NPM
- `npm run dev` - Servidor desarrollo puerto 3000
- `npm run build` - Build producción (TypeScript check + Vite build)  
- `npm run review` - Build + preview puerto 4173
- `npm run simulate-worflow-generate-docs` - Generación local CV

### Configuración TypeScript
- Referencias a `tsconfig.app.json` y `tsconfig.node.json`
- Target ESNext, módulos ESNext
- Strict type checking habilitado

### TailwindCSS
- Configuración híbrida (v4 en `index.css` + v3 config legacy)
- Plugin typography incluido
- Colores personalizados para 80+ tecnologías

## Flujo de Desarrollo
1. Branch feature desde `development`
2. Testing con `npm run review`
3. Push → Generación automática CV
4. Deploy automático a Vercel

## Estado del Proyecto
- **Versión actual**: 0.18.0
- **Branch principal**: `main`
- **Branch desarrollo**: `development` 
- **Status Git**: Limpio
- **Último commit**: "new changes" (9203565)

## Insights Técnicos
- Implementación madura de Atomic Design
- Excelente separación de responsabilidades
- Sistema de CI/CD sofisticado
- Rica experiencia 3D en blog
- Type safety completo con TypeScript
- Arquitectura escalable y mantenible