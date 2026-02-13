/**
 * Hook para calcular transformaciones 3D (helix, carousels)
 * Reutilizable en múltiples componentes
 *
 * @usage
 * const { position, rotation, scale } = use3DTransform({
 *   index: 5,
 *   total: 15,
 *   radius: 5,
 *   height: 10,
 *   turns: 3,
 * });
 */

import { useMemo } from "react";

interface Transform3DParams {
  index: number;
  total: number;
  radius?: number;
  height?: number;
  turns?: number;
  clockwise?: boolean;
}

interface Transform3DResult {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  angle: number;
}

/**
 * Calcula transformaciones 3D para items en una hélice
 * Optimizado para memoización y cálculos eficientes
 */
export const use3DTransform = ({
  index,
  total,
  radius = 5,
  height = 10,
  turns = 3,
  clockwise = false,
}: Transform3DParams): Transform3DResult => {
  return useMemo(() => {
    if (total === 0) {
      return {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
        angle: 0,
      };
    }

    const progress = index / total;
    const angle = progress * Math.PI * 2 * turns;
    const sign = clockwise ? 1 : -1;

    return {
      position: {
        x: radius * Math.cos(angle * sign),
        y: progress * height - height / 2,
        z: radius * Math.sin(angle * sign),
      },
      rotation: {
        x: 0,
        y: angle * sign,
        z: 0,
      },
      scale: 0.6 + progress * 0.4,
      angle,
    };
  }, [index, total, radius, height, turns, clockwise]);
};

/**
 * Calcula transformación para carousel (rotación plana)
 */
interface CarouselTransformParams {
  index: number;
  total: number;
  radius?: number;
  clockwise?: boolean;
}

export const useCarouselTransform = ({
  index,
  total,
  radius = 4,
  clockwise = false,
}: CarouselTransformParams) => {
  return useMemo(() => {
    if (total === 0) {
      return { x: 0, z: 0, rotation: 0 };
    }

    const angle = (index / total) * Math.PI * 2;
    const sign = clockwise ? 1 : -1;

    return {
      x: radius * Math.cos(angle * sign),
      z: radius * Math.sin(angle * sign),
      rotation: angle * sign,
    };
  }, [index, total, radius, clockwise]);
};
