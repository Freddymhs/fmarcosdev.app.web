import { FeaturePill, TechContainer, MoreItemsTooltip } from "../../atoms";

interface FeaturePillGroupProps {
  features: string[];
  max?: number;
}

export const FeaturePillGroup = ({
  features,
  max = 10,
}: FeaturePillGroupProps) => {
  const visibleFeatures = features.slice(0, max);
  const hiddenFeatures = features.slice(max);

  return (
    <TechContainer>
      {visibleFeatures.map((feature, index) => (
        <FeaturePill key={index} feature={feature} />
      ))}

      {hiddenFeatures.length > 0 && (
        <MoreItemsTooltip
          hiddenItems={hiddenFeatures}
          count={hiddenFeatures.length}
        />
      )}
    </TechContainer>
  );
};

export default FeaturePillGroup;
