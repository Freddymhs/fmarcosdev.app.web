---
name: check-css-vars falsos positivos con Tailwind
description: El script check-css-vars.js solo detecta var(--x), no clases utilitarias Tailwind — genera falsos positivos en este proyecto
type: feedback
---

El script `scripts/check-css-vars.js` detecta uso de variables CSS únicamente via `var(--variable)`. En este proyecto las variables definidas en `@theme` de Tailwind CSS 4 se consumen como clases utilitarias (`bg-accent-green`, `text-text-secondary`, `font-mono`, etc.) sin usar `var()`, lo que hacía que el script reportara 23 falsos positivos de variables "no usadas".

**Why:** Tailwind CSS 4 convierte automáticamente las variables `@theme` en utilidades — el consumo real no deja rastro de `var()` en el código.

**How to apply:** Si el script vuelve a reportar variables no usadas, verificar primero si se usan como clases Tailwind antes de eliminarlas. El script ya fue corregido para detectar ambos patrones.
