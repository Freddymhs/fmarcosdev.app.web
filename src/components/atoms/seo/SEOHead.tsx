import { useEffect } from "react";
import { useLocation } from "react-router";
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  URL_SITE,
  AUTHOR_NAME,
} from "../../../constants";
import useResumeData from "../../../hooks/useResumeData";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  keywords?: string[];
}

export const SEOHead = ({
  title,
  description,
  image,
  type = "website",
  keywords = [],
}: SEOHeadProps) => {
  const location = useLocation();
  const resumeData = useResumeData();

  // Construir datos SEO dinámicamente desde resume.json
  const seoTitle = title || `${resumeData.name || AUTHOR_NAME} - ${SITE_TITLE}`;
  const seoDescription = description || resumeData.summary || SITE_DESCRIPTION;
  const seoImage = image || `${URL_SITE}/og-image.png`;
  const seoUrl = `${URL_SITE}${location.pathname}`;

  // Keywords dinámicas basadas en skills del resume
  const dynamicKeywords = [
    ...(resumeData.skills?.map((skill: any) => skill.keywords).flat() || []),
    ...(resumeData.work?.map((work: any) => work.highlights).flat() || []),
    ...keywords,
  ]
    .filter(Boolean)
    .slice(0, 20);

  useEffect(() => {
    // Actualizar title
    document.title = seoTitle;

    // Función helper para actualizar meta tags
    const updateMetaTag = (
      name: string,
      content: string,
      property?: boolean
    ) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector(
        `meta[${attribute}="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Meta tags básicos
    updateMetaTag("description", seoDescription);
    updateMetaTag("keywords", dynamicKeywords.join(", "));
    updateMetaTag("author", resumeData.name || AUTHOR_NAME);

    // Open Graph
    updateMetaTag("og:title", seoTitle, true);
    updateMetaTag("og:description", seoDescription, true);
    updateMetaTag("og:image", seoImage, true);
    updateMetaTag("og:url", seoUrl, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:site_name", SITE_TITLE, true);

    // Twitter Cards
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", seoTitle);
    updateMetaTag("twitter:description", seoDescription);
    updateMetaTag("twitter:image", seoImage);
    updateMetaTag(
      "twitter:creator",
      resumeData.profiles?.find((p: any) => p.network === "Twitter")
        ?.username || "@" + AUTHOR_NAME
    );

    // LinkedIn específico
    updateMetaTag(
      "linkedin:owner",
      resumeData.profiles?.find((p: any) => p.network === "LinkedIn")
        ?.username || ""
    );

    // Canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = seoUrl;

    // Schema.org JSON-LD
    const schemaData = {
      "@context": "https://schema.org",
      "@type": type === "profile" ? "Person" : "WebSite",
      name: resumeData.name || AUTHOR_NAME,
      url: URL_SITE,
      description: seoDescription,
      image: seoImage,
      ...(type === "profile" && {
        jobTitle: resumeData.label,
        worksFor: {
          "@type": "Organization",
          name: resumeData.work?.[0]?.name,
        },
        sameAs: resumeData.profiles?.map((profile: any) => profile.url),
        knowsAbout: dynamicKeywords.slice(0, 10),
        alumniOf: resumeData.education?.map((edu: any) => ({
          "@type": "EducationalOrganization",
          name: edu.institution,
        })),
      }),
    };

    // Insertar/actualizar JSON-LD
    let jsonLd = document.querySelector(
      'script[type="application/ld+json"]'
    ) as HTMLScriptElement;
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(schemaData);
  }, [
    seoTitle,
    seoDescription,
    seoImage,
    seoUrl,
    type,
    dynamicKeywords.join(","),
    resumeData,
  ]);

  return null; // Este componente no renderiza nada visible
};

export default SEOHead;
