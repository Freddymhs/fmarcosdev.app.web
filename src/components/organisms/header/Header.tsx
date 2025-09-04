// 1. IMPORTS (externo → interno, por nivel de abstracción)
import { useRef } from "react";
import { tv } from "tailwind-variants";

import useMediaQuery from "../../../hooks/useMediaQuery";
import useResumeData from "../../../hooks/useResumeData";
import { ContactInfoList } from "./ContactInfoList";

import { HeaderAreaProps, MenuButtonProps } from "./types";

// Props para comunicarse con MainLayout
interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

// 3. ESTILOS SIMPLES Y HERMOSOS - SOLO TAILWIND
const HeaderStyles = tv({
  base: `
    w-full h-full flex items-center justify-between
    px-4 sm:px-6 lg:px-8
    bg-just-white border-b border-separator
  `,
});

const BrandSectionStyles = tv({
  base: "flex items-center gap-3 flex-shrink-0",
});

const BrandNameStyles = tv({
  base: "font-bold text-text-primary tracking-tight text-xl sm:text-2xl lg:text-3xl",
});

const BrandSubtitleStyles = tv({
  base: "text-text-secondary font-mono text-xs hidden sm:block mt-0.5",
});

// USAR TAILWIND RESPONSIVE - Mucho más simple
const ContactSectionStyles = tv({
  base: "hidden md:flex items-center flex-1 justify-end", // md:flex = mostrar desde 768px
});

const MenuButtonStyles = tv({
  base: `
    flex md:hidden items-center justify-center
    w-10 h-10 bg-accent-green text-background-main
    font-bold text-lg rounded-lg
    hover:bg-text-primary hover:scale-105
    transition-all duration-200
    shadow-md hover:shadow-lg
  `,
  variants: {
    isOpen: {
      true: "bg-text-primary scale-95",
      false: "bg-accent-green",
    },
  },
});

// 4. COMPONENTES USANDO DATOS DEL RESUME
const BrandSection = () => {
  const { name, label } = useResumeData();
  
  return (
    <div className={BrandSectionStyles()}>
      <div className="flex flex-col">
        <h1 className={BrandNameStyles()}>
          {name}
        </h1>
        <p className={BrandSubtitleStyles()}>
          {label}
        </p>
      </div>
    </div>
  );
};

const MenuButton = ({ onClick, isOpen }: MenuButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className={MenuButtonStyles({ isOpen })}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
    >
      <span className="transform transition-transform duration-200">
        {isOpen ? "✕" : "☰"}
      </span>
    </button>
  );
};

const ContactSection = () => {
  return (
    <div className={ContactSectionStyles()}>
      <ContactInfoList />
    </div>
  );
};

// 5. COMPONENTE PRINCIPAL - SÚPER SIMPLE
const Header = ({ onToggleSidebar, sidebarOpen = false }: HeaderProps = {}) => {
  const headerRef = useRef<HTMLElement>(null);

  return (
    <div ref={headerRef} className={HeaderStyles()}>
      {/* Brand - Datos del resume.json */}
      <BrandSection />
      
      {/* Contactos - Solo desktop (md:flex) */}
      <ContactSection />
      
      {/* Botón menú - Solo mobile (flex md:hidden) */}
      <MenuButton onClick={onToggleSidebar} isOpen={sidebarOpen} />
    </div>
  );
};

export default Header;
