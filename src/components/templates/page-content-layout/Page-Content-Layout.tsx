import React from "react";
import { tv } from "tailwind-variants";

type PageContentLayoutProps = {
  stretch: boolean;
  fullHeight?: boolean;
  padding?: boolean;
  content: {
    topSection?: React.ReactNode;
    title: string;
    content: React.ReactNode;
    subtitle?: string;
  };
};

const containerVariants = tv({
  base: "w-full",
  variants: {
    stretch: {
      true: "container mx-auto px-4",
      false: "w-full",
    },
  },
});

const PageContentLayout = ({
  stretch,
  fullHeight = false,
  padding = true,
  content: { title, content, subtitle, topSection },
}: PageContentLayoutProps) => {
  const sectionClasses = tv({
    base: "w-full transition-all duration-200 ease-in-out",
    variants: {
      fullHeight: {
        true: "flex flex-col h-full",
        false: "block",
      },
    },
  });

  const contentContainerClasses = tv({
    variants: {
      fullHeight: {
        true: "flex-1 flex flex-col h-full",
        false: "",
      },
    },
  });

  const headerClasses = tv({
    base: "text-center",
    variants: {
      fullHeight: {
        true: "py-4 flex-shrink-0",
        false: "mb-7",
      },
    },
  });

  const contentAreaClasses = tv({
    variants: {
      fullHeight: {
        true: "flex-1 flex flex-col overflow-auto",
        false: "",
      },
    },
  });

  return (
    <section
      className={sectionClasses({ fullHeight })}
      style={{
        padding: !fullHeight && padding ? "var(--spacing-page-margin) 0" : "0",
      }}
    >
      <div
        className={`${containerVariants({ stretch })} ${contentContainerClasses(
          { fullHeight }
        )}`}
      >
        <div className={headerClasses({ fullHeight })}>
          {topSection && <>{topSection}</>}

          <h2 className="text-3xl font-bold font-mono mb-5 text-text-primary">
            {title}
          </h2>
          {subtitle && (
            <h3 className="font-mono mb-7 text-text-secondary text-justify">
              {subtitle}
            </h3>
          )}
        </div>
        <div className={contentAreaClasses({ fullHeight })}>{content}</div>
      </div>
    </section>
  );
};

export default PageContentLayout;
