import resumeData from "../../resume.json";
import type { Resume, ResumeProject } from "../types/resume";

// Hook para acceder a los datos del CV
export const useResumeData = () => {
  const { basics } = resumeData;

  return {
    // Información básica
    name: basics.name,
    label: basics.label,
    email: basics.email,
    phone: basics.phone,
    website: basics.url,
    location: basics.location,
    summary: basics.summary,
    image: basics.image,

    // Perfiles sociales transformados a formato más usable
    profiles: basics.profiles.map((profile) => ({
      network: profile.network,
      username: profile.username,
      url: profile.url,
      // Mapear tipos conocidos con prioridad
      type:
        profile.network.toLowerCase() === "linkedin"
          ? "linkedin"
          : profile.network.toLowerCase() === "github"
            ? "github"
            : profile.network.toLowerCase() === "portfolio"
              ? "portfolio"
              : profile.network.toLowerCase() === "website" ||
                  profile.network.toLowerCase() === "webiste"
                ? "website"
                : profile.network.toLowerCase() === "hackerrank"
                  ? "hackerrank"
                  : "web",
    })),

    // Contactos PRIORIZADOS por importancia y espacio
    contacts: [
      // 1. Email - SIEMPRE primero (más importante)
      {
        name: basics.email,
        url: basics.email,
        type: "mail",
        priority: 1,
      },
      // 2. LinkedIn - Segundo más importante
      ...basics.profiles
        .filter((profile) => profile.network === "LinkedIn")
        .map((profile) => ({
          name: profile.url
            .replace("https://www.linkedin.com/in/", "")
            .replace("/", ""),
          url: profile.url,
          type: "linkedin",
          priority: 2,
        })),
      // 3. GitHub - Tercero más importante para devs
      ...basics.profiles
        .filter((profile) => profile.network === "GitHub")
        .map((profile) => ({
          name: profile.url.replace("https://github.com/", ""),
          url: profile.url,
          type: "github",
          priority: 3,
        })),
      // 4. Portfolio - Cuarto
      ...basics.profiles
        .filter((profile) => profile.network === "Portfolio")
        .map((profile) => ({
          name: profile.url.replace("https://www.", "").replace("https://", ""),
          url: profile.url,
          type: "portfolio",
          priority: 4,
        })),
      // 5. Website - Quinto
      ...basics.profiles
        .filter((profile) => ["Webiste", "Website"].includes(profile.network))
        .map((profile) => ({
          name: profile.url.replace("https://www.", "").replace("https://", ""),
          url: profile.url,
          type: "website",
          priority: 5,
        })),
      // 6. Hackerrank - Último
      ...basics.profiles
        .filter((profile) => profile.network === "Hackerrank")
        .map((profile) => ({
          name: "Hackerrank",
          url: profile.url,
          type: "hackerrank",
          priority: 6,
        })),
    ].sort((a, b) => a.priority - b.priority), // Ordenar por prioridad

    // Función para obtener contactos según espacio disponible
    getContactsBySpace: (maxItems: number) => {
      const allContacts = [
        {
          name: basics.email,
          url: basics.email,
          type: "mail",
          priority: 1,
        },
        ...basics.profiles
          .filter((profile) => profile.network === "LinkedIn")
          .map((profile) => ({
            name: profile.url
              .replace("https://www.linkedin.com/in/", "")
              .replace("/", ""),
            url: profile.url,
            type: "linkedin",
            priority: 2,
          })),
        ...basics.profiles
          .filter((profile) => profile.network === "GitHub")
          .map((profile) => ({
            name: profile.url.replace("https://github.com/", ""),
            url: profile.url,
            type: "github",
            priority: 3,
          })),
        ...basics.profiles
          .filter((profile) => profile.network === "Portfolio")
          .map((profile) => ({
            name: "Portfolio",
            url: profile.url,
            type: "portfolio",
            priority: 4,
          })),
        ...basics.profiles
          .filter((profile) => ["Webiste", "Website"].includes(profile.network))
          .map((profile) => ({
            name: "Website",
            url: profile.url,
            type: "website",
            priority: 5,
          })),
        ...basics.profiles
          .filter((profile) => profile.network === "Hackerrank")
          .map((profile) => ({
            name: "Hackerrank",
            url: profile.url,
            type: "hackerrank",
            priority: 6,
          })),
      ].sort((a, b) => a.priority - b.priority);

      return allContacts.slice(0, maxItems);
    },

    // Datos de trabajo, proyectos, etc. (filtrar elementos no publicados)
    work: resumeData.work,
    projects: (resumeData as Resume).projects.filter(
      (item: ResumeProject) => item.published !== false,
    ),

    skills: resumeData.skills,
    education: resumeData.education,
    incompledteStudies: resumeData.studies.filter(
      (item) => item.completed === false && item.startDate !== "",
    ),
    incompletedProjects: resumeData.projects.filter(
      (item) => item.published === false && item.startDate !== "",
    ),
    certificates: resumeData.certificates,
  };
};

export default useResumeData;
