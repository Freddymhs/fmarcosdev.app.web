import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { useResumeData } from "../../../hooks/useResumeData";
import PageContentLayout from "../../templates/page-content-layout/Page-Content-Layout";

// Estilos usando Tailwind Variants
const contentContainerStyles = tv({
  base: "w-full flex-1 flex flex-col",
});

const gridWrapperStyles = tv({
  base: "container mx-auto px-4 py-4 flex-1",
});

const certificatesGridStyles = tv({
  base: "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
});

const certificateCardStyles = tv({
  base: `
    bg-cv-light rounded-xl shadow-lg overflow-hidden 
    transition-transform hover:scale-105
    h-full flex flex-col
  `,
});

const imageContainerStyles = tv({
  base: "w-full h-64 flex items-center justify-center p-2 flex-shrink-0",
});

const certificateImageStyles = tv({
  base: "max-h-full object-contain",
});

const cardContentStyles = tv({
  base: "px-4 py-2 flex-1 flex flex-col",
});

const certificateTitleStyles = tv({
  base: "font-semibold text-lg text-cv-dark font-mono truncate",
});

const certificateMetaStyles = tv({
  base: "text-sm text-cv-secondary mt-auto py-2",
});

const actionsContainerStyles = tv({
  base: "flex gap-4 mt-2 text-xs pb-2",
});

const actionButtonStyles = tv({
  base: "flex items-center hover:opacity-80",
  variants: {
    variant: {
      view: "text-cv-secondary",
      download: "text-cv-green",
    },
  },
});

const actionIconStyles = tv({
  base: "mr-1",
});

const filterBarStyles = tv({
  base: "flex flex-wrap gap-2 mb-6",
});

const filterPillStyles = tv({
  base: "px-3 py-1 rounded-full text-xs font-mono border transition-colors cursor-pointer",
  variants: {
    active: {
      true: "bg-cv-dark text-cv-light border-cv-dark",
      false: "bg-transparent text-cv-secondary border-cv-secondary hover:border-cv-dark hover:text-cv-dark",
    },
  },
});

const ALL_CATEGORY = "todos";

const Certificates = () => {
  const { certificates } = useResumeData();
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const categories = [
    ALL_CATEGORY,
    ...Array.from(
      new Set(certificates.map((c) => c.category).filter(Boolean) as string[])
    ).sort(),
  ];

  const visibleCertificates =
    activeCategory === ALL_CATEGORY
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);

  const Content = () => {
    return (
      <div className={contentContainerStyles()}>
        <div className={gridWrapperStyles()}>
          <div className={filterBarStyles()}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={filterPillStyles({ active: activeCategory === cat })}
              >
                {cat}
                {cat === ALL_CATEGORY && (
                  <span className="ml-1 opacity-60">{certificates.length}</span>
                )}
              </button>
            ))}
          </div>
          <div className={certificatesGridStyles()}>
            {visibleCertificates.map((cert) => (
              <div key={cert.name ?? ""} className={certificateCardStyles()}>
                <div className={imageContainerStyles()}>
                  <img
                    src={"certificates/" + (cert.name ?? "") + ".png"}
                    alt={cert.name ?? ""}
                    className={certificateImageStyles()}
                  />
                </div>
                <div className={cardContentStyles()}>
                  <h3 className={certificateTitleStyles()}>
                    {(cert.name ?? "").replace(/-/g, " ")}
                  </h3>
                  <p className={certificateMetaStyles()}>
                    {cert.issuer} • {cert.date}
                  </p>
                  <div className={actionsContainerStyles()}>
                    <button
                      onClick={() => window.open(cert.url, "_blank")}
                      className={actionButtonStyles({ variant: "view" })}
                    >
                      <ExternalLink size={14} className={actionIconStyles()} /> Ver
                    </button>
                    <a href={`certificates/${cert.name ?? ""}.png`} download>
                      <button className={actionButtonStyles({ variant: "download" })}>
                        <Download size={14} className={actionIconStyles()} /> Descargar
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContentLayout
      stretch={true}
      fullHeight={false}
      content={{ 
        title: "Certificados", 
        subtitle: "Mis certificaciones y cursos completados",
        content: <Content /> 
      }}
    />
  );
};

export default Certificates;
