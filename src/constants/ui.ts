// UI-specific constants and configurations

export const SCROLL_CONFIG = {
  BEHAVIOR: 'smooth' as ScrollBehavior,
  TO_TOP: { top: 0, behavior: 'smooth' as ScrollBehavior },
} as const;

export const FOOTER_CONFIG = {
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
  DEFAULT_HEIGHT: 17,
} as const;