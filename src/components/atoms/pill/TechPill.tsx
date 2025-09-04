import { tv } from "tailwind-variants";
import { TECH_STACK_COLORS } from "../../../constants";

const techPillStyles = tv({
  base: "text-xs px-2 py-0.5 rounded-full transition-all duration-300 opacity-100 scale-100",
});

interface TechPillProps {
  tech: string;
  index?: number;
}

const getTechColor = (tech: string): string => {
  return TECH_STACK_COLORS[tech] || "bg-gray-100 text-gray-800";
};

export const TechPill = ({ tech }: TechPillProps) => (
  <span className={`${techPillStyles()} ${getTechColor(tech)}`}>{tech}</span>
);

export default TechPill;
