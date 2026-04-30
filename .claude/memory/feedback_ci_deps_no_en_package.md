---
name: Dependencias de CI no deben estar en package.json del proyecto web
description: Paquetes instalados directamente en GitHub Actions no deben declararse en package.json — arrastran vulnerabilidades sin beneficio
type: feedback
---

Dependencias usadas exclusivamente en GitHub Actions CI (`resume-cli`, `jsonresume-theme-dev-ats-es`) no deben estar en `package.json` del proyecto web. El workflow las instala con `npm install` directamente en el step correspondiente.

**Why:** Tenerlas en `package.json` arrastraba ~40 vulnerabilidades transitivas (puppeteer, browser-sync, axios, etc.) al proyecto web sin ningún beneficio — el código fuente nunca las importa.

**How to apply:** Antes de agregar una dependencia, verificar si realmente se importa en `src/`. Si solo se usa en scripts de CI o en comandos manuales puntuales, no agregarla al `package.json` — instalarla on-demand o en el workflow directamente.
