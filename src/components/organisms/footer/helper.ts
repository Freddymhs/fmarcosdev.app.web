const calculateFooterDimensions = (
  totalFooterHeight: number,
  isNavigationHidden: boolean
) => {
  if (isNavigationHidden) {
    return {
      backgroundHeight: totalFooterHeight,
      navigationHeight: 0,
    };
  }

  const backgroundHeight = Math.floor(
    totalFooterHeight * FOOTER_CONFIG.DESKTOP_HEIGHT_RATIO
  );
  const navigationHeight = totalFooterHeight - backgroundHeight;

  return {
    backgroundHeight,
    navigationHeight,
  };
};

const FOOTER_CONFIG = {
  DESKTOP_HEIGHT_RATIO: 0.73,
  SCROLL_BEHAVIOR: "smooth" as const,
  BUTTON_POSITION: {
    bottom: 7,
    right: 7,
  },
} as const;

export { FOOTER_CONFIG, calculateFooterDimensions };
