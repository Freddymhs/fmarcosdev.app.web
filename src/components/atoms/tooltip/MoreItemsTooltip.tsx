import { tv } from "tailwind-variants";

const tooltipStyles = tv({
  base: "relative group text-xs text-secondary-color/70 px-2 py-1 select-none cursor-pointer",
});

const tooltipContentStyles = tv({
  base: "absolute hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow top-full left-1/2 -translate-x-1/2 mt-1 z-10 whitespace-nowrap",
});

interface MoreItemsTooltipProps {
  hiddenItems: string[];
  count: number;
}

export const MoreItemsTooltip = ({
  hiddenItems,
  count,
}: MoreItemsTooltipProps) => (
  <span className={tooltipStyles()}>
    +{count} más
    <div className={tooltipContentStyles()}>{hiddenItems.join(", ")}</div>
  </span>
);

export default MoreItemsTooltip;
