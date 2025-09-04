import { tv } from "tailwind-variants";
import { useLocation } from "react-router";
import { BLOG_PAGE } from "../../../constants";
import { isEqualName } from "../../helpers";
import useMediaQuery from "../../../hooks/useMediaQuery";

interface FooterAreaProps {
  isDesktop: boolean;
  showContactInfo: boolean;
  children: React.ReactNode;
}

// ESTILOS MEJORADOS
const FooterContainerStyles = tv({
  base: `
    flex w-full h-full 
    bg-gradient-to-r from-footer-dark to-accent-green
    transition-all duration-300 ease-in-out
    border-t border-separator
  `,
  variants: {
    isDesktop: {
      true: "flex-row items-center justify-between px-8 lg:px-12",
      false: "flex-col justify-center items-center py-4 gap-3",
    },
  },
});

const FooterSectionStyles = tv({
  base: "flex items-center gap-4",
  variants: {
    section: {
      brand: "flex-1 justify-start",
      center: "flex-1 justify-center",
      social: "flex-1 justify-end",
    },
    mobile: {
      true: "justify-center flex-none",
      false: "",
    },
  },
});

const FooterTextStyles = tv({
  base: "text-background-main font-medium",
  variants: {
    variant: {
      copyright: "text-sm opacity-90",
      brand: "text-lg font-bold tracking-tight",
      subtitle: "text-xs opacity-75 font-mono",
      social: "text-sm hover:text-highlight-yellow transition-colors cursor-pointer",
    },
  },
});

const SocialLinkStyles = tv({
  base: `
    flex items-center justify-center
    w-8 h-8 rounded-full
    bg-background-main/10 hover:bg-background-main/20
    text-background-main hover:text-highlight-yellow
    transition-all duration-200
    hover:scale-110
  `,
});

// COMPONENTES INTERNOS
const BrandSection = ({ isDesktop }: { isDesktop: boolean }) => {
  return (
    <div className={FooterSectionStyles({ 
      section: "brand", 
      mobile: !isDesktop 
    })}>
      <div className="flex flex-col items-center md:items-start">
        <span className={FooterTextStyles({ variant: "brand" })}>
          FM
        </span>
        <span className={FooterTextStyles({ variant: "subtitle" })}>
          fullstack developer
        </span>
      </div>
    </div>
  );
};

const CopyrightSection = ({ isDesktop }: { isDesktop: boolean }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className={FooterSectionStyles({ 
      section: "center", 
      mobile: !isDesktop 
    })}>
      <span className={FooterTextStyles({ variant: "copyright" })}>
        © {currentYear} Freddy Marcos • Hecho con ❤️ y React
      </span>
    </div>
  );
};

const SocialSection = ({ isDesktop }: { isDesktop: boolean }) => {
  const socialLinks = [
    { 
      name: "GitHub", 
      href: "https://github.com/fmarcosdev", 
      icon: "⚡" 
    },
    { 
      name: "LinkedIn", 
      href: "https://linkedin.com/in/fmarcosdev", 
      icon: "💼" 
    },
    { 
      name: "Email", 
      href: "mailto:hello@fmarcosdev.com", 
      icon: "✉️" 
    },
  ];

  if (!isDesktop) {
    return (
      <div className="flex gap-4 mt-2">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={SocialLinkStyles()}
            aria-label={link.name}
          >
            <span className="text-sm">{link.icon}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={FooterSectionStyles({ 
      section: "social", 
      mobile: false 
    })}>
      <div className="flex gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={FooterTextStyles({ variant: "social" })}
          >
            {link.icon} {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL MEJORADO
const Footer = () => {
  const { isDesktop } = useMediaQuery();
  const location = useLocation();

  const showContactInfo = isEqualName(location.pathname, BLOG_PAGE);

  const FooterArea = ({
    isDesktop,
    children,
  }: Omit<FooterAreaProps, 'showContactInfo'>) => {
    return (
      <div className={FooterContainerStyles({ isDesktop })}>
        {children}
      </div>
    );
  };

  const FooterContent = () => {
    if (isDesktop) {
      return (
        <>
          <BrandSection isDesktop={isDesktop} />
          <CopyrightSection isDesktop={isDesktop} />
          <SocialSection isDesktop={isDesktop} />
        </>
      );
    }

    return (
      <>
        <BrandSection isDesktop={isDesktop} />
        <CopyrightSection isDesktop={isDesktop} />
        <SocialSection isDesktop={isDesktop} />
      </>
    );
  };

  return (
    <FooterArea isDesktop={isDesktop}>
      <FooterContent />
    </FooterArea>
  );
};

export default Footer;
