import { AboutMeTitle } from "../../../constants";
import { AnimatedTimeline } from "../../organisms";
import { SEOHead } from "../../atoms";
import PageContentLayout from "../../templates/page-content-layout/Page-Content-Layout";
import { useResumeData } from "../../../hooks/useResumeData";
import ProfessionalOverview from "../../organisms/overview/ProfessionalOverView";

const AboutMe = () => {
  const { summary } = useResumeData();
  return (
    <>
      <SEOHead
        title="About Me - Professional Experience & Skills"
        description="Learn about my professional journey as a Full Stack Developer, including work experience, technical skills, and career achievements"
        type="profile"
        keywords={[
          "about",
          "experience",
          "skills",
          "career",
          "professional background",
        ]}
      />
      <PageContentLayout
        stretch={true}
        fullHeight={false}
        content={{
          topSection: <ProfessionalOverview />,
          title: AboutMeTitle,
          subtitle: summary,
          content: <AnimatedTimeline />,
        }}
      />
    </>
  );
};

export default AboutMe;
