import { Calendar, GithubIcon, Link } from "lucide-react";
import { tv } from "tailwind-variants";
import IconButton from "../../../atoms/button/IconButton";
import { TechPillGroup, FeaturePillGroup } from "../../../molecules/pill-group";
import { Project } from "../../../../types/projects";

import { AdvancedImage, placeholder, lazyload } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { Cloudinary } from "@cloudinary/url-gen";

interface CardTypeProps {
  i: number;
  featured: boolean;
  isMobile: boolean;
  data: Project;
  cld: Cloudinary;
}

// Estilos usando Tailwind Variants
const cardContainerStyles = tv({
  base: `
    card-hover rounded-lg border border-solid border-read-color
    bg-white-area-color transition-smooth
    hover:border-2 hover:border-secondary-color hover:shadow-md
  `,
  variants: {
    width: {
      full: "w-full",
      half: "w-full md:w-[calc(50%-0.5rem)]",
    },
  },
});

const cardLayoutStyles = tv({
  base: "flex",
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
});

const imageContainerStyles = tv({
  base: "flex-5 bg-read-color",
});

const imageWrapperStyles = tv({
  base: `
    relative aspect-video min-h-full max-w-full bg-gray-100 
    flex items-center justify-center rounded-sm mx-auto
  `,
});

const badgeStyles = tv({
  base: "absolute text-xs font-semibold px-3 py-1 rounded-full z-10",
  variants: {
    type: {
      featured: "top-7 left-3 bg-primary-color my-2 ml-1",
      complexity:
        "bottom-2 right-2 bg-secondary-color/80 text-white font-medium px-2 py-1",
      role: "bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded",
    },
  },
});

const imageScrollStyles = tv({
  base: "h-full w-full overflow-hidden",
});

const advancedImageStyles = tv({
  base: `
    h-full w-full object-cover object-top cursor-pointer bg-gray-200
  `,
});

const contentContainerStyles = tv({
  base: "flex-4 w-full flex justify-center items-center",
});

const contentWrapperStyles = tv({
  base: "w-full p-10 flex flex-col justify-center",
});

const metaInfoStyles = tv({
  base: "flex flex-wrap items-center mt-4 gap-3 mb-4",
});

const typeTagStyles = tv({
  base: `
    bg-read-white-color border-2 md:border-3 rounded-full 
    px-5 py-0 md:py-1 align-center md:text-sm
  `,
});

const dateTextStyles = tv({
  base: "text-secondary-color/70",
});

const titleStyles = tv({
  base: `
    text-2xl font-semibold font-mono mb-2 transition-colors
    group-hover:text-primary-color
  `,
});

const descriptionStyles = tv({
  base: "text-sm text-secondary-color/70 mb-4",
});

const actionsContainerStyles = tv({
  base: "flex gap-3",
});

const linkStyles = tv({
  base: "flex-1",
});

const Card = ({ i, featured, isMobile, data, cld }: CardTypeProps) => {
  const isRequiredFullWidth = !!isMobile || i === 0;
  const isCardVertical = isMobile === true || i !== 0;

  const {
    name,
    type,
    startDate,
    endDate,
    image: imageId,
    description,
    technologies,
    githubUrl,
    url,
    features,
    role,
    complexity,
  } = data;
  const cloudImageOptimized = cld.image(imageId).resize(scale().width(800));

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`;
    }
    return startDate;
  };

  return (
    <div
      key={i}
      className={cardContainerStyles({
        width: isRequiredFullWidth ? "full" : "half",
      })}
    >
      <div
        className={cardLayoutStyles({
          direction: isCardVertical ? "vertical" : "horizontal",
        })}
      >
        <div className={imageContainerStyles()}>
          <div className={imageWrapperStyles()}>
            {featured && (
              <p className={badgeStyles({ type: "featured" })}>
                Proyecto Destacado
              </p>
            )}

            {complexity && (
              <p className={badgeStyles({ type: "complexity" })}>
                {complexity}
              </p>
            )}

            {role && <p className={badgeStyles({ type: "role" })}>{role}</p>}
            <div className={imageScrollStyles()}>
              <AdvancedImage
                cldImg={cloudImageOptimized}
                plugins={[placeholder({ mode: "blur" }), lazyload()]}
                className={advancedImageStyles()}
                alt={"image of " + name}
              />
            </div>
          </div>
        </div>

        <div className={contentContainerStyles()}>
          <div className={contentWrapperStyles()}>
            <div className={metaInfoStyles()}>
              <p className={typeTagStyles()}>{type}</p>
              <Calendar size={18} className={dateTextStyles()} />
              <p className={dateTextStyles()}>{formatDateRange()}</p>
            </div>

            <h3 className={titleStyles()}>{name}</h3>

            <p className={descriptionStyles()}>{description}</p>

            <FeaturePillGroup features={features} max={2} />

            <TechPillGroup technologies={technologies} max={11} />

            <div className={actionsContainerStyles()}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkStyles()}
              >
                <IconButton icon={<Link size={18} />} title="Ver Proyecto" />
              </a>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <IconButton
                  icon={<GithubIcon size={18} />}
                  title="Código"
                  type="small"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
