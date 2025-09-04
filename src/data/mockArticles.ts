import { Article } from "../components/pages/blog/blog";

export const mockArticles: Article[] = [
  {
    id: 1,
    documentId: "article-1",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    publishedAt: "2024-01-15T10:30:00.000Z",
    Title: "Introducción a React Hooks",
    richContent: `
# Introducción a React Hooks

Los React Hooks revolucionaron la forma de escribir componentes en React. Te permiten usar estado y otros características de React sin escribir una clase.

## ¿Qué son los Hooks?

Los Hooks son funciones especiales que te permiten "conectarte" a las características de React. Todos empiezan con \`use\`, como \`useState\` o \`useEffect\`.

## Ventajas principales

- **Reutilización de lógica**: Puedes extraer lógica de componentes y reutilizarla
- **Código más limpio**: Menos boilerplate comparado con las clases
- **Mejor composición**: Fácil de combinar y testear

\`\`\`javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}
\`\`\`
    `
  },
  {
    id: 2,
    documentId: "article-2",
    createdAt: "2024-02-10T14:20:00.000Z",
    updatedAt: "2024-02-10T14:20:00.000Z",
    publishedAt: "2024-02-10T14:20:00.000Z",
    Title: "TypeScript en proyectos React",
    richContent: `
# TypeScript en proyectos React

TypeScript añade tipado estático a JavaScript, mejorando la experiencia de desarrollo y reduciendo errores en tiempo de ejecución.

## Beneficios de usar TypeScript

- **Detección temprana de errores**: Los errores se capturan en tiempo de compilación
- **Mejor IntelliSense**: Autocompletado más preciso en el IDE
- **Refactoring seguro**: Cambios de código más confiables

## Ejemplo básico

\`\`\`typescript
interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

const Counter: React.FC<Props> = ({ title, count, onIncrement }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Contador: {count}</p>
      <button onClick={onIncrement}>Incrementar</button>
    </div>
  );
};
\`\`\`
    `
  },
  {
    id: 3,
    documentId: "article-3",
    createdAt: "2024-03-05T09:15:00.000Z",
    updatedAt: "2024-03-05T09:15:00.000Z",
    publishedAt: "2024-03-05T09:15:00.000Z",
    Title: "Optimización de rendimiento en aplicaciones web",
    richContent: `
# Optimización de rendimiento en aplicaciones web

El rendimiento es crucial para la experiencia del usuario. Una aplicación lenta puede llevar a la pérdida de usuarios y menor conversión.

## Técnicas principales

### 1. Lazy Loading
Cargar recursos solo cuando se necesitan.

\`\`\`javascript
const LazyComponent = lazy(() => import('./HeavyComponent'));
\`\`\`

### 2. Memoización
Evitar recálculos innecesarios.

\`\`\`javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(props.data);
}, [props.data]);
\`\`\`

### 3. Code Splitting
Dividir el código en chunks más pequeños.

## Herramientas de medición

- **Lighthouse**: Auditoría integral de rendimiento
- **Web Vitals**: Métricas core de Google
- **React DevTools**: Profiler para componentes React
    `
  },
  {
    id: 4,
    documentId: "article-4",
    createdAt: "2024-04-12T16:45:00.000Z",
    updatedAt: "2024-04-12T16:45:00.000Z",
    publishedAt: "2024-04-12T16:45:00.000Z",
    Title: "GraphQL vs REST: ¿Cuándo usar cada uno?",
    richContent: `
# GraphQL vs REST: ¿Cuándo usar cada uno?

La elección entre GraphQL y REST depende de varios factores del proyecto, equipo y requisitos específicos.

## REST - Representational State Transfer

### Ventajas
- **Simplicidad**: Fácil de entender y implementar
- **Caching**: HTTP caching funciona de forma natural
- **Tooling**: Amplio ecosistema de herramientas

### Cuándo usar REST
- APIs públicas simples
- Operaciones CRUD básicas
- Equipos con experiencia limitada en GraphQL

## GraphQL - Query Language

### Ventajas
- **Flexibilidad**: Los clientes solicitan exactamente lo que necesitan
- **Tipado fuerte**: Schema bien definido
- **Una sola endpoint**: Simplifica la arquitectura

### Cuándo usar GraphQL
- Aplicaciones con múltiples clientes
- Datos altamente relacionales
- Necesidad de queries complejas

\`\`\`graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    posts {
      title
      publishedAt
    }
  }
}
\`\`\`

## Conclusión

No hay una respuesta única. La mejor elección depende del contexto específico de tu proyecto.
    `
  },
  {
    id: 5,
    documentId: "article-5",
    createdAt: "2024-05-20T11:30:00.000Z",
    updatedAt: "2024-05-20T11:30:00.000Z",
    publishedAt: "2024-05-20T11:30:00.000Z",
    Title: "El futuro del desarrollo web: Tendencias 2024",
    richContent: `
# El futuro del desarrollo web: Tendencias 2024

El mundo del desarrollo web evoluciona constantemente. Estas son las tendencias más importantes que están definiendo el panorama actual.

## 1. Edge Computing y Server-Side Rendering

Los frameworks como Next.js y Remix están llevando la computación más cerca del usuario.

### Beneficios
- **Menor latencia**: Respuestas más rápidas
- **Mejor SEO**: Contenido renderizado en el servidor
- **Experiencia híbrida**: Lo mejor de SSR y SPA

## 2. Web Components y Micro Frontends

La modularización llega al frontend con arquitecturas más distribuidas.

\`\`\`javascript
// Web Component personalizado
class MyCustomElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<p>¡Hola desde un Web Component!</p>';
  }
}

customElements.define('my-custom-element', MyCustomElement);
\`\`\`

## 3. WebAssembly (WASM)

Ejecutar código de alto rendimiento en el navegador.

### Casos de uso
- Juegos complejos
- Aplicaciones de edición de video/imagen
- Simulaciones científicas

## 4. AI-Assisted Development

Herramientas como GitHub Copilot están cambiando cómo escribimos código.

### Impacto
- **Mayor productividad**: Autocompletado inteligente
- **Menos bugs**: Sugerencias basadas en mejores prácticas
- **Aprendizaje acelerado**: Patrones y técnicas avanzadas

## 5. Sostenibilidad Digital

Desarrollo con conciencia ambiental.

- **Green Coding**: Código más eficiente consume menos energía
- **CDNs inteligentes**: Distribución optimizada de contenido
- **Lazy Loading**: Cargar solo lo necesario

El futuro es emocionante, y estas tecnologías están aquí para quedarse.
    `
  }
];
