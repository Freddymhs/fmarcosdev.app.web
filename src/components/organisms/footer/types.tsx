export interface CopyrightSectionProps {
  isDesktop: boolean;
  height: number;
}
export interface NavigationItemProps {
  page: {
    to: string;
    label: string;
  };
  isDesktop: boolean;
  currentPath: string;
  height: number;
}
export interface NavigationSectionProps {
  pages: Array<{ to: string; label: string }>;
  height: number;
}
export interface FooterAreaProps {
  isDesktop: boolean;
  showContactInfo: boolean;
  height: number;
  isDebugMode?: boolean;
  children: React.ReactNode;
}
export interface FooterProps {
  debug?: boolean;
  footerHeight?: number;
}
