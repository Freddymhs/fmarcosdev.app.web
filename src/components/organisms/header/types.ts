// ./types.ts - Header Types

import { ReactNode } from "react";

/**
 * Props principales del componente Header
 */
export interface HeaderProps {
  /** Habilita el modo debug para mostrar información de desarrollo */
  debug?: boolean;
  /** Altura del header en vh (viewport height) */
  headerHeight?: number;
  /** Clase CSS adicional para el contenedor */
  className?: string;
  /** Si el header debe ser sticky */
  isSticky?: boolean;
}

/**
 * Props para el botón de menú mobile
 */
export interface MenuButtonProps {
  /** Función que se ejecuta al hacer click en el botón */
  onClick: () => void;
  /** Estado del menú (abierto/cerrado) */
  isOpen: boolean;
  /** Texto personalizado para el botón */
  buttonText?: string;
  /** Si el botón está deshabilitado */
  disabled?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Props para el área contenedora del header
 */
export interface HeaderAreaProps {
  /** Contenido hijo del header */
  children: ReactNode;
  /** Si debe mostrar la información de contacto */
  showContactInfo: boolean;
  /** Habilita el modo debug */
  isDebugMode?: boolean;
  /** Si es dispositivo desktop */
  isDesktop?: boolean;
  /** Altura del área en vh */
  height?: number;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Props para la sección de contacto
 */
export interface ContactSectionProps {
  /** Si es dispositivo desktop */
  isDesktop: boolean;
  /** Si debe mostrar la sección */
  show: boolean;
  /** Altura específica para la sección */
  height?: number;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Props para componentes de navegación del header
 */
export interface HeaderNavigationProps {
  /** Si es dispositivo desktop */
  isDesktop: boolean;
  /** Ruta actual */
  currentPath: string;
  /** Si el menú móvil está abierto */
  isMenuOpen?: boolean;
  /** Función para cerrar el menú */
  onCloseMenu?: () => void;
}

/**
 * Configuración de dimensiones calculadas del header
 */
export interface HeaderDimensions {
  /** Altura principal del header */
  mainHeight: number;
  /** Altura del contenido interno */
  contentHeight: number;
  /** Altura del área de contacto */
  contactAreaHeight: number;
  /** Altura del botón de menú */
  menuButtonHeight: number;
}

/**
 * Estados posibles del header
 */
export type HeaderState = "default" | "sticky" | "hidden" | "transparent";

/**
 * Configuración del header por página
 */
export interface HeaderPageConfig {
  /** Mostrar información de contacto */
  showContactInfo: boolean;
  /** Estado del header en esta página */
  state: HeaderState;
  /** Altura personalizada */
  customHeight?: number;
}
