// ./helper.ts - Header Helper Functions

/**
 * Calcula las dimensiones del header basado en la altura total y el dispositivo
 * @param headerHeight - Altura total del header en vh
 * @param isDesktop - Si es dispositivo desktop o mobile
 * @returns Objeto con las alturas calculadas para cada sección
 */
export const calculateHeaderDimensions = (
  headerHeight: number,
  isDesktop: boolean
) => {
  // En desktop, el header puede ser más compacto
  // En mobile, necesita más espacio para touch targets
  const deviceMultiplier = isDesktop
    ? HEADER_CONFIG.DESKTOP_RATIO
    : HEADER_CONFIG.MOBILE_RATIO;

  // Altura principal del contenedor
  const mainHeight = Math.max(headerHeight, HEADER_CONFIG.MIN_HEIGHT);

  // Altura del contenido interno (puede ser diferente para optimizar espacios)
  const contentHeight = mainHeight * deviceMultiplier;

  // Altura específica para el área de contacto (si se necesita)
  const contactAreaHeight = isDesktop ? contentHeight * 0.8 : contentHeight;

  // Altura del botón de menú en mobile
  const menuButtonHeight = isDesktop
    ? 0
    : Math.max(contentHeight, HEADER_CONFIG.MIN_MENU_HEIGHT);

  return {
    mainHeight,
    contentHeight,
    contactAreaHeight,
    menuButtonHeight,
  };
};

/**
 * Determina si el header debe ser sticky basado en la ruta actual
 * @param pathname - Ruta actual
 * @returns Boolean indicando si debe ser sticky
 */
export const shouldHeaderBeSticky = (pathname: string): boolean => {
  const stickyRoutes = ["/blog", "/portfolio", "/contact"];
  return stickyRoutes.includes(pathname);
};

/**
 * Calcula el z-index apropiado para el header
 * @param isMenuOpen - Si el menú está abierto
 * @param isSticky - Si el header es sticky
 * @returns Z-index calculado
 */
export const calculateHeaderZIndex = (
  isMenuOpen: boolean,
  isSticky: boolean
): number => {
  let zIndex = HEADER_CONFIG.BASE_Z_INDEX;

  if (isSticky) zIndex += 10;
  if (isMenuOpen) zIndex += 20;

  return zIndex;
};

// Actualización para HEADER_CONFIG en Header.tsx

const HEADER_CONFIG = {
  MIN_HEIGHT: 20,
  MIN_MENU_HEIGHT: 16, // Altura mínima del botón de menú en mobile
  DESKTOP_RATIO: 0.9, // Ratio para desktop (más compacto)
  MOBILE_RATIO: 1.0, // Ratio para mobile (altura completa)
  BASE_Z_INDEX: 1000, // Z-index base para el header
  ANIMATION_DURATION: 200,
} as const;

export { HEADER_CONFIG };
