import { useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";
import resumeData from "../../../../resume.json";
import { awardsText } from "../../../constants";
import ShowPills from "../../molecules/job-experience/TechPills";

interface ItemProps {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights?: string[];
  technologies?: string[];
}
// todo , this sohuld be in a helper

// Estilos usando Tailwind Variants
const timelineItemStyles = tv({
  base: "mb-4 bg-muted/30 p-3 rounded-sm border-l-2 border-highlight-yellow",
});

const nameAndDateContainerStyles = tv({
  base: "flex flex-row  justify-between ",
});

const nameStyles = tv({
  base: "text-primary font-bold text-lg block",
});

const dateContainerStyles = tv({
  base: "text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1",
});

const dateDotStyles = tv({
  base: "inline-block w-1.5 h-1.5 rounded-full bg-primary/30",
});

const dateTextStyles = tv({
  base: "truncate",
});

const summaryContainerStyles = tv({
  base: "flex-1",
});

const titleStyles = tv({
  base: `
    text-xl font-bold text-foreground mb-2 relative 
    group-hover:text-primary transition-colors duration-300
  `,
});
const RoleStyle = tv({
  base: "text-skill-tag",
});

const titleAccentStyles = tv({
  base: `
    absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 
    bg-primary/20 rounded-r-md hidden sm:block
  `,
});

const summaryTextStyles = tv({
  base: "text-sm text-muted-foreground mb-4 leading-relaxed",
});

const summaryFirstCharStyles = tv({
  base: "text-primary font-semibold text-base",
});

const highlightsContainerStyles = tv({
  // base: "mb-4 bg-muted/30 p-3 rounded-sm border-l-2 border-primary/30",
});

const highlightsTitleStyles = tv({
  base: "text-sm font-semibold mb-2 flex items-center",
});

const highlightsIconStyles = tv({
  base: "h-4 w-4 mr-1 text-primary",
});

const highlightsListStyles = tv({
  base: "space-y-2",
});

const highlightItemStyles = tv({
  base: "flex items-start text-sm transition-all duration-300",
  variants: {
    animated: {
      true: "opacity-100 translate-x-0",
      false: "opacity-100 -translate-x-2",
    },
  },
});

const highlightBulletStyles = tv({
  base: "inline-block w-1 h-1 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0",
});

const itemContainerStyles = tv({
  base: "flex flex-col sm:flex-row my-3 rounded-lg p-5 transition-all duration-300",
  variants: {
    visible: {
      true: "scale-[1.07]",
      false: "",
    },
  },
});

const timelineContainerStyles = tv({
  base: "flex-1 flex flex-col overflow-auto",
});

const timelineWrapperStyles = tv({
  base: "max-w-4xl mx-auto px-4 md:px-6 w-full",
});

const timelineListStyles = tv({
  base: "space-y-2",
});

const formatDate = (date: string) => {
  if (!date) return "No disponible";
  try {
    const [year, month] = date.split("-");
    const dateObj = new Date(Number(year), Number(month) - 1);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
    }).format(dateObj);
  } catch {
    return date;
  }
};

function TimelineItem({
  name,
  position,
  startDate,
  endDate,
  summary,
  highlights = [],
  technologies = [],
}: ItemProps) {
  const [showItem, setShowItem] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetElement = itemRef.current;
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowItem(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.6,
      }
    );

    observer.observe(targetElement);
    return () => observer.disconnect();
  }, []);

  const NameAndDate = () => {
    return (
      <div className={nameAndDateContainerStyles()}>
        <span className={nameStyles()}>{name}</span>
        <div className={dateContainerStyles()}>
          <span className={dateDotStyles()} />
          <span className={dateTextStyles()}>
            {formatDate(startDate)} – {formatDate(endDate)}
          </span>
        </div>
      </div>
    );
  };
  const Summary = () => (
    <div className={summaryContainerStyles()}>
      <NameAndDate />
      <h3 className={titleStyles()}>
        <span className={RoleStyle()}>{position}</span>
        <div className={titleAccentStyles()} />
      </h3>
      <p className={summaryTextStyles()}>
        <span className={summaryFirstCharStyles()}>{summary.charAt(0)}</span>
        {summary.slice(1)}
      </p>
      {highlights.length > 0 && (
        <div className={highlightsContainerStyles()}>
          <h4 className={highlightsTitleStyles()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={highlightsIconStyles()}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {awardsText}
          </h4>

          <ul className={highlightsListStyles()}>
            {highlights.map((item, index) => (
              <li
                key={index}
                className={highlightItemStyles({ animated: showItem })}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                *
                <span className={highlightBulletStyles()} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ShowPills items={technologies} max={17} format="pill" />
    </div>
  );
  return (
    <div ref={itemRef} className={timelineItemStyles()}>
      {/* <Dot /> */}
      <div className={itemContainerStyles({ visible: showItem })}>
        <Summary />
      </div>
    </div>
  );
}

const AnimatedTimeline = () => {
  const { work } = resumeData;

  return (
    <div className={timelineContainerStyles()}>
      <div className={timelineWrapperStyles()}>
        <div className={timelineListStyles()}>
          {work.map((item, index) => (
            <TimelineItem
              key={`${item.name}-${index}`}
              name={item.name}
              position={item.position}
              startDate={item.startDate}
              endDate={item.endDate}
              summary={item.summary}
              highlights={item.highlights}
              technologies={item.technologies}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedTimeline;
