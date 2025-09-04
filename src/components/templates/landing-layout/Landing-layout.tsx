// MainLayout.tsx
import { ReactNode } from "react";

interface LandingLayoutProps {
  version: string;
  children: ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ version, children }) => {
  return (
    <div
      className="
     bg-background-main
    flex justify-center items-center 
    h-screen 
    flex-col"
    >
      <p>{children}</p>
      <p>{version}</p>
    </div>
  );
};

export default LandingLayout;
