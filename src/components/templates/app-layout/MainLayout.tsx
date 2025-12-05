import type React from "react";
import { type ReactNode, useEffect, useState } from "react";
import { tv } from "tailwind-variants";
import { useLocation } from "react-router";
import useMediaQuery from "../../../hooks/useMediaQuery";

import NavigationFooter from "../../organisms/footer/NavigationFooter";
import { SideBar } from "../../organisms/header/Sidebar";
import Header from "../../organisms/header/Header";
import LayoutDebugPanel from "../../atoms/layout-debug-panel/LayoutDebugPanel";
import { LayoutProvider } from "../../../context/LayoutContext";

interface MainLayoutProps {
  children: ReactNode;
  debugMode?: boolean;
}

// 🎯 SINGLE SOURCE OF TRUTH - Layout Configuration
const LAYOUT_CONFIG = {
  HEADER_HEIGHT: 7, // vh units
  FOOTER_HEIGHT: 4, // vh units
  get MAIN_HEIGHT() {
    return 100 - this.HEADER_HEIGHT - this.FOOTER_HEIGHT;
  },
} as const;

// 🎨 Layout Styles with CSS Custom Properties
const layoutContainerStyles = tv({
  base: `
    flex flex-col h-screen 
    transition-all duration-300 ease-in-out
    bg-background-main
  `,
});

const headerStyles = tv({
  base: "flex-shrink-0 w-full",
});

const mainStyles = tv({
  base: "flex-1 overflow-auto min-h-0 h-full",
});

const footerStyles = tv({
  base: "flex-shrink-0 w-full",
});

const MainLayoutContent: React.FC<MainLayoutProps> = ({
  children,
  debugMode = false,
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isDesktop } = useMediaQuery();

  // 📊 Real-time layout calculations
  const layoutDimensions = {
    viewport: typeof window !== "undefined" ? window.innerHeight : 1080,
    headerHeight: Math.round(
      (LAYOUT_CONFIG.HEADER_HEIGHT / 100) *
        (typeof window !== "undefined" ? window.innerHeight : 1080)
    ),
    footerHeight: Math.round(
      (LAYOUT_CONFIG.FOOTER_HEIGHT / 100) *
        (typeof window !== "undefined" ? window.innerHeight : 1080)
    ),
    mainHeight: Math.round(
      (LAYOUT_CONFIG.MAIN_HEIGHT / 100) *
        (typeof window !== "undefined" ? window.innerHeight : 1080)
    ),
    headerHeightVh: LAYOUT_CONFIG.HEADER_HEIGHT,
    footerHeightVh: LAYOUT_CONFIG.FOOTER_HEIGHT,
    mainHeightVh: LAYOUT_CONFIG.MAIN_HEIGHT,
  };

  // Auto-close sidebar on desktop
  useEffect(() => {
    if (isDesktop && open) setOpen(false);
  }, [isDesktop, open]);

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Función para toggle del sidebar
  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <div className={layoutContainerStyles()}>
      {/* Sidebar con props actualizadas */}
      <SideBar open={open} onClose={() => setOpen(false)} />

      {/* 📏 Header - Controlled height with real component */}
      <header
        className={`${headerStyles()} ${
          debugMode ? "border-4 border-red-500 border-solid bg-red-50/20" : ""
        }`}
        style={{
          minHeight: `${LAYOUT_CONFIG.HEADER_HEIGHT}vh`,
          maxHeight: `${LAYOUT_CONFIG.HEADER_HEIGHT}vh`,
        }}
      >
        {debugMode && (
          <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-1 text-xs font-mono rounded z-50">
            HEADER: {LAYOUT_CONFIG.HEADER_HEIGHT}vh (
            {layoutDimensions.headerHeight}px)
          </div>
        )}
        {/* Header con props para manejar sidebar */}
        <Header onToggleSidebar={toggleSidebar} sidebarOpen={open} />
      </header>

      {/* 📏 Main - Flexible height fills remaining space */}
      <main
        className={`${mainStyles()} ${
          debugMode
            ? "border-4 border-green-500 border-solid bg-green-50/20"
            : ""
        }`}
      >
        {debugMode && (
          <div className="absolute top-36 left-1 bg-green-500 text-white px-2 py-1 text-xs font-mono rounded z-50">
            MAIN: {LAYOUT_CONFIG.MAIN_HEIGHT}vh ({layoutDimensions.mainHeight}
            px)
          </div>
        )}
        {children}
      </main>

      {/* 📏 Footer - Solo visible en Desktop (NavigationFooter retorna null en mobile) */}
      {isDesktop && (
        <footer
          className={`${footerStyles()} ${
            debugMode ? "border-4 border-blue-500 border-solid bg-blue-50/20" : ""
          }`}
          style={{
            height: `${LAYOUT_CONFIG.FOOTER_HEIGHT}vh`,
            overflow: "hidden",
          }}
        >
          {debugMode && (
            <div className="absolute bottom-1 left-1 bg-blue-500 text-white px-2 py-1 text-xs font-mono rounded z-50">
              FOOTER: {LAYOUT_CONFIG.FOOTER_HEIGHT}vh (
              {layoutDimensions.footerHeight}px)
            </div>
          )}
          <NavigationFooter />
        </footer>
      )}

      {/* 🔧 Debug Panel with Real-time Data */}
      {debugMode && (
        <LayoutDebugPanel
          show={debugMode}
          position="bottom-right"
          layoutData={layoutDimensions}
        />
      )}
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  debugMode = false,
}) => {
  return (
    <LayoutProvider>
      <MainLayoutContent debugMode={debugMode}>{children}</MainLayoutContent>
    </LayoutProvider>
  );
};

export default MainLayout;

// 🎯 Export layout configuration for other components to use
export { LAYOUT_CONFIG };
