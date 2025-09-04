"use client";

import { useEffect, useState, useCallback } from "react";
import { tv } from "tailwind-variants";
// import { CONFIG_BLOG_CARDS } from "../../../constants/constants";
import type { CardPosition } from "../../../types/cardPosition";
import DevTools from "./devmode";
import type { CardData } from "../../../types/cardData";

// Estilos usando Tailwind Variants
const containerStyles = tv({
  base: "bg-gradient-to-b from-seconday-color via-read-color to-secondary-color relative overflow-hidden",
  variants: {
    debug: {
      true: "border border-amber-500",
      false: "",
    },
  },
});

const starsContainerStyles = tv({
  base: "fixed inset-0 opacity-20 pointer-events-none z-0",
});

const starStyles = tv({
  base: "absolute w-1 h-1 bg-white rounded-full animate-pulse",
});

const cardsContainerStyles = tv({
  base: "relative h-full w-full",
});

const cardStyles = tv({
  base: `
    fixed rounded-xl cursor-pointer group transition-all duration-300
    border border-[#8CB348]/40
    bg-gradient-to-br from-[#252830]/90 via-[#252830]/80 to-[#252830]/70
    hover:border-[#8CB348]/60 hover:shadow-[0_0_30px_rgba(140,179,72,0.3)]
    hover:bg-gradient-to-br hover:from-[#252830]/95 hover:via-[#252830]/85 hover:to-[#252830]/75
  `,
});

const cardContentStyles = tv({
  base: "p-3 flex flex-col items-center justify-center h-full text-center relative overflow-hidden",
});

const shineEffectStyles = tv({
  base: `
    absolute inset-0 opacity-0 group-hover:opacity-100
    bg-gradient-to-r from-transparent via-[#8CB348]/20 to-transparent 
    transform -skew-x-12
  `,
});

const cardTextStyles = tv({
  base: `
    text-xs font-medium leading-tight text-center break-words line-clamp-5 
    relative z-10 transition-colors duration-300
    text-[#8CB348] group-hover:text-white
  `,
});

const lightDotStyles = tv({
  base: `
    absolute top-2 right-2 w-1 h-1 rounded-full transition-all duration-300
    bg-[#8CB348]/40 group-hover:bg-[#8CB348]/80
  `,
});

const CONFIG_BLOG_CARDS = {
  helixTurns: 3, // Aumentamos las vueltas para un efecto más pronunciado
  radius: 280, // Aumentamos el radio para mejor distribución angular
  centerX: 35, // Ajustamos el centro para mejor balance visual
  speed: 240,
  cardSize: {
    width: 25, // Reducimos ligeramente para mejor distribución
    height: 16,
  },
  scrollSensitivity: 3900, // Más sensible para mejor control
  viewportHeight: 1700,
  blur: {
    threshold: -0.2, // Ajustamos el umbral de blur
    maxBlur: 1.5,
  },
  opacity: {
    min: 0.3,
    base: 0.1, // Aumentamos la opacidad base
  },
  scale: {
    min: 0.6, // Aumentamos la escala mínima
    variation: 0.5, // Más variación para efecto 3D pronunciado
  },
  rotation: {
    rotateY: -25, // Invertimos la rotación Y para coherencia
    rotateX: 8, // Invertimos y ajustamos la rotación X
    rotateZ: 12, // Aumentamos para más dinamismo
  },
};

export default function HelicoidalCards({
  debug = false,
  cards = [],
  cardAction,
  filterHeight = 0,
}: {
  debug?: boolean;
  cards: CardData[];
  cardAction: (id: string) => void;
  filterHeight?: number;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [isAutoScroll] = useState(false);
  const [, setDocumentHeight] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoScroll) {
      interval = setInterval(() => {
        setScrollY((prev) => prev + CONFIG_BLOG_CARDS.speed * 2);
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isAutoScroll]);

  // Manual scroll handler
  useEffect(() => {
    if (!isAutoScroll) {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isAutoScroll]);

  // fix height position for cards
  useEffect(() => {
    const newHeight = document.documentElement.scrollHeight;
    setDocumentHeight(newHeight);
  }, []);

  // Calculate optimal container height based on card distribution
  const getOptimalHeight = useCallback(() => {
    if (cards.length === 0) return 100;

    const totalCards = cards.length;
    const viewportHeight = CONFIG_BLOG_CARDS.viewportHeight;

    const lastCardPosition =
      ((totalCards - 1) / (totalCards - 5)) *
      (cards.length * CONFIG_BLOG_CARDS.cardSize.height * 20 - viewportHeight);

    const bufferHeight = viewportHeight / 3;
    const optimalHeight =
      ((lastCardPosition + bufferHeight) / window.innerHeight) * 100;

    return Math.max(200, Math.min(optimalHeight, cards.length * 150));
  }, [cards.length]);

  // Calculate card positions
  const getCardPosition = useCallback(
    (index: number, scroll: number): CardPosition => {
      const totalCards = cards.length;
      const documentHeight =
        cards.length * CONFIG_BLOG_CARDS.cardSize.height * 20;

      const viewportHeight = CONFIG_BLOG_CARDS.viewportHeight;

      const cardVerticalPosition =
        (index / (totalCards - 5)) * (documentHeight - viewportHeight);

      const relativePosition =
        cardVerticalPosition - scroll + viewportHeight / 7;
      const viewportPercentage = (relativePosition / viewportHeight) * 100;
      const scrollProgress = scroll / CONFIG_BLOG_CARDS.scrollSensitivity;

      // Cálculos helicoidales usando CONFIG_BLOG_CARDS
      const anglePerCard =
        (Math.PI * 2 * CONFIG_BLOG_CARDS.helixTurns) / totalCards;
      const baseAngle = index * anglePerCard;
      const currentAngle = baseAngle + scrollProgress * Math.PI * 2;

      // Posición horizontal (efecto helicoidal) izq o derecha
      const x =
        CONFIG_BLOG_CARDS.centerX -
        (Math.cos(currentAngle) * CONFIG_BLOG_CARDS.radius) / 8;

      // Calcular zona de exclusión basada en la altura real de los filtros
      const exclusionZoneHeight =
        filterHeight > 0 ? (filterHeight / window.innerHeight) * 100 : 30;

      // Posición Y original sin ajustes
      const rawY = viewportPercentage;

      // Ajuste directo: simplemente sumar la zona de exclusión al resultado final
      const y = rawY + exclusionZoneHeight;

      // Solo mostrar cards cerca del viewport (ajustado para la nueva distribución)
      const isVisible =
        y > exclusionZoneHeight - 10 && y < 130 + exclusionZoneHeight;

      // Profundidad 3D
      const depth = Math.sin(currentAngle);
      const scale =
        CONFIG_BLOG_CARDS.scale.min +
        (depth + 0.5) * CONFIG_BLOG_CARDS.scale.variation;

      // Z-index controlado para no interferir con filtros
      const zIndex = Math.max(1, Math.min(20, Math.round((depth + 1) * 10)));
      const opacity = CONFIG_BLOG_CARDS.opacity.base + (depth + 1) * 1;

      // Rotaciones 3D usando CONFIG_BLOG_CARDS
      const rotateY = depth * CONFIG_BLOG_CARDS.rotation.rotateY;
      const rotateX =
        Math.cos(currentAngle) * CONFIG_BLOG_CARDS.rotation.rotateX;
      const rotateZ =
        Math.sin(currentAngle * 2) / CONFIG_BLOG_CARDS.rotation.rotateZ;

      // Efectos visuales usando CONFIG_BLOG_CARDS
      const blur =
        depth < CONFIG_BLOG_CARDS.blur.threshold
          ? CONFIG_BLOG_CARDS.blur.maxBlur
          : depth < 0
          ? 1
          : 0;
      const brightness = 0.8 + (depth + 1) * 0.3;

      return {
        left: `${Math.max(10, Math.min(85, x))}%`,
        top: `${y}%`,
        transform: `
          perspective(1200px) 
          rotateY(${rotateY}deg) 
          rotateX(${rotateX}deg) 
          rotateZ(${rotateZ}deg)
          scale(${scale})
          translateZ(${depth * 50}px)
        `,
        zIndex: isVisible ? zIndex : 0,
        opacity: Math.max(CONFIG_BLOG_CARDS.opacity.min, Math.min(1, opacity)),
        // filter: `blur(${blur}px) brightness(${brightness})`,
        isInFront: zIndex > 10,
        depth,
        scale,
      };
    },
    [cards.length, filterHeight]
  );

  return (
    <>
      <div
        className={containerStyles({ debug })}
        style={{
          minHeight: `${getOptimalHeight()}vh`,
        }}
      >
        {/* Background stars effect */}
        <div className={starsContainerStyles()}>
          {Array.from({ length: 33 }).map((_, i) => (
            <div
              key={i}
              className={starStyles()}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Cards container */}
        <div className={cardsContainerStyles()}>
          {cards.map((card, index) => {
            const { title, id } = card;
            const position = getCardPosition(index, scrollY);
            return (
              <div
                onClick={() => cardAction(id)}
                key={index}
                className={cardStyles()}
                style={{
                  ...position,
                  width: `${CONFIG_BLOG_CARDS.cardSize.width}%`,
                  height: `${CONFIG_BLOG_CARDS.cardSize.height}%`,
                }}
              >
                <div className={cardContentStyles()}>
                  {/* Efecto de brillo elegante */}
                  <div
                    className={shineEffectStyles()}
                    style={{
                      transform: `translateX(${
                        position.isInFront ? "0%" : "-100%"
                      }) skewX(-12deg)`,
                      transition: "all 0.6s ease",
                    }}
                  />

                  {/* Contenido del texto */}
                  <span className={cardTextStyles()}>
                    {title}
                  </span>

                  {/* Punto de luz sutil en la esquina */}
                  <div className={lightDotStyles()} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
