import { TechPill, TechContainer, MoreItemsTooltip } from "../../atoms";

interface TechPillGroupProps {
  technologies: string[];
  max?: number;
}

export const TechPillGroup = ({
  technologies,
  max = 10,
}: TechPillGroupProps) => {
  const visibleTechs = technologies.slice(0, max);
  const hiddenTechs = technologies.slice(max);

  return (
    <TechContainer>
      {visibleTechs.map((tech, index) => (
        <TechPill key={index} tech={tech} index={index} />
      ))}

      {hiddenTechs.length > 0 && (
        <MoreItemsTooltip
          hiddenItems={hiddenTechs}
          count={hiddenTechs.length}
        />
      )}
    </TechContainer>
  );
};

export default TechPillGroup;
