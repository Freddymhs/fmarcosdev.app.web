import PageContentLayout from "../../templates/page-content-layout/Page-Content-Layout";
import { SEOHead } from "../../atoms";
import resumeData from "../../../../resume.json";
import useMediaQuery from "../../../hooks/useMediaQuery";
import Card from "../../molecules/project-card/Card";
import { Project } from "../../../types/projects";
import { Cloudinary } from "@cloudinary/url-gen";

const Projects = () => {
  const projects = resumeData.projects as Project[];

  return (
    <>
      <SEOHead
        title="Projects - Portfolio & Development Work"
        description="Explore my portfolio of web development projects featuring React, TypeScript, Node.js, and modern technologies"
        type="website"
        keywords={[
          "projects",
          "portfolio",
          "web development",
          "react projects",
          "javascript",
        ]}
      />
      <PageContentLayout
        stretch={true}
        fullHeight={false}
        content={{
          title: "Proyectos",
          subtitle:
            "Colección de proyectos web que he desarrollado, desde sitios informativos hasta aplicaciones móviles y herramientas interactivas",
          content: <CardsContainer projects={projects} />,
        }}
      />
    </>
  );
};

export default Projects;

const CardsContainer = ({ projects }: { projects: Project[] }) => {
  const { isDesktop } = useMediaQuery();
  const isMobile = !isDesktop;
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDNAME,
    },
  });
  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 max-w-screen-xl mx-auto w-full">
        {projects.map((props, i) => {
          return (
            <Card
              key={i}
              i={i}
              featured={i === 0}
              isMobile={isMobile}
              data={props}
              cld={cld}
            />
          );
        })}
      </div>
    </div>
  );
};
