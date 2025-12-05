import { useEffect, useState } from "react";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import HelicalScrollCards from "../../organisms/blog/Oscilospira";
import HeaderBlog from "../../organisms/header/headerBlog";
import { SEOHead } from "../../atoms";
import PageContentLayout from "../../templates/page-content-layout/Page-Content-Layout";
import { mockArticles } from "../../../data/mockArticles";

export interface Article {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  richContent: string;
  Title: string;
}

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles from API (temporarily using mock data)
  useEffect(() => {
    // Simulate API call with timeout
    const loadArticles = () => {
      setTimeout(() => {
        try {
          // TODO: Replace with actual API call when backend is ready
          // fetch("http://localhost:3033/Articles")
          //   .then((res) => {
          //     if (!res.ok) throw new Error("Failed to fetch articles");
          //     return res.json();
          //   })
          //   .then((data: Article[]) => {
          //     setArticles(data);
          //     setLoading(false);
          //   })

          // Using mock data for now
          setArticles(mockArticles);
          setLoading(false);
        } catch (error) {
          console.error("Error loading articles:", error);
          setError("Failed to load articles. Using mock data for now.");
          // Fallback to mock data even on error
          setArticles(mockArticles);
          setLoading(false);
        }
      }, 500); // Simulate network delay
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading articles...</div>
      </div>
    );
  }

  if (error) {
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
        stretch={false} // Usar todo el ancho disponible
        fullHeight={true} // Usar toda la altura disponible
        content={{
          // title: "Blog",
          // subtitle:
          //   articles.length > 0
          //     ? `Explorando ${articles.length} artículos sobre tecnología, desarrollo e innovación`
          //     : "No hay artículos disponibles en este momento",
          content: <BlogContent articles={articles} />,
        }}
      />
    </>
  );
};

export default Blog;

const BlogContent = ({ articles }: { articles: Article[] }) => {
  return (
    <div className="flex flex-col flex-1 w-full h-full">
      {/* <HeaderBlog /> */}

      {articles.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">No articles to display</p>
        </div>
      ) : (
        <HelicalScrollCards
          hiddenReposition={false}
          // filterHeight={80}
          articles={articles}
        />
      )}
    </div>
  );
};
