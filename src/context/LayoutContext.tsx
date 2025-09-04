import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import useLayoutDimensions from '../hooks/useLayoutDimensions';

interface LayoutDimensions {
  headerHeight: number;
  footerHeight: number;
  availableHeight: number;
  availableHeightVh: number;
}

type CSSHeightType = 'available' | 'header' | 'footer';

interface LayoutContextType {
  dimensions: LayoutDimensions;
  measureLayoutElements: (headerEl?: HTMLElement | null, footerEl?: HTMLElement | null) => void;
  getCSSHeight: (type: CSSHeightType) => string;
  isLoading: boolean;
  debouncedMeasureLayout: (headerEl?: HTMLElement | null, footerEl?: HTMLElement | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const layoutDimensions = useLayoutDimensions();
  
  const contextValue = useMemo(() => layoutDimensions, [layoutDimensions]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export default LayoutContext;
