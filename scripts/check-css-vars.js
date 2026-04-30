#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Extraer variables definidas del index.css (bloque @theme)
function extractDefinedVariables(cssContent) {
  const definedVars = new Set();
  const themeBlockMatch = cssContent.match(/@theme\s*\{([^}]*)\}/s);

  if (themeBlockMatch) {
    const themeContent = themeBlockMatch[1];
    const varMatches = themeContent.matchAll(/--([a-z-]+):/g);
    for (const match of varMatches) {
      definedVars.add(`--${match[1]}`);
    }
  }

  return definedVars;
}

// Convertir --color-accent-green → accent-green (Tailwind utility token)
function cssVarToTailwindToken(cssVar) {
  return cssVar
    .replace(/^--/, '')
    .replace(/^color-/, '')
    .replace(/^font-family-/, '')
    .replace(/^spacing-/, '')
    .replace(/^radius-/, '')
    .replace(/^shadow-/, '')
    .replace(/^transition-/, '');
}

// Extraer variables usadas en archivos (var() y clases Tailwind)
function extractUsedVariables(content, definedVars) {
  const usedVars = new Set();

  // Detectar uso directo: var(--variable-name)
  const varMatches = content.matchAll(/var\((--[a-z-]+)\)/g);
  for (const match of varMatches) {
    usedVars.add(match[1]);
  }

  // Detectar uso como clase Tailwind: bg-accent-green, text-text-primary, font-mono, etc.
  for (const cssVar of definedVars) {
    const token = cssVarToTailwindToken(cssVar);
    // Busca el token como parte de una clase Tailwind (con prefijo o sufijo de clase)
    const tailwindPattern = new RegExp(`(?:^|[\\s"'\`/])(?:[a-z-]+:)?(?:bg|text|border|ring|fill|stroke|from|to|via|shadow|rounded|font|transition|duration|gap|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|h|space)-${token}(?:[\\s"'\`/]|$)`, 'm');
    if (tailwindPattern.test(content)) {
      usedVars.add(cssVar);
    }
  }

  return usedVars;
}

// Buscar archivos recursivamente
function findFiles(dir, extensions) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

function checkCSSVariables() {
  try {
    const cssContent = fs.readFileSync('./src/index.css', 'utf8');
    const definedVars = extractDefinedVariables(cssContent);

    console.log(`✅ Found ${definedVars.size} defined CSS variables`);

    const files = findFiles('./src', ['.ts', '.tsx', '.css', '.scss']);
    const usedVars = new Set();

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const fileVars = extractUsedVariables(content, definedVars);
      fileVars.forEach(v => usedVars.add(v));
    }

    console.log(`🔍 Found ${usedVars.size} used CSS variables`);

    const undefinedVars = [...usedVars].filter(v => !definedVars.has(v));
    const unusedVars = [...definedVars].filter(v => !usedVars.has(v));

    let hasErrors = false;

    if (undefinedVars.length > 0) {
      console.error(`❌ Undefined CSS variables found:`);
      undefinedVars.forEach(v => console.error(`  - ${v}`));
      hasErrors = true;
    }

    if (unusedVars.length > 0) {
      console.warn(`⚠️  Unused CSS variables found (${unusedVars.length}):`);
      unusedVars.forEach(v => console.warn(`  - ${v}`));
      console.warn(`💡 Consider removing unused variables to keep your CSS clean`);
    }

    if (hasErrors) {
      process.exit(1);
    }

    if (unusedVars.length === 0) {
      console.log(`✅ All CSS variables are properly defined and used!`);
    } else {
      console.log(`✅ All used CSS variables are properly defined!`);
    }
  } catch (error) {
    console.error('Error checking CSS variables:', error.message);
    process.exit(1);
  }
}

checkCSSVariables();
