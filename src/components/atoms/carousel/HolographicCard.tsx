import { tv } from "tailwind-variants";

const cardStyles = tv({
  base: `
    rounded-xl border-2 border-indigo-200 cursor-pointer p-4
    flex flex-col items-center justify-center text-center shadow-md
    bg-white/80 backdrop-blur-sm transition-all duration-300
    hover:shadow-xl hover:border-indigo-400 hover:bg-white hover:scale-[1.02]
  `,
});

const cardIconContainerStyles = tv({
  base: "bg-indigo-100 rounded-lg w-12 h-12 flex items-center justify-center mb-3",
});

const cardIconStyles = tv({
  base: "text-2xl text-indigo-600",
});

const cardTitleStyles = tv({
  base: "text-sm font-medium text-gray-800 leading-tight break-words line-clamp-3",
});

interface HolographicCardProps {
  title: string;
  icon?: string;
  onClick?: () => void;
}

export const HolographicCard = ({
  title,
  icon,
  onClick,
}: HolographicCardProps) => (
  <div className={cardStyles()} onClick={onClick}>
    {icon && (
      <div className={cardIconContainerStyles()}>
        <span className={cardIconStyles()}>{icon}</span>
      </div>
    )}
    <p className={cardTitleStyles()}>{title}</p>
  </div>
);

export default HolographicCard;
