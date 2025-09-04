// old version, i will update my config in index.css directly :)

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {},
  plugins: [require("@tailwindcss/typography")],
};
