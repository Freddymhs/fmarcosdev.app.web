import { tv } from "tailwind-variants";
import { Link, useLocation } from "react-router";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { NAVIGATION_PAGES, HOME_PAGE } from "../../../constants";

// ESTILOS PARA EL NUEVO FOOTER
const FooterContainerStyles = tv({
  base: `
    flex w-full
    bg-card-background
    border-t border-separator
    transition-all duration-300 ease-in-out
  `,
});

const FooterContentStyles = tv({
  base: "flex items-stretch w-full min-h-[60px]",
});

const NavButtonStyles = tv({
  base: `
    px-6 py-4 font-medium transition-all duration-200 flex items-center justify-center
    text-sm md:text-base
    no-underline
  `,
  variants: {
    variant: {
      primary: "bg-accent-green text-background-main shadow-sm",
      secondary: "",
    },
    border: {
      right: "border-r border-separator",
      left: "border-l border-separator",
    },
    active: {
      true: "bg-accent-green text-background-main shadow-sm",
      false: "text-text-secondary hover:text-text-primary hover:bg-separator",
    },
  },
  compoundVariants: [
    {
      variant: "secondary",
      active: false,
      class: "hover:text-text-primary hover:bg-separator",
    },
  ],
});

const UrlDisplayStyles = tv({
  base: `
    bg-card-background text-text-secondary 
    px-6 py-4 flex items-center justify-center 
    text-xs md:text-sm ml-auto
    border-l border-separator
    transition-colors duration-200 hover:text-text-primary
  `,
});

// COMPONENTE PRINCIPAL
const NavigationFooter = () => {
  const { isDesktop } = useMediaQuery();
  const location = useLocation();

  // Solo mostrar el footer cuando el MenuButton no es visible (en desktop)
  if (!isDesktop) {
    return null;
  }

  // Generar la URL completa basada en la ubicación actual
  const getCurrentUrl = () => {
    return `https://www.fmarcos.dev${location.pathname}`;
  };

  // Encontrar la página activa
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Páginas de navegación para el footer (mismas que el sidebar)
  const footerNavigationPages = NAVIGATION_PAGES;

  return (
    <footer className={FooterContainerStyles()}>
      <div className={FooterContentStyles()}>
        {/* Mapeo de páginas de navegación */}
        {footerNavigationPages.map(({ to, label }, index) => {
          const isActivePage = isActive(to);

          // El primer elemento es primary (igual que en el sidebar)
          // Pero solo debe tener el estilo primary cuando está activo
          const isPrimary = index === 0;
          const hasRightBorder = index < footerNavigationPages.length - 1;

          // Para el botón primary, solo mostrar estilo especial cuando está activo
          const showPrimaryStyle = isPrimary && isActivePage;
          const showActiveStyle = isActivePage;

          return (
            <Link
              key={to}
              to={to}
              className={NavButtonStyles({
                variant: showPrimaryStyle ? "primary" : "secondary",
                border: hasRightBorder ? "right" : undefined,
                active: showActiveStyle,
              })}
            >
              {to.replace("/", "")}
            </Link>
          );
        })}

        {/* Website URL - Right aligned */}
        <div className={UrlDisplayStyles()}>{getCurrentUrl()}</div>
      </div>
    </footer>
  );
};

export default NavigationFooter;
