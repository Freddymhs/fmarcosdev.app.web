import { useEffect, useState, useCallback } from "react";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import HelicalScrollCards, {
  CardItem,
} from "../../organisms/blog/HelicalScrollCards";
import { SEOHead } from "../../atoms";
import PageContentLayout from "../../templates/page-content-layout/Page-Content-Layout";
import useMediaQuery from "../../../hooks/useMediaQuery";

interface Article extends CardItem {
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content?: string;
  richContent?: string;
}
interface BlogContentProps {
  articles: Article[];
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

const CARDS_PER_PAGE = 15;
const CARDS_START_OFFSET = 1;

const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(
    async (targetPage: number, append: boolean) => {
      try {
        const updateLoadingState = append ? setIsAppending : setIsLoading;
        updateLoadingState(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/articles?pagination[page]=${targetPage}&pagination[pageSize]=${CARDS_PER_PAGE}`
        );

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const response = await res.json();
        const newArticles = response.data || [];

        const hasMorePages =
          response.meta?.pagination?.page <
          response.meta?.pagination?.pageCount;
        setHasMore(hasMorePages);

        setArticles((prev) =>
          append ? [...prev, ...newArticles] : newArticles
        );
        setPage(targetPage);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch articles"
        );
      } finally {
        setIsLoading(false);
        setIsAppending(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchArticles(1, false);
  }, [fetchArticles]);

  const loadMore = useCallback(() => {
    const canLoadMore = !isAppending && hasMore;
    if (canLoadMore) {
      fetchArticles(page + 1, true);
    }
  }, [isAppending, hasMore, page, fetchArticles]);

  return { articles, isLoading, isAppending, error, hasMore, loadMore };
};

const Blog = () => {
  const { articles, isLoading, isAppending, error, hasMore, loadMore } =
    useArticles();

  const hasNoArticlesWithError = error && articles.length === 0;

  if (isLoading) {
    return <></>;
  }
  if (hasNoArticlesWithError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Blog - Tech Articles & Insights"
        description="Read my latest articles about web development, React, TypeScript, and modern programming techniques"
        type="website"
        keywords={[
          "blog",
          "articles",
          "web development",
          "react",
          "typescript",
          "programming",
        ]}
      />
      <PageContentLayout
        stretch={false}
        fullHeight={true}
        content={{
          content: (
            <BlogContent
              articles={articles}
              onLoadMore={loadMore}
              hasMore={hasMore}
              loadingMore={isAppending}
            />
          ),
        }}
      />
    </>
  );
};

export default Blog;

const BlogContent = ({
  articles,
  onLoadMore,
  hasMore,
  loadingMore,
}: BlogContentProps) => {
  const { isDesktop } = useMediaQuery();

  // Configuración responsiva
  const responsiveConfig = {
    slotCount: CARDS_PER_PAGE,
    cardScale: isDesktop ? 0.8 : 0.59, // Reducir escala en móvil
    turns: isDesktop ? 2 : 3, // Más vueltas en móvil para compactar
    yOffset: isDesktop ? 1 : -0.6, // Ajuste vertical
    helixHeight: isDesktop ? 13 : 10, // Altura menor en móvil
    cameraFov: isDesktop ? 48 : 75, // FOV más amplio en móvil
    topMarginSlots: CARDS_START_OFFSET,
    cardConfig: {
      canvasWidth: isDesktop ? 240 : 200,
      canvasHeight: isDesktop ? 300 : 250,
      titleMaxLength: isDesktop ? 20 : 15,
    },
  };

  return (
    <div className="flex flex-col flex-1 w-full h-full relative">
      <HelicalScrollCards<Article>
        // Key fuerza el re-mount al cambiar de breakpoint
        key={isDesktop ? "desktop" : "mobile"}
        items={articles}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
        debug={false}
        clockwise={false}
        scrollSpeed={1.5}
        hiddenReposition={true}
        loadingText={"Cargando contenido..."}
        emptyText="No hay artículos"
        config={responsiveConfig}
        theme={{
          gradientStart: "#fcf6e5",
          gradientMid: "#f4d03f",
          gradientEnd: "#f4d03f",
          border: "#2f4732",
          headerBg: "#2f4732",
          headerText: "#f4d03f",
          titleText: "#4a3f2e",
          dateBg: "#f4d03f",
          dateText: "#cb8d0b",
          dateSubtext: "#2f4732",
          helixLine: 0x7c9c3f,
        }}
        className=""
      />
    </div>
  );
};
