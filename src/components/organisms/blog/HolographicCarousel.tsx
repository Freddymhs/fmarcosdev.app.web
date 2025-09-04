import { useState, useEffect, useRef } from "react";
import { tv } from "tailwind-variants";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export interface CardData {
  id: number;
  title: string;
}

// Estilos usando Tailwind Variants
const containerStyles = tv({
  base: `
    relative w-full h-full rounded-xl shadow-xl border overflow-hidden
    bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-100
  `,
});

const emptyStateStyles = tv({
  base: "absolute inset-0 flex items-center justify-center",
});

const emptyTextStyles = tv({
  base: "text-gray-500 text-lg",
});

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

const indicatorStyles = tv({
  base: "inline-block w-3 h-3 rounded-full mx-1 transition-all duration-300",
  variants: {
    selected: {
      true: "bg-indigo-600 scale-125",
      false: "bg-indigo-300",
    },
  },
});

const groupContainerStyles = tv({
  base: "p-4",
});

const gridStyles = tv({
  base: "grid gap-4",
});

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

const groupIndicatorStyles = tv({
  base: `
    absolute bottom-4 left-1/2 transform -translate-x-1/2 
    bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 shadow-md
  `,
});

const groupIndicatorTextStyles = tv({
  base: "text-sm font-medium text-indigo-600",
});

export default function HolographicCarousel({
  cards = [],
  cardAction,
}: {
  cards: CardData[];
  cardAction: (id: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ rows: 1, columns: 3 });

  useEffect(() => {
    const calculateDimensions = () => {
      if (!containerRef.current) return;

      const { clientHeight, clientWidth } = containerRef.current;

      const rows = Math.min(4, Math.max(1, Math.floor(clientHeight / 180)));
      const columns = Math.min(6, Math.max(1, Math.floor(clientWidth / 200)));

      setDimensions({ rows, columns });
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  const cardsPerGroup = dimensions.rows * dimensions.columns;
  const groupedCards = [];

  for (let i = 0; i < cards.length; i += cardsPerGroup) {
    groupedCards.push(cards.slice(i, i + cardsPerGroup));
  }

  return (
    <div ref={containerRef} className={containerStyles()}>
      {cards.length === 0 ? (
        <div className={emptyStateStyles()}>
          <p className={emptyTextStyles()}>No hay tarjetas para mostrar</p>
        </div>
      ) : (
        <Carousel
          showArrows={groupedCards.length > 1}
          showStatus={false}
          showThumbs={false}
          swipeable={true}
          emulateTouch={true}
          infiniteLoop={false}
          renderArrowPrev={(onClickHandler, hasPrev) =>
            hasPrev && (
              <button
                onClick={onClickHandler}
                className={arrowStyles({ direction: "left" })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={arrowIconStyles()}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext) =>
            hasNext && (
              <button
                onClick={onClickHandler}
                className={arrowStyles({ direction: "right" })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={arrowIconStyles()}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )
          }
          renderIndicator={(onClickHandler, isSelected, index) => (
            <button
              onClick={onClickHandler}
              className={indicatorStyles({ selected: isSelected })}
              aria-label={`Ir al grupo ${index + 1}`}
            />
          )}
        >
          {groupedCards.map((group, groupIndex) => (
            <div key={groupIndex} className={groupContainerStyles()}>
              <div className={gridStyles()}
                style={{
                  gridTemplateColumns: `repeat(${dimensions.columns}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${dimensions.rows}, minmax(0, 1fr))`,
                  height: `${dimensions.rows * 180}px`,
                }}
              >
                {group.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => cardAction(card.id)}
                    className={cardStyles()}
                  >
                    <div className={cardIconContainerStyles()}>
                      <span className={cardIconStyles()}>📋</span>
                    </div>
                    <span className={cardTitleStyles()}>
                      {card.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      )}

      {groupedCards.length > 1 && (
        <div className={groupIndicatorStyles()}>
          <span className={groupIndicatorTextStyles()}>
            Grupo{" "}
            {groupedCards.findIndex((group) =>
              group.some((card) => card.id === groupedCards[0][0]?.id)
            ) + 1}{" "}
            de {groupedCards.length}
          </span>
        </div>
      )}
    </div>
  );
}
