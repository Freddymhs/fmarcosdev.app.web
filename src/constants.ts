// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const URL_SITE = "https://fmarcos.dev";
// export const URL_SITE = "http://localhost:4321/";
export const INITIAL_ROUTE = "/";
export const SITE_TITLE = "fmarcos - Full Stack Developer";
export const SITE_DESCRIPTION =
  "Senior Full Stack Developer specializing in React, Node.js, TypeScript, and modern web technologies. Explore my portfolio, projects, and professional experience in software development.";
export const HOME_PAGE = "/about_me";
export const SOCIAL_PAGE = "/social";
export const BLOG_PAGE = "/blog";
export const PROJECTS_PAGE = "/projects";
export const CERTIFICATES_PAGE = "/certificates";
export const NO_INCLUDED_ROUTE_TO_PAGE = "*";
export const AUTHOR_NAME = "Freddy Huaylla";
export const PROFESSION = "ANALISTA PROGRAMADOR";
export const WELCOME_MESSAGES = [
  "¿Sabías que JavaScript fue creado en solo 10 días?",
  "Dato curioso: JavaScript no tiene nada que ver con Java.",
  "En JavaScript, '[] + []' da como resultado una cadena vacía.",
  "JavaScript inicialmente se llamó Mocha.",
  "En JavaScript, 'NaN' significa 'Not-a-Number'.",
  "JavaScript es un lenguaje interpretado, no compilado.",
  "Las funciones en JavaScript son de primera clase.",
  "JavaScript puede funcionar tanto en el cliente como en el servidor.",
  "El primer navegador en soportar JavaScript fue Netscape.",
  "JavaScript no tiene tipos de datos enteros.",
  "En JavaScript, 'undefined' y 'null' son diferentes.",
  "JavaScript soporta programación orientada a objetos, funcional y basada en prototipos.",
  "El operador '===' en JavaScript también compara tipos de datos.",
  "JavaScript tiene solo un tipo de número: el número de 64 bits IEEE 754.",
  "En JavaScript, '0.1 + 0.2' no es exactamente igual a '0.3'.",
  "JavaScript permite funciones anidadas.",
  "Los arrays en JavaScript son objetos.",
  "JavaScript es un lenguaje débilmente tipado.",
  "El 'use strict' en JavaScript activa el modo estricto.",
  "JavaScript tiene closures o cierres.",
  "JSON significa JavaScript Object Notation.",
  "JavaScript tiene funciones de orden superior.",
  "Las promesas en JavaScript se usan para operaciones asíncronas.",
  "JavaScript es compatible con ECMAScript.",
  "El 'this' en JavaScript depende de cómo se llama a la función.",
  "JavaScript tiene un solo hilo de ejecución.",
  "Los módulos en JavaScript permiten dividir el código en archivos separados.",
  "JavaScript tiene métodos de array como 'map', 'filter' y 'reduce'.",
  "El 'async/await' simplifica el manejo de promesas.",
  "En JavaScript, 'typeof null' devuelve 'object'.",
];

export const contactsData = [
  {
    name: "fmarcosdev@gmail.com",
    url: "fmarcosdev@gmail.com",
    type: "mail",
  },
  {
    name: "linkedin.com/in/freddymhs/",
    url: "https://linkedin.com/in/freddymhs/",
    type: "linkedin",
  },
  // {
  //   name: "github.com/Freddymhs",
  //   url: "https://github.com/Freddymhs",
  //   type: "github",
  // },
  // { name: "mi-blog.dev", url: "https://mi-blog.dev", type: "web" },
];

export const ROUTES = {
  INITIAL_ROUTE: INITIAL_ROUTE,
  HOME_PAGE: HOME_PAGE,
  SOCIAL_PAGE: "/social",
  CERTIFICATES_PAGE: CERTIFICATES_PAGE,
  PROJECTS_PAGE: PROJECTS_PAGE,
  BLOG_PAGE: BLOG_PAGE,
  NO_INCLUDED_ROUTE_TO_PAGE: NO_INCLUDED_ROUTE_TO_PAGE,
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const ExistentPages: { to: RoutePath; label: string }[] = [
  { to: ROUTES.HOME_PAGE, label: "About Me" },
  { to: ROUTES.SOCIAL_PAGE, label: "Social" },
  { to: ROUTES.CERTIFICATES_PAGE, label: "Certificates" },
  { to: ROUTES.PROJECTS_PAGE, label: "Projects" },
  { to: ROUTES.BLOG_PAGE, label: "Blog" },
  { to: ROUTES.NO_INCLUDED_ROUTE_TO_PAGE, label: "NOT FOUND PAGE" },
  { to: ROUTES.INITIAL_ROUTE, label: "Landing Page" },
];

const ACTIVE_ROUTES: RoutePath[] = [
  ROUTES.HOME_PAGE,
  ROUTES.CERTIFICATES_PAGE,
  ROUTES.PROJECTS_PAGE,
  ROUTES.BLOG_PAGE,
  ROUTES.NO_INCLUDED_ROUTE_TO_PAGE,
  ROUTES.INITIAL_ROUTE,
];
const VISIBLE_NAV_ROUTES: RoutePath[] = [
  ROUTES.HOME_PAGE,
  ROUTES.CERTIFICATES_PAGE,
  ROUTES.PROJECTS_PAGE,
  ROUTES.BLOG_PAGE,
];

export const REGISTERED_PAGES = ExistentPages.filter(({ to }) =>
  ACTIVE_ROUTES.includes(to)
);

export const NAVIGATION_PAGES = ExistentPages.filter(({ to }) =>
  VISIBLE_NAV_ROUTES.includes(to)
);

export const copyRightText = "© 2025 fmarcos.dev";

export const TECH_REACT = "React";
export const TECH_NEXTJS = "Next.js";
export const TECH_TYPESCRIPT = "TypeScript";
export const TECH_JAVASCRIPT = "JavaScript";
export const TECH_GRAPHQL = "GraphQL";
export const TECH_FLUTTER = "Flutter";
export const TECH_SUPABASE = "Supabase";
export const TECH_POSTGRESQL = "PostgreSQL";
export const TECH_APOLLO_CLIENT = "Apollo Client";
export const TECH_APOLLO_SERVER = "Apollo Server";
export const TECH_EXPRESS = "Express";
export const TECH_PRISMA = "Prisma";
export const TECH_WEBSOCKETS = "WebSockets";
export const TECH_GIT = "Git";
export const TECH_GITHUB_ACTIONS = "GitHub Actions";
export const TECH_PHP = "PHP";
export const TECH_WORDPRESS = "WordPress";
export const TECH_CSS = "CSS";
export const TECH_HTML = "HTML";
export const TECH_ANGULAR = "Angular";
export const TECH_JIRA = "JIRA";

// Additional technology constants from resume.json
export const TECH_NESTJS = "NestJS";
export const TECH_NODEJS = "NodeJS";
export const TECH_PUPPETEER = "Puppeteer";
export const TECH_PUPPETEER_ADVANCED = "Puppeteer Advanced";
export const TECH_TWILIO_API = "Twilio API";
export const TECH_BROWSER_POOL_MANAGEMENT = "Browser Pool Management";
export const TECH_SHADOW_DOM_MANIPULATION = "Shadow DOM Manipulation";
export const TECH_THREAD_MANAGEMENT = "Thread Management";
export const TECH_HEALTH_MONITORING = "Health Monitoring";
export const TECH_CONNECTION_POOLING = "Connection Pooling";
export const TECH_VALIDATION_PIPES = "Validation Pipes";
export const TECH_RATE_LIMITING = "Rate Limiting";
export const TECH_NEXUS = "Nexus";
export const TECH_REDIS = "Redis";
export const TECH_MICROSERVICES = "Microservices";
export const TECH_SERVERLESS_ARCHITECTURE = "Serverless Architecture";
export const TECH_TDD = "TDD";
export const TECH_CIRCUIT_BREAKER_PATTERN = "Circuit Breaker Pattern";
export const TECH_AWS_LAMBDA = "AWS Lambda";
export const TECH_AWS_SNS = "AWS SNS";
export const TECH_AWS_SQS = "AWS SQS";
export const TECH_GATSBY = "Gatsby";
export const TECH_REACT_I18NEXT = "React i18next";
export const TECH_STYLED_COMPONENTS = "Styled Components";
export const TECH_REACT_PARALLAX = "React Parallax";
export const TECH_REACT_HELMET = "React Helmet";
export const TECH_GATSBY_PLUGINS = "Gatsby Plugins";
export const TECH_BOOTSTRAP = "Bootstrap";
export const TECH_ANT_DESIGN = "Ant Design";
export const TECH_CONTEXT_API = "Context API";
export const TECH_ESLINT = "ESLint";
export const TECH_PRETTIER = "Prettier";
export const TECH_HUSKY = "Husky";
export const TECH_VITEST = "Vitest";
export const TECH_WEBPACK = "Webpack";
export const TECH_CHROME_DEVTOOLS = "Chrome DevTools";
export const TECH_METODOLOGIAS_AGILES = "Metodologías Ágiles";
export const TECH_CI_CD = "CI/CD";
export const TECH_DART = "Dart";
export const TECH_REACT_NATIVE = "react-native";
export const TECH_AWS_FREE_TIER = "AWS Free Tier";
export const TECH_AWS_SES = "AWS SES";
export const TECH_API_GATEWAY = "API Gateway";
export const TECH_AGILE_SCRUM = "Agile/Scrum";
export const TECH_CODE_REFACTORING = "Code Refactoring";
export const TECH_COMPUTER_VISION = "Computer Vision";
export const TECH_CONVERSATIONAL_AI = "Conversational AI";
export const TECH_CROSS_PLATFORM = "Cross-platform";
export const TECH_DATABASE_DESIGN = "Database Design";
export const TECH_DEPENDENCY_INJECTION = "Dependency Injection";
export const TECH_ERROR_HANDLING_MIDDLEWARE = "Error Handling Middleware";
export const TECH_HUMAN_BEHAVIOR_SIMULATION = "Human Behavior Simulation";
export const TECH_ANTI_DETECTION_TECHNIQUES = "Anti-Detection Techniques";
export const TECH_IMAGE_ANALYSIS = "Image Analysis";
export const TECH_MODULAR_ARCHITECTURE = "Modular Architecture";
export const TECH_OPENAI_API = "OpenAI API";
export const TECH_OPENAI_ASSISTANT_API = "OpenAI Assistant API";
export const TECH_OPENAI_VISION_API = "OpenAI Vision API";
export const TECH_PERFORMANCE_OPTIMIZATION = "Performance Optimization";
export const TECH_PWA = "PWA";
export const TECH_REST_APIS = "REST APIs";
export const TECH_SCREENSHOT_AUTOMATION = "Screenshot Automation";
export const TECH_SEO_OPTIMIZATION = "SEO Optimization";
export const TECH_WHATSAPP_INTEGRATION = "WhatsApp Integration";

export const TECH_SOCKET_IO = "Socket.IO";
export const TECH_GRAPHQL_SUBSCRIPTIONS = "GraphQL Subscriptions";
export const TECH_EXPRESS_JS = "Express.js";
export const TECH_PRISMA_ORM = "Prisma ORM";
export const TECH_OPENAI_ASSISTANT_API_V2 = "OpenAI Assistant API v2";
export const TECH_STRAPI_V5_23 = "Strapi v5.23";
export const TECH_HEADLESS_CMS = "Headless CMS";
export const TECH_API_FIRST_ARCHITECTURE = "API-first Architecture";
export const TECH_CONTENT_MODELING = "Content Modeling";
export const TECH_CMS_AUTHENTICATION = "CMS Authentication";
export const TECH_MEDIA_MANAGEMENT = "Media Management";
export const TECH_SQLITE3 = "SQLite3";
export const TECH_BETTER_SQLITE3 = "Better-SQLite3";
export const TECH_GOOGLE_OAUTH2 = "Google OAuth2";
export const TECH_DART_3_4_1 = "Dart 3.4.1+";
export const TECH_MOBILE_SCANNER = "Mobile Scanner";
export const TECH_BLUETOOTH_PRINT_ESC_POS = "Bluetooth Print ESC/POS";
export const TECH_JEST = "Jest";
export const TECH_AXIOS_HTTP_CLIENT = "Axios HTTP Client";
export const TECH_WHATSAPP_BUSINESS_API = "WhatsApp Business API";
export const TECH_GOOGLE_SHEETS_API = "Google Sheets API";
export const TECH_AWS_S3 = "AWS S3";
export const TECH_REDIS_PUB_SUB = "Redis Pub/Sub";
export const TECH_CLEAN_ARCHITECTURE = "Clean Architecture";
export const TECH_ROLE_BASED_ACCESS_CONTROL = "Role-based Access Control";
export const TECH_REAL_TIME_INVENTORY_MANAGEMENT =
  "Real-time Inventory Management";
export const TECH_HARDWARE_INTEGRATION = "Hardware Integration";
export const TECH_PDF_CSV_GENERATION = "PDF/CSV Generation";
export const TECH_CIRCUIT_BREAKER = "Circuit Breaker";
export const TECH_ASYNCHRONOUS_PROGRAMMING = "Asynchronous Programming";
export const TECH_AWS_EC2_LAMBDAS_DYNAMODB = "AWS (EC2, Lambdas, DynamoDB)";
export const TECH_SERVERLESS = "Serverless";
export const TECH_USEREDUCER = "useReducer";
export const TECH_UI_UX_OPTIMIZATION = "UI/UX Optimization";
export const TECH_FEATURE_FLAGS = "Feature Flags";
export const TECH_REACT_ROUTER_DOM = "React Router DOM";
export const TECH_PROXY_ROTATION_IPROYAL = "Proxy Rotation (IPRoyal)";
export const TECH_CONCURRENT_BROWSER_MANAGEMENT =
  "Concurrent Browser Management";
export const TECH_NESTJS_SCRAPER_ARCHITECTURE = "NestJS Scraper Architecture";
export const TECH_NEXUS_SCRAPER_ARCHITECTURE = "Nexus Scraper Architecture";
export const TECH_MODULAR_ARCHITECTURE_BACKEND = "Modular Architecture (Backend)";
export const TECH_ERROR_HANDLING_MIDDLEWARE_BACKEND =
  "Error Handling Middleware (Backend)";
export const TECH_VALIDATION_PIPES_BACKEND = "Validation Pipes (Backend)";
export const TECH_THREAD_MANAGEMENT_BACKEND = "Thread Management (Backend)";
export const TECH_HEALTH_MONITORING_BACKEND = "Health Monitoring (Backend)";
export const TECH_PERFORMANCE_OPTIMIZATION_BACKEND = "Performance Optimization (Backend)";
export const TECH_ZOD_VALIDATION = "Zod Validation";
export const TECH_SWAGGER_OPENAPI_DOCUMENTATION =
  "Swagger/OpenAPI Documentation";
export const TECH_NESTJS_SCRAPER_ARCHITECTURE_BACKEND =
  "NestJS Scraper Architecture (Backend)";
export const TECH_PROXY_ROTATION_IPROYAL_BACKEND = "Proxy Rotation (IPRoyal) (Backend)";
export const TECH_CONCURRENT_BROWSER_MANAGEMENT_BACKEND =
  "Concurrent Browser Management (Backend)";
export const TECH_SCREENSHOT_AUTOMATION_BACKEND = "Screenshot Automation (Backend)";
export const TECH_NEXUS_BACKEND = "Nexus (Backend)";
export const TECH_REDIS_BACKEND = "Redis (Backend)";
export const TECH_AWS_SQS_BACKEND = "AWS SQS (Backend)";
export const TECH_AWS_S3_BACKEND = "AWS S3 (Backend)";
export const TECH_REDIS_PUB_SUB_BACKEND = "Redis Pub/Sub (Backend)";
export const TECH_API_GATEWAY_BACKEND = "API Gateway (Backend)";
export const TECH_AWS_SNS_SQS_BACKEND = "AWS SNS/SQS (Backend)";
export const TECH_CLEAN_ARCHITECTURE_BACKEND = "Clean Architecture (Backend)";
export const TECH_ROLE_BASED_ACCESS_CONTROL_BACKEND =
  "Role-based Access Control (Backend)";
export const TECH_HARDWARE_INTEGRATION_BACKEND = "Hardware Integration (Backend)";
export const TECH_PDF_CSV_GENERATION_BACKEND = "PDF/CSV Generation (Backend)";
export const TECH_CIRCUIT_BREAKER_BACKEND = "Circuit Breaker (Backend)";
export const TECH_ASYNCHRONOUS_PROGRAMMING_BACKEND = "Asynchronous Programming (Backend)";
export const TECH_REACT_18 = "React 18";
export const TECH_ANT_DESIGN_BACKEND = "Ant Design (Backend)";
export const TECH_FEATURE_FLAGS_BACKEND = "Feature Flags (Backend)";
export const TECH_UI_UX_OPTIMIZATION_BACKEND = "UI/UX Optimization (Backend)";
export const TECH_SEO_OPTIMIZATION_BACKEND = "SEO Optimization (Backend)";
export const TECH_MOBILE_SCANNER_BACKEND = "Mobile Scanner (Backend)";
export const TECH_BLUETOOTH_PRINT_ESC_POS_BACKEND = "Bluetooth Print ESC/POS (Backend)";
export const TECH_DART_BACKEND = "Dart (Backend)";
export const TECH_CROSS_PLATFORM_BACKEND = "Cross-platform (Backend)";
export const TECH_PWA_BACKEND = "PWA (Backend)";
export const TECH_MICROSERVICES_ARCHITECTURE = "Microservices Architecture";
export const TECH_REAL_TIME_INVENTORY_MANAGEMENT_BACKEND =
  "Real-time Inventory Management (Backend)";
export const TECH_SERVERLESS_ARCHITECTURE_BACKEND = "Serverless Architecture (Backend)";
export const TECH_AWS_FREE_TIER_BACKEND = "AWS Free Tier (Backend)";
export const TECH_AWS_LAMBDA_BACKEND = "AWS Lambda (Backend)";
export const TECH_AWS_SES_BACKEND = "AWS SES (Backend)";
export const TECH_AWS_EC2_LAMBDAS_DYNAMODB_BACKEND =
  "AWS (EC2, Lambdas, DynamoDB) (Backend)";
export const TECH_COMPUTER_VISION_BACKEND = "Computer Vision (Backend)";
export const TECH_CONVERSATIONAL_AI_BACKEND = "Conversational AI (Backend)";
export const TECH_IMAGE_ANALYSIS_BACKEND = "Image Analysis (Backend)";
export const TECH_HUMAN_BEHAVIOR_SIMULATION_BACKEND =
  "Human Behavior Simulation (Backend)";
export const TECH_ANTI_DETECTION_TECHNIQUES_BACKEND =
  "Anti-Detection Techniques (Backend)";
export const TECH_TWILIO_API_BACKEND = "Twilio API (Backend)";
export const TECH_WHATSAPP_BUSINESS_API_BACKEND = "WhatsApp Business API (Backend)";
export const TECH_WHATSAPP_INTEGRATION_BACKEND = "WhatsApp Integration (Backend)";
export const TECH_GOOGLE_SHEETS_API_BACKEND = "Google Sheets API (Backend)";
export const TECH_GOOGLE_OAUTH2_BACKEND = "Google OAuth2 (Backend)";
export const TECH_AXIOS_HTTP_CLIENT_BACKEND = "Axios HTTP Client (Backend)";
export const TECH_BROWSER_POOL_MANAGEMENT_BACKEND = "Browser Pool Management (Backend)";
export const TECH_SHADOW_DOM_MANIPULATION_BACKEND = "Shadow DOM Manipulation (Backend)";
export const TECH_THREAD_MANAGEMENT_FRONTEND = "Thread Management (Frontend)";
export const TECH_HEALTH_MONITORING_FRONTEND = "Health Monitoring (Frontend)";
export const TECH_CONNECTION_POOLING_BACKEND = "Connection Pooling (Backend)";
export const TECH_VALIDATION_PIPES_FRONTEND = "Validation Pipes (Frontend)";
export const TECH_RATE_LIMITING_BACKEND = "Rate Limiting (Backend)";
export const TECH_ERROR_HANDLING_MIDDLEWARE_FRONTEND =
  "Error Handling Middleware (Frontend)";
export const TECH_MODULAR_ARCHITECTURE_FRONTEND = "Modular Architecture (Frontend)";
export const TECH_DATABASE_DESIGN_BACKEND = "Database Design (Backend)";
export const TECH_DEPENDENCY_INJECTION_BACKEND = "Dependency Injection (Backend)";
export const TECH_PERFORMANCE_OPTIMIZATION_FRONTEND =
  "Performance Optimization (Frontend)";
export const TECH_STYLED_COMPONENTS_FRONTEND = "Styled Components (Frontend)";
export const TECH_REACT_PARALLAX_FRONTEND = "React Parallax (Frontend)";
export const TECH_REACT_HELMET_FRONTEND = "React Helmet (Frontend)";
export const TECH_REACT_I18NEXT_FRONTEND = "React i18next (Frontend)";
export const TECH_GATSBY_PLUGINS_FRONTEND = "Gatsby Plugins (Frontend)";
export const TECH_BOOTSTRAP_FRONTEND = "Bootstrap (Frontend)";
export const TECH_CONTEXT_API_FRONTEND = "Context API (Frontend)";
export const TECH_USEREDUCER_FRONTEND = "useReducer (Frontend)";
export const TECH_REACT_ROUTER_DOM_FRONTEND = "React Router DOM (Frontend)";
export const TECH_REACT_NATIVE_MOBILE = "React Native (Mobile)";
export const TECH_DART_MOBILE = "Dart (Mobile)";
export const TECH_CROSS_PLATFORM_MOBILE = "Cross-platform (Mobile)";
export const TECH_MOBILE_SCANNER_MOBILE = "Mobile Scanner (Mobile)";
export const TECH_BLUETOOTH_PRINT_ESC_POS_MOBILE = "Bluetooth Print ESC/POS (Mobile)";
export const TECH_PWA_MOBILE = "PWA (Mobile)";

export const TECH_STACK_COLORS: Record<string, string> = {
  [TECH_REACT]: "bg-blue-100 text-blue-800",
  [TECH_NEXTJS]: "bg-black text-white",
  [TECH_TYPESCRIPT]: "bg-blue-100 text-blue-800",
  [TECH_JAVASCRIPT]: "bg-yellow-100 text-yellow-800",
  [TECH_GRAPHQL]: "bg-pink-100 text-pink-800",
  [TECH_FLUTTER]: "bg-cyan-100 text-cyan-800",
  [TECH_SUPABASE]: "bg-emerald-100 text-emerald-800",
  [TECH_POSTGRESQL]: "bg-indigo-100 text-indigo-800",
  [TECH_APOLLO_CLIENT]: "bg-purple-100 text-purple-800",
  [TECH_APOLLO_SERVER]: "bg-purple-100 text-purple-800",
  [TECH_EXPRESS]: "bg-gray-100 text-gray-800",
  [TECH_PRISMA]: "bg-teal-100 text-teal-800",
  [TECH_WEBSOCKETS]: "bg-violet-100 text-violet-800",
  [TECH_GIT]: "bg-orange-100 text-orange-800",
  [TECH_GITHUB_ACTIONS]: "bg-gray-100 text-gray-800",
  [TECH_PHP]: "bg-indigo-100 text-indigo-800",
  [TECH_WORDPRESS]: "bg-blue-100 text-blue-800",
  [TECH_CSS]: "bg-blue-100 text-blue-800",
  [TECH_HTML]: "bg-orange-100 text-orange-800",
  [TECH_ANGULAR]: "bg-red-100 text-red-800",
  [TECH_JIRA]: "bg-blue-100 text-blue-800",

  // Additional technologies from resume.json
  [TECH_NESTJS]: "bg-red-100 text-red-800",
  [TECH_NODEJS]: "bg-green-100 text-green-800",
  [TECH_PUPPETEER]: "bg-blue-200 text-blue-800",
  [TECH_PUPPETEER_ADVANCED]: "bg-blue-300 text-blue-800",
  [TECH_TWILIO_API]: "bg-purple-200 text-purple-800",
  [TECH_BROWSER_POOL_MANAGEMENT]: "bg-gray-200 text-gray-800",
  [TECH_SHADOW_DOM_MANIPULATION]: "bg-indigo-200 text-indigo-800",
  [TECH_THREAD_MANAGEMENT]: "bg-yellow-200 text-yellow-800",
  [TECH_HEALTH_MONITORING]: "bg-green-200 text-green-800",
  [TECH_CONNECTION_POOLING]: "bg-teal-200 text-teal-800",
  [TECH_VALIDATION_PIPES]: "bg-pink-200 text-pink-800",
  [TECH_RATE_LIMITING]: "bg-orange-200 text-orange-800",
  [TECH_NEXUS]: "bg-purple-100 text-purple-800",
  [TECH_REDIS]: "bg-red-200 text-red-800",
  [TECH_MICROSERVICES]: "bg-blue-300 text-blue-800",
  [TECH_SERVERLESS_ARCHITECTURE]: "bg-gray-300 text-gray-800",
  [TECH_TDD]: "bg-green-300 text-green-800",
  [TECH_CIRCUIT_BREAKER_PATTERN]: "bg-yellow-300 text-yellow-800",
  [TECH_AWS_LAMBDA]: "bg-orange-300 text-orange-800",
  [TECH_AWS_SNS]: "bg-yellow-400 text-yellow-800",
  [TECH_AWS_SQS]: "bg-orange-400 text-orange-800",
  [TECH_GATSBY]: "bg-purple-300 text-purple-800",
  [TECH_REACT_I18NEXT]: "bg-blue-400 text-blue-800",
  [TECH_STYLED_COMPONENTS]: "bg-pink-300 text-pink-800",
  [TECH_REACT_PARALLAX]: "bg-indigo-300 text-indigo-800",
  [TECH_REACT_HELMET]: "bg-indigo-400 text-indigo-800",
  [TECH_GATSBY_PLUGINS]: "bg-purple-400 text-purple-800",
  [TECH_BOOTSTRAP]: "bg-purple-100 text-purple-800",
  [TECH_ANT_DESIGN]: "bg-blue-400 text-blue-800",
  [TECH_CONTEXT_API]: "bg-gray-400 text-gray-800",
  [TECH_ESLINT]: "bg-purple-400 text-purple-800",
  [TECH_PRETTIER]: "bg-yellow-500 text-yellow-800",
  [TECH_HUSKY]: "bg-orange-500 text-orange-800",
  [TECH_VITEST]: "bg-yellow-600 text-yellow-800",
  [TECH_WEBPACK]: "bg-blue-600 text-blue-200",
  [TECH_CHROME_DEVTOOLS]: "bg-green-400 text-green-800",
  [TECH_METODOLOGIAS_AGILES]: "bg-teal-300 text-teal-800",
  [TECH_CI_CD]: "bg-blue-600 text-blue-200",
  [TECH_DART]: "bg-cyan-200 text-cyan-800",
  [TECH_REACT_NATIVE]: "bg-cyan-300 text-cyan-800",
  [TECH_AWS_FREE_TIER]: "bg-gray-500 text-gray-800",
  [TECH_AWS_SES]: "bg-orange-600 text-orange-800",
  [TECH_API_GATEWAY]: "bg-purple-600 text-purple-800",
  [TECH_AGILE_SCRUM]: "bg-green-500 text-green-800",
  [TECH_CODE_REFACTORING]: "bg-gray-600 text-gray-800",
  [TECH_COMPUTER_VISION]: "bg-indigo-400 text-indigo-800",
  [TECH_CONVERSATIONAL_AI]: "bg-pink-400 text-pink-800",
  [TECH_CROSS_PLATFORM]: "bg-teal-400 text-teal-800",
  [TECH_DATABASE_DESIGN]: "bg-indigo-500 text-indigo-800",
  [TECH_DEPENDENCY_INJECTION]: "bg-yellow-700 text-yellow-800",
  [TECH_ERROR_HANDLING_MIDDLEWARE]: "bg-red-300 text-red-800",
  [TECH_HUMAN_BEHAVIOR_SIMULATION]: "bg-blue-800 text-blue-800",
  [TECH_ANTI_DETECTION_TECHNIQUES]: "bg-gray-700 text-gray-800",
  [TECH_IMAGE_ANALYSIS]: "bg-green-600 text-green-800",
  [TECH_MODULAR_ARCHITECTURE]: "bg-gray-700 text-gray-800",
  [TECH_OPENAI_API]: "bg-black text-white",
  [TECH_OPENAI_ASSISTANT_API]: "bg-black text-white",
  [TECH_OPENAI_VISION_API]: "bg-black text-white",
  [TECH_PERFORMANCE_OPTIMIZATION]: "bg-emerald-200 text-emerald-800",
  [TECH_PWA]: "bg-blue-900 text-blue-800",
  [TECH_REST_APIS]: "bg-gray-800 text-gray-800",
  [TECH_SCREENSHOT_AUTOMATION]: "bg-purple-700 text-purple-800",
  [TECH_SEO_OPTIMIZATION]: "bg-green-700 text-green-100",
  [TECH_WHATSAPP_INTEGRATION]: "bg-green-800 text-green-100",

  // Additional technologies from resume.json that were missing
  [TECH_SOCKET_IO]: "bg-violet-200 text-violet-800",
  [TECH_OPENAI_ASSISTANT_API_V2]: "bg-black text-white",
  [TECH_STRAPI_V5_23]: "bg-emerald-200 text-emerald-800",
  [TECH_HEADLESS_CMS]: "bg-emerald-300 text-emerald-800",
  [TECH_API_FIRST_ARCHITECTURE]: "bg-gray-400 text-gray-800",
  [TECH_CONTENT_MODELING]: "bg-indigo-300 text-indigo-800",
  [TECH_CMS_AUTHENTICATION]: "bg-purple-300 text-purple-800",
  [TECH_MEDIA_MANAGEMENT]: "bg-cyan-400 text-cyan-800",
  [TECH_SQLITE3]: "bg-indigo-200 text-indigo-800",
  [TECH_BETTER_SQLITE3]: "bg-indigo-300 text-indigo-800",
  [TECH_GOOGLE_OAUTH2]: "bg-green-300 text-green-800",
  [TECH_DART_3_4_1]: "bg-cyan-200 text-cyan-800",
  [TECH_MOBILE_SCANNER]: "bg-blue-500 text-blue-800",
  [TECH_BLUETOOTH_PRINT_ESC_POS]: "bg-blue-600 text-blue-800",
  [TECH_JEST]: "bg-red-400 text-red-800",
  [TECH_AXIOS_HTTP_CLIENT]: "bg-indigo-600 text-indigo-800",
  [TECH_WHATSAPP_BUSINESS_API]: "bg-green-800 text-green-100",
  [TECH_GOOGLE_SHEETS_API]: "bg-green-400 text-green-800",
  [TECH_AWS_S3]: "bg-orange-700 text-orange-800",
  [TECH_REDIS_PUB_SUB]: "bg-red-300 text-red-800",
  [TECH_CLEAN_ARCHITECTURE]: "bg-gray-800 text-gray-800",
  [TECH_ROLE_BASED_ACCESS_CONTROL]: "bg-purple-500 text-purple-800",
  [TECH_REAL_TIME_INVENTORY_MANAGEMENT]: "bg-emerald-400 text-emerald-800",
  [TECH_HARDWARE_INTEGRATION]: "bg-gray-600 text-gray-800",
  [TECH_PDF_CSV_GENERATION]: "bg-yellow-800 text-yellow-800",
  [TECH_CIRCUIT_BREAKER]: "bg-yellow-300 text-yellow-800",
  [TECH_ASYNCHRONOUS_PROGRAMMING]: "bg-blue-700 text-blue-800",
  [TECH_AWS_EC2_LAMBDAS_DYNAMODB]: "bg-orange-800 text-orange-800",
  [TECH_SERVERLESS]: "bg-gray-900 text-gray-800",
  [TECH_USEREDUCER]: "bg-gray-500 text-gray-800",
  [TECH_UI_UX_OPTIMIZATION]: "bg-teal-500 text-teal-800",
  [TECH_FEATURE_FLAGS]: "bg-indigo-700 text-indigo-800",
  [TECH_REACT_ROUTER_DOM]: "bg-blue-500 text-blue-800",
  [TECH_PROXY_ROTATION_IPROYAL]: "bg-gray-700 text-gray-800",
  [TECH_CONCURRENT_BROWSER_MANAGEMENT]: "bg-gray-800 text-gray-800",
  [TECH_NESTJS_SCRAPER_ARCHITECTURE]: "bg-red-200 text-red-800",
  [TECH_NEXUS_SCRAPER_ARCHITECTURE]: "bg-purple-200 text-purple-800",
  [TECH_MODULAR_ARCHITECTURE_BACKEND]: "bg-gray-800 text-gray-800",
  [TECH_ERROR_HANDLING_MIDDLEWARE_BACKEND]: "bg-red-400 text-red-800",
  [TECH_VALIDATION_PIPES_BACKEND]: "bg-pink-300 text-pink-800",
  [TECH_THREAD_MANAGEMENT_BACKEND]: "bg-yellow-300 text-yellow-800",
  [TECH_HEALTH_MONITORING_BACKEND]: "bg-green-300 text-green-800",
  [TECH_PERFORMANCE_OPTIMIZATION_BACKEND]: "bg-emerald-300 text-emerald-800",
  [TECH_ZOD_VALIDATION]: "bg-pink-400 text-pink-800",
  [TECH_SWAGGER_OPENAPI_DOCUMENTATION]: "bg-orange-400 text-orange-800",
  [TECH_NESTJS_SCRAPER_ARCHITECTURE_BACKEND]: "bg-red-300 text-red-800",
  [TECH_PROXY_ROTATION_IPROYAL_BACKEND]: "bg-gray-700 text-gray-800",
  [TECH_CONCURRENT_BROWSER_MANAGEMENT_BACKEND]: "bg-gray-800 text-gray-800",
  [TECH_SCREENSHOT_AUTOMATION_BACKEND]: "bg-purple-700 text-purple-800",
  [TECH_NEXUS_BACKEND]: "bg-purple-200 text-purple-800",
  [TECH_REDIS_BACKEND]: "bg-red-400 text-red-800",
  [TECH_AWS_SQS_BACKEND]: "bg-orange-500 text-orange-800",
  [TECH_AWS_S3_BACKEND]: "bg-orange-800 text-orange-800",
  [TECH_REDIS_PUB_SUB_BACKEND]: "bg-red-500 text-red-800",
  [TECH_API_GATEWAY_BACKEND]: "bg-purple-700 text-purple-800",
  [TECH_AWS_SNS_SQS_BACKEND]: "bg-yellow-500 text-yellow-800",
  [TECH_CLEAN_ARCHITECTURE_BACKEND]: "bg-gray-900 text-gray-800",
  [TECH_ROLE_BASED_ACCESS_CONTROL_BACKEND]: "bg-purple-600 text-purple-800",
  [TECH_HARDWARE_INTEGRATION_BACKEND]: "bg-gray-700 text-gray-800",
  [TECH_PDF_CSV_GENERATION_BACKEND]: "bg-yellow-900 text-yellow-800",
  [TECH_CIRCUIT_BREAKER_BACKEND]: "bg-yellow-400 text-yellow-800",
  [TECH_ASYNCHRONOUS_PROGRAMMING_BACKEND]: "bg-blue-800 text-blue-800",
  [TECH_REACT_18]: "bg-blue-200 text-blue-800",
  [TECH_ANT_DESIGN_BACKEND]: "bg-blue-500 text-blue-800",
  [TECH_FEATURE_FLAGS_BACKEND]: "bg-indigo-800 text-indigo-800",
  [TECH_UI_UX_OPTIMIZATION_BACKEND]: "bg-teal-600 text-teal-800",
  [TECH_SEO_OPTIMIZATION_BACKEND]: "bg-green-800 text-green-100",
  [TECH_MOBILE_SCANNER_BACKEND]: "bg-blue-600 text-blue-800",
  [TECH_BLUETOOTH_PRINT_ESC_POS_BACKEND]: "bg-blue-700 text-blue-800",
  [TECH_DART_BACKEND]: "bg-cyan-300 text-cyan-800",
  [TECH_CROSS_PLATFORM_BACKEND]: "bg-teal-500 text-teal-800",
  [TECH_PWA_BACKEND]: "bg-blue-950 text-blue-800",
  [TECH_MICROSERVICES_ARCHITECTURE]: "bg-blue-400 text-blue-800",
  [TECH_REAL_TIME_INVENTORY_MANAGEMENT_BACKEND]:
    "bg-emerald-500 text-emerald-800",
  [TECH_SERVERLESS_ARCHITECTURE_BACKEND]: "bg-gray-400 text-gray-800",
  [TECH_AWS_FREE_TIER_BACKEND]: "bg-gray-600 text-gray-800",
  [TECH_AWS_LAMBDA_BACKEND]: "bg-orange-400 text-orange-800",
  [TECH_AWS_SES_BACKEND]: "bg-orange-700 text-orange-800",
  [TECH_AWS_EC2_LAMBDAS_DYNAMODB_BACKEND]: "bg-orange-900 text-orange-800",
  [TECH_COMPUTER_VISION_BACKEND]: "bg-indigo-500 text-indigo-800",
  [TECH_CONVERSATIONAL_AI_BACKEND]: "bg-pink-500 text-pink-800",
  [TECH_IMAGE_ANALYSIS_BACKEND]: "bg-green-700 text-green-800",
  [TECH_HUMAN_BEHAVIOR_SIMULATION_BACKEND]: "bg-blue-900 text-blue-800",
  [TECH_ANTI_DETECTION_TECHNIQUES_BACKEND]: "bg-gray-800 text-gray-800",
  [TECH_TWILIO_API_BACKEND]: "bg-purple-300 text-purple-800",
  [TECH_WHATSAPP_BUSINESS_API_BACKEND]: "bg-green-900 text-green-100",
  [TECH_WHATSAPP_INTEGRATION_BACKEND]: "bg-green-950 text-green-100",
  [TECH_GOOGLE_SHEETS_API_BACKEND]: "bg-green-500 text-green-800",
  [TECH_GOOGLE_OAUTH2_BACKEND]: "bg-green-400 text-green-800",
  [TECH_AXIOS_HTTP_CLIENT_BACKEND]: "bg-indigo-700 text-indigo-800",
  [TECH_BROWSER_POOL_MANAGEMENT_BACKEND]: "bg-gray-300 text-gray-800",
  [TECH_SHADOW_DOM_MANIPULATION_BACKEND]: "bg-indigo-300 text-indigo-800",
  [TECH_THREAD_MANAGEMENT_FRONTEND]: "bg-yellow-400 text-yellow-800",
  [TECH_HEALTH_MONITORING_FRONTEND]: "bg-green-400 text-green-800",
  [TECH_CONNECTION_POOLING_BACKEND]: "bg-teal-300 text-teal-800",
  [TECH_VALIDATION_PIPES_FRONTEND]: "bg-pink-400 text-pink-800",
  [TECH_RATE_LIMITING_BACKEND]: "bg-orange-300 text-orange-800",
  [TECH_ERROR_HANDLING_MIDDLEWARE_FRONTEND]: "bg-red-500 text-red-800",
  [TECH_MODULAR_ARCHITECTURE_FRONTEND]: "bg-gray-600 text-gray-800",
  [TECH_DATABASE_DESIGN_BACKEND]: "bg-indigo-600 text-indigo-800",
  [TECH_DEPENDENCY_INJECTION_BACKEND]: "bg-yellow-800 text-yellow-800",
  [TECH_PERFORMANCE_OPTIMIZATION_FRONTEND]: "bg-emerald-400 text-emerald-800",
  [TECH_STYLED_COMPONENTS_FRONTEND]: "bg-pink-400 text-pink-800",
  [TECH_REACT_PARALLAX_FRONTEND]: "bg-indigo-400 text-indigo-800",
  [TECH_REACT_HELMET_FRONTEND]: "bg-indigo-500 text-indigo-800",
  [TECH_REACT_I18NEXT_FRONTEND]: "bg-blue-500 text-blue-800",
  [TECH_GATSBY_PLUGINS_FRONTEND]: "bg-purple-500 text-purple-800",
  [TECH_BOOTSTRAP_FRONTEND]: "bg-purple-200 text-purple-800",
  [TECH_CONTEXT_API_FRONTEND]: "bg-gray-500 text-gray-800",
  [TECH_USEREDUCER_FRONTEND]: "bg-gray-600 text-gray-800",
  [TECH_REACT_ROUTER_DOM_FRONTEND]: "bg-blue-600 text-blue-800",
  [TECH_REACT_NATIVE_MOBILE]: "bg-cyan-400 text-cyan-800",
  [TECH_DART_MOBILE]: "bg-cyan-500 text-cyan-800",
  [TECH_CROSS_PLATFORM_MOBILE]: "bg-teal-600 text-teal-800",
  [TECH_MOBILE_SCANNER_MOBILE]: "bg-blue-700 text-blue-800",
  [TECH_BLUETOOTH_PRINT_ESC_POS_MOBILE]: "bg-blue-800 text-blue-800",
  [TECH_PWA_MOBILE]: "bg-blue-900 text-blue-100",
  [TECH_GRAPHQL_SUBSCRIPTIONS]: "bg-pink-200 text-pink-800",
  [TECH_EXPRESS_JS]: "bg-gray-200 text-gray-800",
  [TECH_PRISMA_ORM]: "bg-teal-200 text-teal-800",
};

export const professionalExperienceText = "Experiencia Profesional";
export const certificationsText = "Certificaciones";

export const awardsText = "Logros destacados";

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  textColor: string;
  icon: string;
}
export const generateBlogConceptCards = (): CardData[] =>
  Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    title: `Concepto ${i + 1}`,
    subtitle: `Descripción del concepto ${i + 1}`,
    color: `hsl(${(i * 30) % 360}, 70%, 60%)`,
    textColor: "#ffffff",
    icon: "🧠",
  }));

export const cards: CardData[] = generateBlogConceptCards();

// Experiencia Profesional
export const AboutMeTitle = "Experiencia Profesional";
// export const AboutMeDescription = "Full"
