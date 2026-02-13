import packageJson from "../package.json";
import { JSX, useMemo, useCallback } from "react";
import { Navigate, Route, Routes } from "react-router";
import MainLayout from "./components/templates/app-layout/MainLayout";
import LandingLayout from "./components/templates/landing-layout/Landing-layout";
import { usePageTransitions } from "./hooks/usePageTransitions";
import { useDailyFocus } from "./hooks/useDailyFocus";

import {
  CERTIFICATES_PAGE,
  HOME_PAGE,
  PROJECTS_PAGE,
  RoutePath,
  SOCIAL_PAGE,
  BLOG_PAGE,
  NO_INCLUDED_ROUTE_TO_PAGE,
  INITIAL_ROUTE,
  REGISTERED_PAGES,
} from "./constants";
import {
  AboutMe,
  Certificates,
  LandingPage,
  Social,
  Projects,
  Blog,
} from "./components/pages";
import { DailyFocusPill } from "@fmarcosdev/ui-core";
import useResumeData from "./hooks/useResumeData";

const App = () => {
  const { incompletedProjects, incompledteStudies } = useResumeData();

  const project = useDailyFocus(incompletedProjects);
  const study = useDailyFocus(incompledteStudies);

  usePageTransitions(); //! remove on react19 viewtransition
  const versionApp = useMemo(() => `V.${packageJson.version}`, []);

  const componentByRoute: Record<RoutePath, JSX.Element> = useMemo(
    () => ({
      [INITIAL_ROUTE]: (
        <LandingLayout version={versionApp}>
          <DailyFocusPill project={project?.name || ''} study={study?.name || ''} />
          <LandingPage />
        </LandingLayout>
      ),
      [HOME_PAGE]: <AboutMe />,
      [SOCIAL_PAGE]: <Social />,
      [CERTIFICATES_PAGE]: <Certificates />,
      [PROJECTS_PAGE]: <Projects />,
      [BLOG_PAGE]: <Blog />,
      [NO_INCLUDED_ROUTE_TO_PAGE]: <Navigate to={HOME_PAGE} replace />,
    }),
    [versionApp],
  );

  const routeDefinitions = useMemo(
    () =>
      REGISTERED_PAGES.map(({ to }) => ({
        path: to,
        element: componentByRoute[to],
      })),
    [componentByRoute],
  );
  const renderRoute = useCallback(
    (route: { path: string; element: JSX.Element }) => {
      const { element, path } = route;

      if (path === INITIAL_ROUTE) {
        return <Route key={path} path={path} element={element} />;
      }

      return (
        <Route
          key={path}
          path={path}
          // debug aca
          element={<MainLayout debugMode={false}>{element}</MainLayout>}
        />
      );
    },
    [],
  );

  const builtRoutes = useMemo(
    () => routeDefinitions.map(renderRoute),
    [routeDefinitions, renderRoute],
  );

  return <Routes>{builtRoutes}</Routes>;
};

export default App;
