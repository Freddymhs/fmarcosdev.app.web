/**
 * Tipos para HelicalScrollCards
 * Extraído de HelicalScrollCards.tsx para reutilización
 */

export interface CardItem {
  id: number | string;
  title?: string;
  subtitle?: string;
  date?: string;
  Title?: string;
  publishedAt?: string;
}

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

export interface CardConfig {
  canvasWidth?: number;
  canvasHeight?: number;
  titleMaxLength?: number;
}

export interface HelixConfig {
  slotCount?: number;
  turns?: number;
  helixHeight?: number;
  cardScale?: number;
  yOffset?: number;
  cameraFov?: number;
  topMarginSlots?: number;
  cardConfig?: CardConfig;
}

export interface HelicalScrollCardsProps<T extends CardItem = CardItem> {
  items?: T[];
  config?: HelixConfig;
  debug?: boolean;
  hiddenReposition?: boolean;
  clockwise?: boolean;
  scrollSpeed?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  theme?: Partial<HelixTheme>;
  renderCardLabel?: (item: T, index: number) => string;
  renderCardTitle?: (item: T) => string;
}
