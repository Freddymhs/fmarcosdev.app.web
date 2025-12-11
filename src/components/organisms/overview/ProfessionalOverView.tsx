import { useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";
import resumeData from "../../../../resume.json";
import { ProfessionalOverviewTexts as texts } from "../../../constants/ProfessionalOverviewTexts";

// Definición de interfaces basadas en resume.json
interface Profile {
  network: string;
  url: string;
}

interface Basics {
  name: string;
  label: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    city: string;
    countryCode: string;
    timezone: string;
  };
  profiles: Profile[];
}

interface WorkExperience {
  name: string;
  position: string;
  type: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  technologies?: string[];
}

interface Project {
  name: string;
  // ... otras propiedades relevantes
}

interface Skill {
  name: string;
  level: string;
  keywords?: string[];
}

interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

interface Language {
  language: string;
  fluency: string;
}

interface Meta {
  lastUpdated?: string;
  // ... otras propiedades de meta
}

interface ResumeData {
  meta: Meta;
  basics: Basics;
  work: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  languages: Language[];
  // ... otras secciones si se necesitan
}

// ------------------ estilos (tailwind-variants) ------------------
const outerWrapper = tv({
  base: "max-w-5xl mx-auto py-7",
});

const yellowCard = tv({
  base: "rounded-lg border border-yellow-200 bg-yellow-50 p-6 shadow-sm transition-all duration-400",
  variants: {
    visible: {
      true: "opacity-100 translate-y-0",
      false: "opacity-0 translate-y-4",
    },
  },
});

const titleRow = tv({
  base: "flex flex-col items-center items-start md:items-center gap-2",
});

const titleStyles = tv({
  base: "text-2xl md:text-3xl font-extrabold tracking-tight",
});

const subtitleRow = tv({
  base: "flex flex-wrap gap-3 text-sm text-muted-foreground mt-2 justify-center sm:justify-start",
});

const contactRow = tv({
  base: "flex flex-wrap gap-4 items-center text-xs mt-3 justify-center sm:justify-start",
});

const statsGrid = tv({
  base: "grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 ",
});

const statBox = tv({
  base: "bg-white rounded-sm p-4 text-center shadow-sm border",
});

const statNumber = tv({ base: "text-lg font-bold" });

const statLabel = tv({ base: "text-xs text-muted-foreground mt-1" });

const bottomGrid = tv({ base: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" });

const card = tv({ base: "bg-white rounded-sm p-4 shadow-sm border text-sm" });

const cardTitle = tv({
  base: "flex items-center gap-2 font-semibold text-primary mb-2",
});

// ------------------ helpers ------------------
const parseYearFrom = (dateString?: string): number => {
  if (!dateString) return NaN;
  const [year] = dateString.split("-");
  return Number(year || NaN);
};

const calculateExperienceYears = (work: WorkExperience[]): number => {
  const startYears = work
    .map((job) => parseYearFrom(job.startDate))
    .filter((year) => !isNaN(year));

  if (startYears.length === 0) return 4; // Valor por defecto si no hay datos

  const earliestYear = Math.min(...startYears);
  const currentYear = new Date().getFullYear();
  const calculatedYears = currentYear - earliestYear;

  // Asegurarse de que al menos sea 1 año
  return Math.max(1, calculatedYears);
};

const extractExperienceYearsFromSummary = (
  summary: string | undefined
): number => {
  if (!summary) return 4; // Valor por defecto

  // Buscar patrón "+X años" o "X+ años" o "X años" en el resumen
  const match = summary.match(/(\d+)\s*\+\s*años|\+(\d+)\s*años/);
  if (match) {
    // match[1] for "X+ años" pattern, match[2] for "+X años" pattern
    const years = match[1] || match[2];
    if (years) {
      return parseInt(years);
    }
  }

  return 4; // Valor por defecto si no se encuentra
};

const getTopTechnologies = (skills: Skill[], limit: number = 5): string[] => {
  const techSet = new Set<string>();

  skills.forEach((skill) => {
    if (Array.isArray(skill.keywords)) {
      skill.keywords.forEach((keyword) => techSet.add(keyword));
    } else {
      techSet.add(skill.name);
    }
  });

  return Array.from(techSet).slice(0, limit);
};

const countUniqueTechnologies = (skills: Skill[]): number => {
  const techSet = new Set<string>();

  skills.forEach((skill) => {
    if (Array.isArray(skill.keywords)) {
      skill.keywords.forEach((keyword) => techSet.add(keyword));
    } else {
      techSet.add(skill.name);
    }
  });

  return techSet.size;
};

// ------------------ component ------------------
export default function ProfessionalOverview() {
  const data = resumeData as ResumeData;
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Obtener años de experiencia del resumen o calcularlos
  const experienceYears =
    extractExperienceYearsFromSummary(data.basics.summary) ||
    calculateExperienceYears(data.work);

  // Métricas
  const techCount = countUniqueTechnologies(data.skills);
  const certificatesCount = data.certificates.length;

  // Tecnologías principales (máx 8)
  const topTechs = getTopTechnologies(data.skills, 5);
  const totalTechs = countUniqueTechnologies(data.skills);
  const remainingTechs = totalTechs - topTechs.length;

  // Redes sociales
  const profiles = data.basics.profiles || [];

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.35 }
    );

    obs.observe(target);

    return () => obs.disconnect();
  }, []);

  return (
    <div className={outerWrapper()}>
      {/* tarjeta amarilla principal */}
      <div ref={ref} className={yellowCard({ visible })}>
        <div className={titleRow()}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">💻</span>
            <h2 className={titleStyles()}>
              {`${experienceYears}+ años ${data.basics.label}`}
            </h2>
          </div>

          {/* fila de tecnologías / país / remote */}
          <div className={subtitleRow()}>
            {topTechs.map((tech) => (
              <span key={tech} className="inline-flex items-center gap-2">
                <span className="font-medium">{tech}</span>
              </span>
            ))}
            {remainingTechs > 0 && (
              <span
                className="inline-flex items-center gap-2"
                title={texts.andMoreTechnologies.replace(
                  "{count}",
                  remainingTechs.toString()
                )}
              >
                <span className="font-medium">
                  +{remainingTechs} {texts.more}
                </span>
              </span>
            )}
            <span>🇨🇱 {data.basics.location?.city || texts.chile}</span>
            <span>🌍 {texts.remoteReady}</span>
            <span className="rounded-sm px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium">
              {texts.immediatelyAvailable}
            </span>
          </div>
        </div>

        {/* contacto / links */}
        <div className={contactRow()}>
          {data.basics.email && (
            <a
              className="flex items-center gap-2 hover:underline"
              href={`mailto:${data.basics.email}`}
            >
              <span>{data.basics.email}</span>
            </a>
          )}

          {profiles.map((profile) => (
            <a
              key={profile.url}
              className="hover:underline"
              href={profile.url}
              target="_blank"
              rel="noreferrer"
            >
              {profile.network}
            </a>
          ))}

          <span className="text-xs text-orange-600 font-medium">
            {texts.cvUpdated} (
            {data.meta.lastUpdated &&
              new Date(data.meta.lastUpdated).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
              })}
            )
          </span>
        </div>

        {/* stats */}
        <div className={statsGrid()}>
          {/* <div className={statBox()}>
            <div className={statNumber()}>{projectsCount}+</div>
            <div className={statLabel()}>{texts.projectsDelivered}</div>
          </div> */}

          <div className={statBox()}>
            <div className={statNumber()}>{experienceYears}+</div>
            <div className={statLabel()}>{texts.yearsExperience}</div>
          </div>

          <div className={statBox()}>
            <div className={statNumber()}>{techCount}+</div>
            <div className={statLabel()}>{texts.technologies}</div>
          </div>

          <div className={statBox()}>
            <div className={statNumber()}>{certificatesCount}</div>
            <div className={statLabel()}>{texts.certifications}</div>
          </div>
        </div>

        {/* Propuesta de valor - Grid 3 columnas */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mt-6 border border-blue-200 shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-4 text-center">
            {texts.valuePropositionTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {texts.technicalFocusAreas.map((area, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100"
              >
                <div className="text-3xl mb-2">{area.emoji}</div>
                <h4 className="font-bold text-blue-900 mb-2 text-sm">
                  {area.title}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tarjetas blancas inferiores */}
      <div className={bottomGrid()}>
        <div className={card()}>
          <h4 className={cardTitle()}>{texts.availabilityTitle}</h4>
          <ul className="space-y-2 mt-2">
            <li className="text-green-600 flex items-start">
              <span>{texts.openToOpportunities}</span>
            </li>
            <li className="text-green-600 flex items-start">
              <span>{texts.immediateAvailability}</span>
            </li>
            <li className="text-green-600 flex items-start">
              <span>{texts.responseGuaranteed}</span>
            </li>
          </ul>
        </div>

        <div className={card()}>
          <h4 className={cardTitle()}>{texts.workPreferencesTitle}</h4>
          <ul className="space-y-2 mt-2">
            <li className="text-blue-600 flex items-start">
              <span>{texts.remoteFirst}</span>
            </li>
            <li className="text-blue-600 flex items-start">
              <span>
                {texts.timezoneFlexible.replace(
                  "{location}",
                  data.basics.location?.city || texts.chile
                )}
              </span>
            </li>
            <li className="text-gray-700 flex items-start">
              <span>{texts.workType}</span>
            </li>
            <li className="text-gray-700 flex items-start">
              <span>{texts.languages}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
