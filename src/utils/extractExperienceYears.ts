export const DEFAULT_EXPERIENCE_YEARS = 5;

const EXPERIENCE_YEARS_PATTERN =
  /(\d+)\s*\+\s*años|\+(\d+)\s*años|más\s+de\s+(\d+)\s*años/i;

export const extractExperienceYearsFromSummary = (
  summary: string | undefined,
): number => {
  if (!summary) return DEFAULT_EXPERIENCE_YEARS;

  const match = summary.match(EXPERIENCE_YEARS_PATTERN);
  const years = match?.[1] ?? match?.[2] ?? match?.[3];

  return years ? parseInt(years, 10) : DEFAULT_EXPERIENCE_YEARS;
};
