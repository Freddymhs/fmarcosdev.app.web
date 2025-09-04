import { tv } from "tailwind-variants";

const featurePillStyles = tv({
  base: "text-xs bg-read-color text-white-area-color px-2 py-1 rounded border flex items-center gap-1",
});

interface FeaturePillProps {
  feature: string;
  icon?: string;
}

export const FeaturePill = ({ feature, icon = "✨" }: FeaturePillProps) => (
  <span className={featurePillStyles()}>
    <span>{icon}</span> {feature}
  </span>
);

export default FeaturePill;
