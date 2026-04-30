"use client";

import { useEffect, useState, useCallback } from "react";
import { WELCOME_MESSAGES } from "../../../constants";
import ProgressBar from "../../atoms/progressbar";
import MessageArea from "../../atoms/messageArea";
import { SEOHead } from "../../atoms";
import { useNavigate } from "react-router";
import { useResumeData } from "../../../hooks/useResumeData";
import { preload } from "react-dom";

export default function Landing() {
  const navigate = useNavigate();
  const { certificates } = useResumeData();

  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    certificates.forEach((cert) => {
      if (cert.name) preload("/certificates/" + cert.name + ".png", { as: "image" });
    });
  }, [certificates]);

  const getRandomMessage = useCallback(
    () => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
    [],
  );

  useEffect(() => {
    if (progress === 100 && isLoading === false) {
      navigate("/about_me");
    }
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
