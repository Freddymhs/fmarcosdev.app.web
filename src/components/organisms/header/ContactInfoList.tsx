import { tv } from "tailwind-variants";
import { useState } from "react";
import useResumeData from "../../../hooks/useResumeData";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  Download,
  Copy,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
  Globe,
  Code,
  Trophy,
} from "lucide-react";
import cv from "../../../generate-resume-files-by-workflow/cv.pdf";

interface ContactInfoListProps {
  vertical?: boolean;
}

export const ContactInfoList = ({ vertical = false }: ContactInfoListProps) => {
  const { isDesktop, isLargeDesktop } = useMediaQuery();
  const { getContactsBySpace } = useResumeData();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 600);
  };

  const handleDownload = async () => {
    const response = await fetch(cv);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "CV_Fullstack_Freddy_Marcos.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Función para obtener el icono correcto según el tipo
  const getContactIcon = (type: string) => {
    switch (type) {
      case "mail":
        return <Mail size={14} />;
      case "linkedin":
        return <Linkedin size={14} />;
      case "github":
        return <Github size={14} />;
      case "portfolio":
        return <Code size={14} />;
      case "website":
        return <Globe size={14} />;
      case "hackerrank":
        return <Trophy size={14} />;
      default:
        return <ExternalLink size={14} />;
    }
  };

  // LÓGICA INTELIGENTE MEJORADA: Según el breakpoint
  const getMaxContactsForSpace = () => {
    if (vertical) {
      return 6; // Sidebar: todos
    }

    if (isLargeDesktop) {
      // 1250px+: Espacio suficiente para todos los contactos con texto
      return 3; // email + linkedin + github + portfolio + website + hackerrank
    } else if (isDesktop) {
      // 1024px+: Desktop normal, solo iconos
      return 4; // email + linkedin + github + portfolio
    } else {
      // Mobile/Tablet: espacio muy limitado
      return 2; // solo email + linkedin
    }
  };

  const maxContacts = getMaxContactsForSpace();
  const contacts = getContactsBySpace(maxContacts);

  // Determinar si mostrar texto según el breakpoint
  const showText = vertical || isLargeDesktop;

  const contactItems = contacts.map(({ name, url, type }) => {
    const isEmail = url.includes("@");
    const href = isEmail ? `mailto:${url}` : url;
    const isCopied = copiedId === url;

    return (
      <div key={url} className={contactItemWrapperStyle({ vertical })}>
        <a
          href={href}
          target={isEmail ? "_self" : "_blank"}
          rel={isEmail ? "" : "noopener noreferrer"}
          className={contactLinkStyle({ vertical, showText })}
          title={!showText ? `${type}: ${url}` : undefined}
        >
          {getContactIcon(type)}
          {showText && (
            <span className={contactNameStyle({ vertical })}>{name}</span>
          )}
        </a>
        <button
          className={copyButtonStyle({ vertical, copied: isCopied })}
          onClick={() => handleCopy(url, url)}
          title="Copiar"
        >
          <Copy size={12} />
        </button>
      </div>
    );
  });

  return (
    <div className={containerStyle({ vertical })}>
      {contactItems}

      <button
        onClick={handleDownload}
        className={downloadCvStyle({ vertical })}
      >
        <Download size={14} />
        <span className={downloadTextStyle({ vertical })}>
          {vertical || isLargeDesktop ? "Download CV" : "CV"}
        </span>
      </button>
    </div>
  );
};

// ESTILOS ACTUALIZADOS PARA BREAKPOINT 1250px+
const containerStyle = tv({
  base: "flex items-center",
  variants: {
    vertical: {
      true: "flex-col gap-3 w-full", // Sidebar: vertical
      false: "flex-row gap-1 xl:gap-2", // Header: más gap en pantallas grandes
    },
  },
});

const contactItemWrapperStyle = tv({
  base: "flex items-center",
  variants: {
    vertical: {
      true: "gap-2 w-full", // Sidebar: full width
      false: "gap-1", // Header: compacto
    },
  },
});

const contactLinkStyle = tv({
  base: `
    flex items-center gap-1.5 px-2 py-1.5
    text-text-secondary hover:text-accent-green
    border border-separator hover:border-accent-green
    rounded-md hover:bg-accent-green/5
    transition-all duration-200
    font-medium no-underline
  `,
  variants: {
    vertical: {
      true: "text-sm flex-1", // Sidebar: grande con texto
      false: "text-xs", // Header: varía según showText
    },
    showText: {
      true: "", // Mostrar texto: tamaño normal
      false: "w-8 h-8 p-1 justify-center", // Solo icono: cuadrado
    },
  },
  compoundVariants: [
    {
      vertical: false,
      showText: true,
      class: "px-3 py-1.5 min-w-fit", // Header con texto: más padding
    },
  ],
});

const contactNameStyle = tv({
  base: "font-medium truncate",
  variants: {
    vertical: {
      true: "max-w-[200px]", // Sidebar: espacio normal
      false: "max-w-[100px]", // Header: más compacto
    },
  },
});

const copyButtonStyle = tv({
  base: `
    flex items-center justify-center
    text-text-secondary hover:text-accent-green
    border border-separator hover:border-accent-green
    rounded-md hover:bg-accent-green/5
    transition-all duration-200 flex-shrink-0
  `,
  variants: {
    vertical: {
      true: "w-8 h-8", // Sidebar: normal
      false: "w-6 h-6", // Header: pequeño
    },
    copied: {
      true: "!text-background-main !border-accent-green !bg-accent-green !duration-500",
      false: "",
    },
  },
  defaultVariants: {
    copied: false,
  },
});

const downloadCvStyle = tv({
  base: `
    flex items-center justify-center gap-1.5
    font-medium bg-highlight-yellow hover:bg-skill-tag
    text-text-primary hover:text-background-main
    rounded-md transition-all duration-200
    hover:shadow-md border-none cursor-pointer
    flex-shrink-0
  `,
  variants: {
    vertical: {
      true: "px-4 py-2 text-sm w-full", // Sidebar: grande
      false: "px-3 py-1.5 text-xs", // Header: compacto
    },
  },
});

const downloadTextStyle = tv({
  variants: {
    vertical: {
      true: "", // Sidebar: siempre mostrar texto
      false: "hidden xl:inline", // Header: mostrar texto solo en 1250px+
    },
  },
});
