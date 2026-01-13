import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export function usePageTransitions() {
  //! remove on react19 viewtransition
  const location = useLocation();
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    if (prevLocation.current === location.pathname) return;

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        prevLocation.current = location.pathname;
      });
    } else {
      prevLocation.current = location.pathname;
    }
  }, [location.pathname]);
}
