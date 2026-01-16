#  Responsive website [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/freddymhs/fmarcosdev.github.io/generate-resume.yml?branch=development)](https://github.com/freddymhs/fmarcosdev.github.io/actions/workflows/generate-resume.yml)

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

Aplicación web profesional construida con React y Vite, implementando Atomic Design y automatización de CI/CD para generación de documentos.


## 🚀 Sistema de generación de CV

Este proyecto incluye un sistema automatizado para generar su currículum en múltiples formatos (HTML, PDF, DOCX) utilizando JSON Resume que ademas consume y muestra la misma informacion en el sitio.


#### Scripts basicos

- **dev**: Inicia el servidor de desarrollo en el puerto 3000
  ```bash
  npm run dev
  ```
  
- **preview**: Compila y permite revisarlo 
  ```bash
  npm run preview
  ```

- **simulate-worflow-generate-docs**: Genera los archivos de CV localmente
  ```bash
  npm run simulate-worflow-generate-docs
  ```
#### Scripts opcionales

- **version-upgrade**: Incrementa la versión del proyecto y crea un commit
  ```bash
  npm run version-upgrade
  ```
- **cypress**: Abre Cypress para pruebas e2e
  ```bash
  npm run cypress
  ``




## 📝 How to use :  

1. Cambiar a rama de feature: `git checkout -b mi-feature`
2. Editar algún archivo
   - `git add . && git commit -m "mi feature"`
   - `npm run review` (no debe tener fallas)
   - _(opcional)_ `npm run version-upgrade` (genera commit de nueva versión)
3. `git push` y **crear Pull Request** o **hacer commit directo a `development`**
4. (Automático) GitHub Workflow detecta cambios en `development`
   - Genera archivos `CV.pdf`, `CV.html`, etc.
   - Despliegue automático en Vercel


- generador de docs por (CI/CD) en la instancia de  github
  - El proyecto utiliza GitHub Actions para generar automáticamente los archivos del CV cuando se realiza un push a la rama `development`. 
```
Detalles del generador de docs por (CI/CD):

1. Se activa al hacer push a la rama `development`
2. Instala las dependencias necesarias (Node.js, wkhtmltopdf, pandoc)
3. Genera los archivos CV (HTML, PDF, DOCX)
4. Mueve los archivos generados a `src/generate-resume-files-by-workflow/`
5. Construye el proyecto
6. Realiza commit de los cambios y los envía a la rama `development`
7. Sincroniza la rama `main` con `development`
**Para ejecutar manualmente, puede utilizar la función "workflow_dispatch" en GitHub Actions.**
```



## 📌 Mejoras Futuras
- loading del primer modelo
- icono web
- errores de cambio pagina
- tipografia de 2 tipos
- Implementar i18n para soporte multilingüe
- Añadir modo oscuro/claro
- Integrar CMS para el blog
- Mejorar métricas de performance (Lighthouse)
- View transition de react

## **🌍 Arquitectura del Proyecto**

####  Estructura Atomic Design

```
src/
├── components/
│ ├── atoms/ # Button, Image, Typography
│ ├── molecules/ # JobExperience, SocialLink
│ ├── organisms/ # Header, Footer, Hero
│ ├── pages/ # AboutMe, Blog, Certificates
│ └── templates/ # MainLayout, BlogLayout
├── assets/ # Fuentes, iconos, imágenes
├── data/ # resume.json (JSON Resume)
└── generate-resume-files-by-workflow/ # CV automáticos
```

####  Stack Tecnológico

```
| Categoría      | Tecnologías                                  |
| -------------- | -------------------------------------------- |
| Core           | React 18, Vite, TypeScript, React Route      |
| Estilos        | TailwindCSS, PostCSS                         |
| CI/CD          | GitHub Actions, wkhtmltopdf, pandoc          |
| Formato CV     | JSON Resume, dev-ats theme                   |
| Almacenamiento | Cloudinary (imágenes y medios)               |
| Calidad Código | ESLint, Prettier, TypeScript tipado estricto |
```

<!-- ## 🎨 Colores

Paleta de Colores:

- #DFD829	Resaltado	
- #252830	Fondo	
- #61A059	Títulos	
- #FFFFFF	Texto	 -->

<!-- ## Tipografía

Primaria: Inter (sans-serif)
Secundaria: Mono Lisa (monospace) -->

#### Rutas
- / about_me
- / social
- / certificates
- / blog
- / projects

## **🖥 Instalación y desarrollo**

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Freddymhs/fmarcosdev.github.io
   cd fmarcosdev.github.io
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Este comando:
   - Mata cualquier proceso en el puerto 3000
   - Inicia el servidor de desarrollo de Vite
   - Abre automáticamente el navegador en http://localhost:3000
