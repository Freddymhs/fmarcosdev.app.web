import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 HELICAL SCROLL CARDS v8.0 - PORTABLE COMPONENT
// Virtualización real con paginación, soporte touch, SSR-safe, configurable
// ═══════════════════════════════════════════════════════════════════════════

// Tipo genérico para items (portable)
export interface CardItem {
  id: number | string;
  title?: string;
  subtitle?: string;
  date?: string;
  // Campos alternativos para compatibilidad
  Title?: string;
  publishedAt?: string;
}

// Configuración de colores (theme)
export interface HelixTheme {
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  border: string;
  headerBg: string;
  headerText: string;
  titleText: string;
  dateBg: string;
  dateText: string;
  dateSubtext: string;
  footerBg: string;
  footerText: string;
  helixLine: number;
}

const DEFAULT_THEME: HelixTheme = {
  gradientStart: "#1e40af",
  gradientMid: "#3b82f6",
  gradientEnd: "#1e40af",
  border: "#60a5fa",
  headerBg: "#1e3a8a",
  headerText: "#fbbf24",
  titleText: "#ffffff",
  dateBg: "#1e3a8a",
  dateText: "#fbbf24",
  dateSubtext: "#e5e7eb",
  footerBg: "#374151",
  footerText: "#9ca3af",
  helixLine: 0x2563eb,
};

// Defaults - pueden ser sobreescritos via props
const HELIX_DEFAULTS = {
  SLOT_COUNT: 15,
  TURNS: 3,
  SEGMENTS: 100, // Resolución de la hélice (más = curva más suave)
  HEIGHT_SPAN: 10,
  CARD_SCALE: 0.7,
  MAX_TEXTURE_CACHE: 50,
  // 🎯 Nuevos configurables
  Y_OFFSET: 0.4, // Desplazamiento vertical inicial de las cards
  CAMERA_FOV: 50, // Ángulo de visión (30=zoom, 70=angular)
  CARD_CANVAS_WIDTH: 200, // Ancho del canvas de las cards
  CARD_CANVAS_HEIGHT: 320, // Alto del canvas de las cards (ratio 1:1.6)
  TITLE_MAX_LENGTH: 18, // Caracteres máx por línea en títulos
  VISIBLE_OFFSET: 2, // Desde qué slot empiezan a aparecer las cards (0=tope, 2=2 slots abajo)
} as const;

// Configuración de las tarjetas
export interface CardConfig {
  canvasWidth?: number; // Ancho canvas de cards (default: 200)
  canvasHeight?: number; // Alto canvas de cards (default: 320)
  titleMaxLength?: number; // Max caracteres por línea en título (default: 18)
}

export interface HelixConfig {
  slotCount?: number; // Tarjetas visibles (default: 15)
  turns?: number; // Vueltas de la hélice (default: 3)
  helixHeight?: number; // Altura del espacio 3D de la hélice (default: 10)
  cardScale?: number; // Tamaño de tarjetas (default: 0.7)
  yOffset?: number; // Desplazamiento vertical de las cards (default: 0.4)
  cameraFov?: number; // Ángulo de visión de cámara (default: 50)
  topMarginSlots?: number; // Slots de margen superior antes de mostrar cards (default: 2)
  cardConfig?: CardConfig; // Configuración de las tarjetas
}

export interface HelicalScrollCardsProps<T extends CardItem = CardItem> {
  items?: T[];
  config?: HelixConfig;
  debug?: boolean; // Muestra línea de hélice y borde del contenedor
  hiddenReposition?: boolean;
  clockwise?: boolean;
  scrollSpeed?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  theme?: Partial<HelixTheme>;
  renderCardLabel?: (item: T, index: number) => string;
  renderCardTitle?: (item: T) => string;
  renderCardDate?: (
    item: T
  ) => { day: string; month: string; year: string } | null;
  loadingText?: string;
  emptyText?: string;
  className?: string;
}

const HelicalScrollCards = <T extends CardItem = CardItem>({
  items = [],
  config,
  debug = false,
  hiddenReposition = true,
  clockwise = false,
  scrollSpeed = 0.5,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  theme: customTheme,
  renderCardLabel,
  renderCardTitle,
  renderCardDate,
  loadingText = "Loading more...",
  emptyText = "No items to display",
  className = "",
}: HelicalScrollCardsProps<T>) => {
  // 🎯 SSR Guard
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const theme = { ...DEFAULT_THEME, ...customTheme };

  // 🎯 Merge config con defaults
  const helixConfig = {
    slotCount: config?.slotCount ?? HELIX_DEFAULTS.SLOT_COUNT,
    turns: config?.turns ?? HELIX_DEFAULTS.TURNS,
    segments: HELIX_DEFAULTS.SEGMENTS, // Interno, siempre 100
    helixHeight: config?.helixHeight ?? HELIX_DEFAULTS.HEIGHT_SPAN,
    cardScale: config?.cardScale ?? HELIX_DEFAULTS.CARD_SCALE,
    yOffset: config?.yOffset ?? HELIX_DEFAULTS.Y_OFFSET,
    cameraFov: config?.cameraFov ?? HELIX_DEFAULTS.CAMERA_FOV,
    topMarginSlots: config?.topMarginSlots ?? HELIX_DEFAULTS.VISIBLE_OFFSET,
    // Card config
    cardCanvasWidth:
      config?.cardConfig?.canvasWidth ?? HELIX_DEFAULTS.CARD_CANVAS_WIDTH,
    cardCanvasHeight:
      config?.cardConfig?.canvasHeight ?? HELIX_DEFAULTS.CARD_CANVAS_HEIGHT,
    titleMaxLength:
      config?.cardConfig?.titleMaxLength ?? HELIX_DEFAULTS.TITLE_MAX_LENGTH,
  };

  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const scrollOffsetRef = useRef(0);
  const targetScrollRef = useRef(0);
  const cardsRef = useRef<THREE.Mesh[]>([]);
  const pointsRef = useRef<THREE.Vector3[]>([]);
  const animationFrameIdRef = useRef<number | undefined>(undefined);
  const textureCacheRef = useRef<Map<string, THREE.CanvasTexture>>(new Map());
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const fadeAnimationsRef = useRef<Set<number>>(new Set()); // Track fade animations
  const isMountedRef = useRef(true);

  const lastLoadMoreCallRef = useRef(0);
  const maxScrollRef = useRef(0);

  // Refs para datos dinámicos (evita recrear escena)
  const itemsRef = useRef<T[]>(items);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const onLoadMoreRef = useRef(onLoadMore);
  const themeRef = useRef(theme);

  const configRef = useRef({
    turns: helixConfig.turns,
    segments: helixConfig.segments,
    helixHeight: helixConfig.helixHeight,
    cardCount: helixConfig.slotCount,
    cardScale: helixConfig.cardScale,
    scrollSensitivity: scrollSpeed,
    transitionThreshold: 0.95,
    yOffset: helixConfig.yOffset,
    cameraFov: helixConfig.cameraFov,
    cardCanvasWidth: helixConfig.cardCanvasWidth,
    cardCanvasHeight: helixConfig.cardCanvasHeight,
    titleMaxLength: helixConfig.titleMaxLength,
    topMarginSlots: helixConfig.topMarginSlots,
  });

  // Actualizar refs cuando cambien las props
  useEffect(() => {
    itemsRef.current = items;
    hasMoreRef.current = hasMore;
    loadingMoreRef.current = loadingMore;
    onLoadMoreRef.current = onLoadMore;
    themeRef.current = theme;

    const { cardCount, segments } = configRef.current;
    const maxScroll = Math.max(
      0,
      (items.length - cardCount) * (segments / cardCount)
    );
    maxScrollRef.current = maxScroll;

    // Limpiar caché si excede el límite
    if (textureCacheRef.current.size > HELIX_DEFAULTS.MAX_TEXTURE_CACHE) {
      const entries = Array.from(textureCacheRef.current.entries());
      const toRemove = entries.slice(
        0,
        entries.length - HELIX_DEFAULTS.MAX_TEXTURE_CACHE
      );
      toRemove.forEach(([key, texture]) => {
        texture.dispose();
        textureCacheRef.current.delete(key);
      });
    }
  }, [items, hasMore, loadingMore, onLoadMore, theme]);

  // Helpers para renderizar contenido de tarjetas
  const getCardLabel = useCallback(
    (item: T | undefined, index: number): string => {
      if (!item) return `#${index + 1}`;
      if (renderCardLabel) return renderCardLabel(item, index);
      return `#${item.id}`;
    },
    [renderCardLabel]
  );

  const getCardTitle = useCallback(
    (item: T | undefined, index: number): string => {
      if (!item) return `Item ${index + 1}`;
      if (renderCardTitle) return renderCardTitle(item);
      return item.title || item.Title || `Item ${index + 1}`;
    },
    [renderCardTitle]
  );

  const getCardDate = useCallback(
    (
      item: T | undefined
    ): { day: string; month: string; year: string } | null => {
      if (!item) return null;
      if (renderCardDate) return renderCardDate(item);
      const dateStr = item.date || item.publishedAt;
      if (!dateStr) return null;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return {
        day: date.getDate().toString().padStart(2, "0"),
        month: date
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase(),
        year: date.getFullYear().toString(),
      };
    },
    [renderCardDate]
  );

  // Crear textura de tarjeta
  const createCardTexture = useCallback(
    (item: T | undefined, index: number): THREE.CanvasTexture => {
      // 🎯 Canvas size configurable (default: 200x320)
      const canvasW = configRef.current.cardCanvasWidth;
      const canvasH = configRef.current.cardCanvasHeight;
      const maxLength = configRef.current.titleMaxLength;

      const cacheKey = item
        ? `${item.id}-${getCardTitle(item, index)}-${canvasW}x${canvasH}`
        : `empty-${index}-${canvasW}x${canvasH}`;

      const cached = textureCacheRef.current.get(cacheKey);
      if (cached) return cached;

      const currentTheme = themeRef.current;
      const canvas = Object.assign(document.createElement("canvas"), {
        width: canvasW,
        height: canvasH,
      });
      const ctx = canvas.getContext("2d")!;

      // 🎯 Proporciones relativas al tamaño del canvas
      const centerX = canvasW / 2;
      const titleStartY = canvasH * 0.18; // ~58px en 320 (espacio para badge)
      const dateY = canvasH * 0.688; // ~220px en 320
      const dateH = canvasH * 0.188; // ~60px en 320

      // 🎯 Font sizes proporcionales al canvas (basados en 320px de referencia)
      const fontBadge = Math.round(canvasH * 0.0375); // 12px en 320 (pequeño)
      const fontTitle = Math.round(canvasH * 0.063); // 20px en 320 (más grande)
      const fontDateDay = Math.round(canvasH * 0.075); // 24px en 320
      const fontDateSub = Math.round(canvasH * 0.0375); // 12px en 320
      const lineSpacing = Math.round(canvasH * 0.088); // 28px en 320 (más espacio)

      const fontFamily = "-apple-system, BlinkMacSystemFont, sans-serif";

      // Fondo con gradiente
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasH);
      gradient.addColorStop(0, currentTheme.gradientStart);
      gradient.addColorStop(0.7, currentTheme.gradientMid);
      gradient.addColorStop(1, currentTheme.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Borde delgado consistente con esquinas redondeadas (simulado)
      const borderWidth = Math.max(2, Math.round(canvasW * 0.01)); // 2-3px
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(
        borderWidth / 2,
        borderWidth / 2,
        canvasW - borderWidth,
        canvasH - borderWidth
      );

      // Badge pequeño con número (esquina superior derecha)
      const badgeText = getCardLabel(item, index);
      ctx.font = `bold ${fontBadge}px ${fontFamily}`;
      const badgeWidth = ctx.measureText(badgeText).width + Math.round(canvasW * 0.06);
      const badgeHeight = Math.round(canvasH * 0.06); // ~19px en 320
      const badgeX = canvasW - badgeWidth - Math.round(canvasW * 0.05); // Margen derecha
      const badgeY = Math.round(canvasH * 0.03); // Margen superior

      // Fondo del badge
      ctx.fillStyle = currentTheme.headerBg;
      const radius = Math.round(canvasH * 0.015); // Border radius pequeño
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, radius);
      ctx.fill();

      // Texto del badge
      ctx.fillStyle = currentTheme.headerText;
      ctx.textAlign = "center";
      ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + badgeHeight * 0.65);

      // Título con word wrap (maxLength configurable)
      const title = getCardTitle(item, index);
      ctx.fillStyle = currentTheme.titleText;
      ctx.font = `bold ${fontTitle}px ${fontFamily}`;

      const words = title.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        if ((currentLine + " " + word).length < maxLength) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);

      // 🎯 Line spacing proporcional
      lines.slice(0, 4).forEach((line, idx) => {
        ctx.fillText(line, centerX, titleStartY + idx * lineSpacing);
      });

      // Fecha
      const dateInfo = getCardDate(item);
      if (dateInfo) {
        const datePadding = Math.round(canvasW * 0.05);
        ctx.fillStyle = currentTheme.dateBg;
        ctx.fillRect(datePadding, dateY, canvasW - datePadding * 2, dateH);
        ctx.fillStyle = currentTheme.dateText;
        ctx.font = `bold ${fontDateDay}px ${fontFamily}`;
        ctx.fillText(dateInfo.day, centerX, dateY + dateH * 0.42);
        ctx.fillStyle = currentTheme.dateSubtext;
        ctx.font = `${fontDateSub}px ${fontFamily}`;
        ctx.fillText(
          `${dateInfo.month} ${dateInfo.year}`,
          centerX,
          dateY + dateH * 0.75
        );
      }

      const texture = new THREE.CanvasTexture(canvas);
      textureCacheRef.current.set(cacheKey, texture);
      return texture;
    },
    [getCardLabel, getCardTitle, getCardDate]
  );

  // Actualizar textura de tarjeta
  const updateCardTexture = useCallback(
    (card: THREE.Mesh, item: T | undefined, index: number) => {
      const plane = card.children.find(
        (child) => child instanceof THREE.Mesh
      ) as THREE.Mesh | undefined;
      if (plane && plane.material) {
        const material = plane.material as THREE.MeshBasicMaterial;
        const newTexture = createCardTexture(item, index);
        if (material.map !== newTexture) {
          material.map = newTexture;
          material.needsUpdate = true;
        }
      }
    },
    [createCardTexture]
  );

  // Main effect - Scene setup
  useEffect(() => {
    if (!isClient || !mountRef.current) return;

    isMountedRef.current = true;
    mountRef.current.innerHTML = "";

    const updateSize = () => {
      const rect = mountRef.current!.getBoundingClientRect();
      return {
        width: Math.max(rect.width, 100),
        height: Math.max(rect.height, 100),
      };
    };

    // 🎯 Helper para generar puntos de la hélice
    const generateHelixPoints = (w: number, h: number) => {
      const isMobile = w < 768;
      const isUltrawide = w / h > 2;

      // Radio consistente
      const radius = isMobile
        ? Math.max(2, w / 200)
        : Math.max(2.5, Math.min(4, w / 400));

      const { turns, segments, helixHeight } = configRef.current;
      const direction = clockwise ? 1 : -1;

      // 🎯 AJUSTE FINO VERTICAL (ahora configurable via config.yOffset):
      // Desplazamos toda la hélice hacia arriba para cerrar el gap visual
      // sin cambiar la lógica de slots (que usa enteros).
      // Valores típicos: 0.4 (default), 0 (sin offset), 1.0 (más arriba)
      const yOffset = configRef.current.yOffset;

      const newPoints = Array.from({ length: segments }, (_, i) => {
        const theta = (i / segments) * turns * Math.PI * 2;
        return new THREE.Vector3(
          radius * Math.cos(theta),
          (i / segments) * helixHeight + yOffset, // Shift UP
          radius * Math.sin(theta) * direction
        );
      });

      return { points: newPoints, radius, isMobile, isUltrawide };
    };

    // Initial setup
    // eslint-disable-next-line prefer-const
    let { width, height } = updateSize();
    const {
      points: initialPoints,
      radius,
      isMobile,
      isUltrawide,
    } = generateHelixPoints(width, height);
    pointsRef.current = initialPoints;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // 🎯 Camera FOV configurable (default: 50)
    const camera = new THREE.PerspectiveCamera(
      configRef.current.cameraFov,
      width / height,
      0.1,
      100
    );
    const cameraY = configRef.current.helixHeight * 0.5;

    // Cámara más alejada para ver mejor la hélice completa
    const cameraDistance = isMobile
      ? Math.max(radius * 2.5, 8)
      : isUltrawide
      ? Math.max(radius * 2.2, 7)
      : Math.max(radius * 2.5, 9);

    camera.position.set(0, cameraY, cameraDistance);
    camera.lookAt(0, cameraY, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const { segments, cardCount } = configRef.current;

    // 🐛 Debug: línea de la hélice solo visible en modo debug
    if (debug) {
      // Nota: La línea de debug no se actualiza en resize por simplicidad,
      // pero los puntos de la hélice sí.
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(initialPoints),
          new THREE.LineBasicMaterial({
            color: themeRef.current.helixLine,
            linewidth: 2,
          })
        )
      );
    }

    const cardScale = configRef.current.cardScale;

    // 🎯 Pre-calcular aspect ratio fuera del loop (optimización)
    const { cardCanvasWidth, cardCanvasHeight } = configRef.current;
    const aspectRatio = cardCanvasWidth / cardCanvasHeight;
    const planeHeight = 2.4 * cardScale;
    const planeWidth = planeHeight * aspectRatio;

    const cards = Array.from({ length: cardCount }, (_, i) => {
      const idx = Math.floor((i / cardCount) * segments);
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.8 * cardScale,
          0.4 * cardScale,
          0.05 * cardScale
        ),

        new THREE.MeshPhongMaterial({ color: 0xdc2626, shininess: 50 })
      );
      // Posición inicial
      card.position.copy(initialPoints[idx]);

      const item = itemsRef.current[i];
      const texture = createCardTexture(item, i);

      // Tarjetas con aspect ratio pre-calculado
      const numberPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(planeWidth, planeHeight),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      );
      numberPlane.position.z = 0.04;
      card.add(numberPlane);

      card.userData = { index: i, articleIndex: i };
      scene.add(card);
      return card;
    });

    cardsRef.current = cards;
    // pointsRef.current ya asignado arriba

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Scroll handler (wheel + touch)
    const handleScroll = (delta: number) => {
      const scrollDelta = delta * configRef.current.scrollSensitivity;
      const newTarget = targetScrollRef.current + scrollDelta;
      targetScrollRef.current = Math.max(
        0,
        Math.min(newTarget, maxScrollRef.current)
      );
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY > 0 ? 1 : -1);
    };

    // Touch support
    let touchStartY = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;

      if (Math.abs(deltaY) > 2) {
        handleScroll(deltaY > 0 ? 0.3 : -0.3);
      }
    };

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current)
        return;
      const { width: newWidth, height: newHeight } = updateSize();

      // Regenerar puntos con nuevo radio basado en width
      const {
        points: newPoints,
        radius: newRadius,
        isMobile: newIsMobile,
        isUltrawide: newIsUltrawide,
      } = generateHelixPoints(newWidth, newHeight);
      pointsRef.current = newPoints;

      cameraRef.current.aspect = newWidth / newHeight;
      const newCameraDistance = newIsMobile
        ? Math.max(newRadius * 2.5, 8)
        : newIsUltrawide
        ? Math.max(newRadius * 2.2, 7)
        : Math.max(newRadius * 2.5, 9);
      cameraRef.current.position.z = newCameraDistance;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(handleResize, 100);
    });
    resizeObserver.observe(mountRef.current);

    const isCardInTransition = (normalizedPos: number) => {
      const threshold = configRef.current.transitionThreshold;
      return normalizedPos > threshold || normalizedPos < 1 - threshold;
    };

    // Reusable vectors for animation (avoid GC)
    const tempVec = new THREE.Vector3();
    const tempTangent = new THREE.Vector3();
    const tempLook = new THREE.Vector3();

    // Animation loop
    const animate = () => {
      if (!isMountedRef.current) return;
      animationFrameIdRef.current = requestAnimationFrame(animate);

      // Faster interpolation = smoother response
      scrollOffsetRef.current +=
        (targetScrollRef.current - scrollOffsetRef.current) * 0.12;

      const currentItems = itemsRef.current;
      const { cardCount, segments } = configRef.current;

      // 🎯 VIRTUALIZACIÓN: Calcular qué "ventana" de artículos mostrar
      // scrollOffsetRef va de 0 a maxScroll
      // Cada unidad de scroll = 1 artículo avanza
      const scrollInArticles = scrollOffsetRef.current / (segments / cardCount);
      const baseArticleIndex = Math.floor(scrollInArticles);

      // Detectar si necesitamos cargar más artículos
      const lastVisibleArticle = baseArticleIndex + cardCount;
      if (
        lastVisibleArticle >= currentItems.length - 5 &&
        hasMoreRef.current &&
        !loadingMoreRef.current &&
        onLoadMoreRef.current
      ) {
        const now = Date.now();
        if (now - lastLoadMoreCallRef.current > 1000) {
          lastLoadMoreCallRef.current = now;
          onLoadMoreRef.current();
        }
      }

      // Update cards - VIRTUALIZACIÓN CON RECICLAJE CORRECTO
      // Cada tarjeta mantiene su artículo hasta que sale de vista y se recicla
      if (cardsRef.current.length > 0) {
        const spacing = segments / cardCount;

        cardsRef.current.forEach((card, slotIndex) => {
          // 🎯 POSICIÓN VISUAL en la hélice
          const rawPos = slotIndex * spacing + scrollOffsetRef.current;
          let pos = rawPos % segments;
          if (pos < 0) pos += segments;
          const normalizedPos = pos / segments;

          // 🎯 ÍNDICE DEL ARTÍCULO basado en cuántas vueltas completas ha dado este slot
          // Cada slot avanza 1 artículo cada vez que completa una vuelta (segments)
          const cyclesCompleted = Math.floor(rawPos / segments);

          // Invertir para que slot 14 (arriba) muestre los artículos más nuevos
          // En cycle 0: slot 14 → article 0, slot 0 → article 14
          const baseForThisSlot = cyclesCompleted * cardCount;

          // 🎯 MARGEN SUPERIOR (configurable via config.topMarginSlots):
          // Controla desde qué slot aparecen las cards visualmente.
          // Slot 14 es el tope absoluto. topMarginSlots=2 → empiezan desde slot 12.
          // Valores: 0 = tope absoluto, 2 (default) = 2 slots abajo del tope
          const topMarginSlots = configRef.current.topMarginSlots;
          const offsetInWindow = cardCount - 1 - topMarginSlots - slotIndex;

          const articleIndex = baseForThisSlot + offsetInWindow;

          const item = currentItems[articleIndex] as T | undefined;

          // Actualizar textura solo si el artículo cambió
          if (card.userData.articleIndex !== articleIndex) {
            card.userData.articleIndex = articleIndex;
            updateCardTexture(card, item, articleIndex);
          }

          if (!item || articleIndex < 0) {
            card.visible = false;
            return;
          }

          const posIdx = Math.floor(pos);
          const nextIdx = (posIdx + 1) % pointsRef.current.length;
          const fraction = pos - posIdx;

          // Reutilizar normalizedPos ya calculado arriba para shouldHide
          const shouldHide =
            hiddenReposition && isCardInTransition(normalizedPos);

          if (shouldHide) {
            card.visible = false;
            card.userData.wasHidden = true;
          } else {
            card.visible = true;

            // Use reusable vectors instead of creating new ones
            tempVec.lerpVectors(
              pointsRef.current[posIdx],
              pointsRef.current[nextIdx],
              fraction
            );
            card.position.copy(tempVec);

            tempTangent
              .subVectors(pointsRef.current[nextIdx], pointsRef.current[posIdx])
              .normalize();

            tempLook.subVectors(camera.position, card.position).normalize();
            card.lookAt(tempVec.copy(card.position).add(tempLook));

            card.rotateX(
              Math.atan2(
                tempTangent.y,
                Math.sqrt(
                  tempTangent.x * tempTangent.x + tempTangent.z * tempTangent.z
                )
              )
            );

            // Fade in animation (simplified - no React state updates)
            const material = card.material as THREE.MeshPhongMaterial;
            if (card.userData.wasHidden && material) {
              card.userData.wasHidden = false;
              if (!fadeAnimationsRef.current.has(slotIndex)) {
                fadeAnimationsRef.current.add(slotIndex);
                material.opacity = 0;
                material.transparent = true;

                const fadeIn = () => {
                  if (!isMountedRef.current) {
                    fadeAnimationsRef.current.delete(slotIndex);
                    return;
                  }
                  if (material) {
                    material.opacity = Math.min(1, material.opacity + 0.08);
                    if (material.opacity < 1) {
                      requestAnimationFrame(fadeIn);
                    } else {
                      material.transparent = false;
                      fadeAnimationsRef.current.delete(slotIndex);
                    }
                  }
                };
                fadeIn();
              }
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    const element = mountRef.current;
    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      isMountedRef.current = false;
      fadeAnimationsRef.current.clear();
      window.removeEventListener("resize", handleResize);
      element?.removeEventListener("wheel", handleWheel);
      element?.removeEventListener("touchstart", handleTouchStart);
      element?.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeObserver.disconnect();
      rendererRef.current?.dispose();
      cardsRef.current.forEach((card) => {
        card.geometry?.dispose();
        (card.material as THREE.Material)?.dispose();
        card.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            (child.material as THREE.Material)?.dispose();
          }
        });
      });
      textureCacheRef.current.forEach((texture) => texture.dispose());
      textureCacheRef.current.clear();
    };
  }, [
    isClient,
    debug,
    hiddenReposition,
    clockwise,
    createCardTexture,
    updateCardTexture,
  ]);

  // SSR fallback
  if (!isClient) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">{emptyText}</p>
      </div>
    );
  }

  // Empty state
  if (items.length === 0 && !loadingMore) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex-1 ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        // 🐛 Debug: borde rojo para ver límites del componente
        ...(debug && {
          border: "2px solid red",
          boxShadow: "inset 0 0 0 2px rgba(255,0,0,0.3)",
        }),
      }}
    >
      <div
        ref={mountRef}
        className="w-full h-full flex-1"
        style={{
          position: "relative",
          overflow: "hidden",
          touchAction: "none",
        }}
      />
      {loadingMore && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-full text-sm shadow-lg">
          {loadingText}
        </div>
      )}
    </div>
  );
};

export default HelicalScrollCards;
