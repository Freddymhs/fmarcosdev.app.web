import { useState, useEffect } from "react";
import type { Resume, ResumeProject } from "../types/resume";

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

const EMPTY_ARRAY: never[] = [];

const buildContacts = (basics: Resume["basics"]) =>
  [
    {
      name: basics.email ?? "",
      url: basics.email ?? "",
      type: "mail",
      priority: 1,
    },
    ...basics.profiles
      .filter((p) => p.network === "LinkedIn")
      .map((p) => ({
        name: p.url
          .replace("https://www.linkedin.com/in/", "")
          .replace("/", ""),
        url: p.url,
        type: "linkedin",
        priority: 2,
      })),
    ...basics.profiles
      .filter((p) => p.network === "GitHub")
      .map((p) => ({
        name: p.url.replace("https://github.com/", ""),
        url: p.url,
        type: "github",
        priority: 3,
      })),
    ...basics.profiles
      .filter((p) => p.network === "Portfolio")
      .map((p) => ({
        name: p.url.replace("https://www.", "").replace("https://", ""),
        url: p.url,
        type: "portfolio",
        priority: 4,
      })),
    ...basics.profiles
      .filter((p) => ["Webiste", "Website"].includes(p.network))
      .map((p) => ({
        name: p.url.replace("https://www.", "").replace("https://", ""),
        url: p.url,
        type: "website",
        priority: 5,
      })),
    ...basics.profiles
      .filter((p) => p.network === "Hackerrank")
      .map((p) => ({
        name: "Hackerrank",
        url: p.url,
        type: "hackerrank",
        priority: 6,
      })),
  ].sort((a, b) => a.priority - b.priority);

export const useResumeData = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/resume`);
        if (!res.ok) throw new Error(`Resume API error: ${res.status}`);
        const data: Resume = await res.json();
        setResume(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch resume");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (!resume) {
    return {
      isLoading,
      error,
      name: "",
      label: "",
      email: "",
      phone: "",
      website: "",
      location: null,
      summary: "",
      image: "",
      profiles: EMPTY_ARRAY,
      contacts: EMPTY_ARRAY,
      getContactsBySpace: () => EMPTY_ARRAY,
      work: EMPTY_ARRAY,
      projects: EMPTY_ARRAY,
      skills: EMPTY_ARRAY,
      education: EMPTY_ARRAY,
      incompledteStudies: EMPTY_ARRAY,
      incompletedProjects: EMPTY_ARRAY,
      certificates: EMPTY_ARRAY,
    };
  }

  const { basics } = resume;
  const contacts = buildContacts(basics);

  return {
    isLoading,
    error,
    name: basics.name,
    label: basics.label ?? "",
    email: basics.email ?? "",
    phone: basics.phone ?? "",
    website: basics.url ?? "",
    location: basics.location ?? null,
    summary: basics.summary ?? "",
    image: basics.image ?? "",
    profiles: basics.profiles.map((profile) => ({
      network: profile.network,
      username: profile.username,
      url: profile.url,
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
    contacts,
    getContactsBySpace: (maxItems: number) => contacts.slice(0, maxItems),
    work: resume.work ?? EMPTY_ARRAY,
    projects: (resume.projects as ResumeProject[])
      .filter((item) => item.published !== false)
      .reverse(),
    skills: resume.skills ?? EMPTY_ARRAY,
    education: resume.education ?? EMPTY_ARRAY,
    incompledteStudies: (resume.studies ?? EMPTY_ARRAY).filter(
      (item) => item.completed === false && item.startDate !== "",
    ),
    incompletedProjects: resume.projects.filter(
      (item) => item.published === false && item.startDate !== "",
    ),
    certificates: resume.certificates ?? EMPTY_ARRAY,
  };
};

export default useResumeData;
