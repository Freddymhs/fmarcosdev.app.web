"use client";

import { useEffect, useState, useCallback } from "react";
import { WELCOME_MESSAGES } from "../../../constants";
import ProgressBar from "../../atoms/progressbar";
import MessageArea from "../../atoms/messageArea";
import { SEOHead } from "../../atoms";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getRandomMessage = useCallback(
    () => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
    [],
  );

  useEffect(() => {
    if (progress === 100 && isLoading === false) {
      navigate("/about_me");
    }
  // navigate es estable por garantía de react-router (no cambia entre renders)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, isLoading]);

  useEffect(() => {
    setMessage(getRandomMessage());

    const progressInterval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          setIsLoading(false);
          clearInterval(progressInterval);
          return 100;
        }
        return currentProgress + 2.1;
      });
    }, 70);

    return () => clearInterval(progressInterval);
  }, [getRandomMessage]);

  return (
    <>
      <SEOHead
        title="Welcome to fmarcos.dev"
        description="Full Stack Developer portfolio featuring React, TypeScript, Node.js projects and professional experience"
        type="website"
        keywords={[
          "portfolio",
          "full stack developer",
          "react",
          "typescript",
          "web development",
        ]}
      />
      <MessageArea message={message} />
      <ProgressBar progress={progress} />
    </>
  );
}
//
