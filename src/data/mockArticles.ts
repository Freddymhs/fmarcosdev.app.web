import { Article } from "../components/pages/blog/blog";

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CONFIGURACIÓN DE TESTING - Cambia este número para probar con más/menos cards
// ═══════════════════════════════════════════════════════════════════════════
const ARTICLE_COUNT = 100; // ← CAMBIA ESTE NÚMERO: 5, 10, 20, 40, 80, 120, 150, 200
// borrar
// ═══════════════════════════════════════════════════════════════════════════
// 📚 Temas y títulos para generar artículos variados
// ═══════════════════════════════════════════════════════════════════════════
const TECH_TOPICS = [
  "React Hooks avanzados",
  "TypeScript Best Practices", 
  "Next.js App Router",
  "GraphQL vs REST",
  "Tailwind CSS Tips",
  "Node.js Performance",
  "Docker para devs",
  "CI/CD con GitHub Actions",
  "Testing con Jest",
  "MongoDB vs PostgreSQL",
  "AWS para principiantes",
  "Kubernetes básico",
  "WebSockets en tiempo real",
  "Redux vs Zustand",
  "Vite vs Webpack",
  "CSS Grid Layout",
  "Flexbox mastery",
  "React Query",
  "Prisma ORM",
  "tRPC end-to-end",
  "Serverless Functions",
  "Edge Computing",
  "WebAssembly intro",
  "PWA development",
  "SEO para SPAs",
  "Accessibility (a11y)",
  "Web Security basics",
  "OAuth 2.0 explained",
  "JWT best practices",
  "API Rate Limiting",
  "Caching strategies",
  "Database indexing",
  "Microservices patterns",
  "Event-driven architecture",
  "Domain-Driven Design",
  "Clean Architecture",
  "SOLID principles",
  "Design Patterns JS",
  "Functional programming",
  "Reactive programming",
  "Machine Learning JS",
  "TensorFlow.js",
  "Web Workers",
  "Service Workers",
  "IndexedDB",
  "WebGL basics",
  "Three.js intro",
  "Canvas API",
  "SVG animations",
  "GSAP animations",
];

const TITLE_PREFIXES = [
  "Guía completa de",
  "Introducción a",
  "Dominando",
  "Profundizando en",
  "Tips y trucos de",
  "Errores comunes en",
  "Optimizando",
  "Mejores prácticas de",
  "Tutorial de",
  "Explorando",
];

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 Función generadora de artículos
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Genera una fecha aleatoria entre 2023 y 2025
 */
const generateRandomDate = (index: number): string => {
  const baseDate = new Date(2023, 0, 1);
  // Distribuir fechas uniformemente
  const daysToAdd = Math.floor((index / 200) * 730) + Math.floor(Math.random() * 30);
  baseDate.setDate(baseDate.getDate() + daysToAdd);
  return baseDate.toISOString();
};

/**
 * Genera un título único combinando prefijos y temas
 */
const generateTitle = (index: number): string => {
  const prefix = TITLE_PREFIXES[index % TITLE_PREFIXES.length];
  const topic = TECH_TOPICS[index % TECH_TOPICS.length];
  const part = Math.floor(index / TECH_TOPICS.length) + 1;
  return part > 1 ? `${prefix} ${topic} (Parte ${part})` : `${prefix} ${topic}`;
};

/**
 * Genera contenido de ejemplo para un artículo
 */
const generateContent = (title: string, index: number): string => `
# ${title}

Este es el artículo número ${index + 1} de nuestra colección de contenido técnico.

## Introducción

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Puntos clave

- Punto importante #1 sobre ${title.split(' ').slice(-2).join(' ')}
- Punto importante #2 con ejemplos prácticos
- Punto importante #3 para implementar

## Conclusión

Este artículo cubre los aspectos fundamentales del tema. ¡Esperamos que te sea útil!
`;

/**
 * Genera N artículos mock
 */
const generateArticles = (count: number): Article[] => {
  return Array.from({ length: count }, (_, index) => {
    const date = generateRandomDate(index);
    const title = generateTitle(index);
    return {
      id: index + 1,
      documentId: `article-${index + 1}`,
      createdAt: date,
      updatedAt: date,
      publishedAt: date,
      Title: title,
      richContent: generateContent(title, index),
    };
  }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

// ═══════════════════════════════════════════════════════════════════════════
// 📤 Export: usa ARTICLE_COUNT para controlar cuántos artículos se generan
// ═══════════════════════════════════════════════════════════════════════════
export const mockArticles: Article[] = generateArticles(ARTICLE_COUNT);

// También exportar la función por si quieres usarla directamente
export { generateArticles };
