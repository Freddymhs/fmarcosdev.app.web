import { tv } from "tailwind-variants";

const containerStyles = tv({
  base: `
    relative w-full h-full rounded-xl shadow-xl border overflow-hidden
    bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-100
  `,
});

interface CarouselContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselContainer = ({
  children,
  className,
}: CarouselContainerProps) => (
  <div className={containerStyles({ className })}>{children}</div>
);

export default CarouselContainer;
