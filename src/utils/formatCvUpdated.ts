const CV_UPDATED_LOCALE = "es-ES";

export const formatCvUpdated = (lastUpdated?: string): string | null => {
  if (!lastUpdated) return null;

  const date = new Date(lastUpdated);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString(CV_UPDATED_LOCALE, {
    year: "numeric",
    month: "short",
  });
};
