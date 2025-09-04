import { useEffect, useState } from "react";

// BREAKPOINTS ESPECÍFICOS
const DESKTOP_QUERY = "(min-width: 1024px)"; // lg breakpoint
const LARGE_DESKTOP_QUERY = "(min-width: 1250px)"; // Nuevo: xl+ custom
const SMALL_QUERY = "(min-width: 640px)"; // sm breakpoint

export default function useMediaQuery() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [isMoreThanSmall, setIsMoreThanSmall] = useState(false);

  useEffect(() => {
    const desktopMedia = window.matchMedia(DESKTOP_QUERY);
    const largeDesktopMedia = window.matchMedia(LARGE_DESKTOP_QUERY);
    const smallMedia = window.matchMedia(SMALL_QUERY);

    const updateBreakpoints = () => {
      setIsDesktop(desktopMedia.matches);
      setIsLargeDesktop(largeDesktopMedia.matches);
      setIsMoreThanSmall(smallMedia.matches);
    };

    updateBreakpoints();

    desktopMedia.addEventListener("change", updateBreakpoints);
    largeDesktopMedia.addEventListener("change", updateBreakpoints);
    smallMedia.addEventListener("change", updateBreakpoints);

    return () => {
      desktopMedia.removeEventListener("change", updateBreakpoints);
      largeDesktopMedia.removeEventListener("change", updateBreakpoints);
      smallMedia.removeEventListener("change", updateBreakpoints);
    };
  }, []);

  return { 
    isDesktop, 
    isLargeDesktop, // Nuevo: para 1250px+
    isMoreThanSmall 
  };
}
