import { useEffect, useState, useCallback } from "react";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import HelicalScrollCards, {
  CardItem,
} from "../../organisms/blog/HelicalScrollCards";
import { SEOHead } from "../../atoms";
import PageContentLayout from "../../templates/page-content-layout/Page-Content-Layout";

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
        const newArticles = (response.data || []) as Article[];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading articles...</div>
      </div>
    );
  }

  const hasNoArticlesWithError = error && articles.length === 0;

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
  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <HelicalScrollCards<Article>
        items={articles}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
        debug={false}
        clockwise={false}
        scrollSpeed={1.5}
        hiddenReposition={true}
        loadingText="Cargando..."
        emptyText="No hay artículos"
        config={{
          slotCount: CARDS_PER_PAGE,
          cardScale: 0.65,
          turns: 4,
          yOffset: 0.5,
          helixHeight: 6,
          cameraFov: 45,
          topMarginSlots: CARDS_START_OFFSET,
          cardConfig: {
            canvasWidth: 240,
            canvasHeight: 300,
            titleMaxLength: 20,
          },
        }}
        theme={{
          gradientStart: "#fcf6e5", // Crema base de tarjeta
          gradientMid: "#f4d03f", // Amarillo suave (highlight) para calidez sin saturar
          gradientEnd: "#f4d03f", // Fondo principal claro
          border: "#2f4732", // Verde acento como borde visible
          headerBg: "#2f4732", // Verde oscuro suavizado
          headerText: "#f4d03f", // Amarillo destacado para numeraciones
          titleText: "#4a3f2e", // Texto principal marrón
          dateBg: "#f4d03f", // Fondo limpio para la fecha
          dateText: "#cb8d0b", // Acento amarillo/marrón (skill-tag)
          dateSubtext: "#2f4732", // Texto secundario
          footerBg: "#2f4732", // Consistente con header
          footerText: "#fefce8", // Texto claro sobre fondo oscuro
          helixLine: 0x7c9c3f,
        }}
        className=""
      />
    </div>
  );
};
