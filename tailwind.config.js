// Versión antigua de configuración Tailwind (v3). Ya no se usa.
// Migrado a Tailwind v4: la configuración vive en index.css con @import "tailwindcss".

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {},
  plugins: [require("@tailwindcss/typography")],
};
