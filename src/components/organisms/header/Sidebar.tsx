import { FC } from "react";
import { tv } from "tailwind-variants";
import { Link, useLocation } from "react-router";
import { X } from "lucide-react";
import { NAVIGATION_PAGES } from "../../../constants";
import useResumeData from "../../../hooks/useResumeData";
import { ContactInfoList } from "../header/ContactInfoList";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

export const SideBar: FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const { name, label } = useResumeData();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarContainerStyle({ open })}>
        {/* Header del Sidebar */}
        <div className="flex-shrink-0 p-4 border-b border-separator bg-just-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-text-primary">{name}</h2>
              <p className="text-sm text-text-secondary font-mono">{label}</p>
            </div>
            <button
              onClick={onClose}
              className={closeButtonStyle()}
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto bg-background-main">
          {/* 1. PÁGINAS PRIMERO - Más importante para navegación */}
          <div className="p-4">
            <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">
              Páginas
            </h3>
            <nav>
              <ul className="space-y-1">
                {NAVIGATION_PAGES.map(({ to, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        className={navItemStyle({ isActive })}
                        onClick={onClose}
                      >
                        <span>{label}</span>
                        {isActive && (
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* 2. CONTACTO SEGUNDO */}
          <div className="p-4 border-t border-separator">
            <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">
              Contacto
            </h3>
            <ContactInfoList vertical={true} />
          </div>
        </div>
      </div>
    </>
  );
};

// ESTILOS
const sidebarContainerStyle = tv({
  base: `
    fixed top-0 left-0 h-full w-80 max-w-[90vw] z-50
    transform transition-transform duration-300 ease-in-out
    shadow-2xl lg:hidden flex flex-col
    bg-background-main
  `,
  variants: {
    open: {
      true: "translate-x-0",
      false: "-translate-x-full",
    },
  },
});

const closeButtonStyle = tv({
  base: `
    flex items-center justify-center
    w-7 h-7 text-text-secondary hover:text-text-primary
    hover:bg-separator rounded-md
    transition-all duration-200
  `,
});

const navItemStyle = tv({
  base: `
    w-full flex items-center justify-between
    px-3 py-2.5 rounded-lg
    text-left font-medium text-sm
    transition-all duration-200
    no-underline
  `,
  variants: {
    isActive: {
      true: "bg-accent-green text-background-main shadow-sm",
      false: "text-text-secondary hover:text-text-primary hover:bg-separator",
    },
  },
});
