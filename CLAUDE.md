# CLAUDE.md — fmarcosdev.app.web

## Variables de entorno

- `VITE_API_GATEWAY_URL` NO debe incluir `/api` — ni en `.env.local` ni en Vercel.
  El prefijo `/api` se agrega en el código donde se construye la URL (ej. `blog.tsx`).
  Ejemplo correcto: `http://localhost:3001` / `https://gateway.fmarcos.dev`.

## SEO / Routing

- `public/sitemap.xml` debe estar sincronizado con `ACTIVE_ROUTES` en `src/constants.ts`.
  Si una ruta se agrega o se quita de `ACTIVE_ROUTES`, actualizar el sitemap en el mismo cambio.
  Una URL en el sitemap que no sea ruta activa causa redirects en Search Console.

- El workflow genera `dist/404.html` copiando `dist/index.html` post-build.
  Esto es necesario para que GitHub Pages sirva la SPA en accesos directos a rutas (ej. `/about_me`).
  No eliminar ese paso del workflow.
