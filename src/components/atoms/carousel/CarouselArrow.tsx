import { tv } from "tailwind-variants";

const arrowStyles = tv({
  base: `
    absolute top-1/2 z-10 transform -translate-y-1/2 
    rounded-full p-2 shadow-lg transition-all duration-300
    bg-white/80 hover:bg-white
  `,
  variants: {
    direction: {
      left: "left-2",
      right: "right-2",
    },
  },
});

const arrowIconStyles = tv({
  base: "h-6 w-6 text-indigo-600",
});

interface CarouselArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  children: React.ReactNode;
}

export const CarouselArrow = ({
  direction,
  onClick,
  children,
}: CarouselArrowProps) => (
  <button onClick={onClick} className={arrowStyles({ direction })}>
    <div className={arrowIconStyles()}>{children}</div>
  </button>
);

export default CarouselArrow;
