import {
  TechPill,
  FeaturePill,
  TechContainer,
  MoreItemsTooltip,
} from "../../atoms";

type ShowPillsProps = {
  items: string[];
  max?: number;
  format?: "pill" | "box";
};

const ShowPills = ({
  items = [],
  max = 10,
  format = "pill",
}: ShowPillsProps) => {
  const visibleItems = items.slice(0, max);
  const hiddenItems = items.slice(max);

  return (
    <TechContainer>
      {visibleItems.map((item, index) =>
        format === "pill" ? (
          <TechPill key={index} tech={item} index={index} />
        ) : (
          <FeaturePill key={index} feature={item} />
        )
      )}

      {hiddenItems.length > 0 && (
        <MoreItemsTooltip
          hiddenItems={hiddenItems}
          count={hiddenItems.length}
        />
      )}
    </TechContainer>
  );
};

export default ShowPills;
