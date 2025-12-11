export const complexityOptions = ["Simple", "Medio", "Complejo"] as const;

export type Complexity = (typeof complexityOptions)[number];

export interface Project {
  type: string;
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  image: string;
  features: string[];
  role: string;
  complexity: Complexity;
  published?: boolean;
}
