import { useCallback, useEffect, useState, useMemo } from 'react';

interface LayoutDimensions {
  headerHeight: number; // en px
  footerHeight: number; // en px
  availableHeight: number; // en px
  availableHeightVh: number; // en vh
}

const useLayoutDimensions = () => {
  const [dimensions, setDimensions] = useState<LayoutDimensions>({
    headerHeight: 0,
    footerHeight: 0,
    availableHeight: 0,
    availableHeightVh: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const measureLayoutElements = useCallback((headerEl?: HTMLElement | null, footerEl?: HTMLElement | null) => {
    try {
      const headerHeight = headerEl?.getBoundingClientRect().height || 0;
      const footerHeight = footerEl?.getBoundingClientRect().height || 0;
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - headerHeight - footerHeight;
      const availableHeightVh = (availableHeight / viewportHeight) * 100;

      setDimensions({
        headerHeight,
        footerHeight,
        availableHeight,
        availableHeightVh,
      });
      setIsLoading(false);
    } catch (error) {
      console.warn('Error updating layout dimensions:', error);
      setIsLoading(false);
    }
  }, []);

  const getCSSHeight = useMemo(() => (type: 'available' | 'header' | 'footer') => {
    switch (type) {
      case 'available':
        return `${dimensions.availableHeightVh}vh`;
      case 'header':
        return `${dimensions.headerHeight}px`;
      case 'footer':
        return `${dimensions.footerHeight}px`;
      default:
        return 'auto';
    }
  }, [dimensions]);

  const debouncedMeasureLayout = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (headerEl?: HTMLElement | null, footerEl?: HTMLElement | null) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => measureLayoutElements(headerEl, footerEl), 150);
    };
  }, [measureLayoutElements]);

  useEffect(() => {
    const handleResize = () => {
      const headerEl = document.querySelector('header');
      const footerEl = document.querySelector('footer');
      debouncedMeasureLayout(headerEl as HTMLElement, footerEl as HTMLElement);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [debouncedMeasureLayout]);

  return {
    dimensions,
    measureLayoutElements,
    getCSSHeight,
    isLoading,
    debouncedMeasureLayout,
  };
};

export default useLayoutDimensions;
