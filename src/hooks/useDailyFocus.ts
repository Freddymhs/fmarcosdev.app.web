export const useDailyFocus = <T>(items: T[]): T | undefined => {
  if (items.length === 0) return undefined;
  const dayNumber = new Date().getDay();
  return items[dayNumber % items.length];
};
