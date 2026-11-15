import type { Resume } from "../types/resume";

const resumeRequests = new Map<string, Promise<Resume>>();

const requestResume = async (url: string): Promise<Resume> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Resume API error: ${res.status}`);
  return res.json();
};

export const fetchResumeOnce = (url: string): Promise<Resume> => {
  const cached = resumeRequests.get(url);
  if (cached) return cached;

  const request = requestResume(url);
  resumeRequests.set(url, request);
  request.catch(() => resumeRequests.delete(url));
  return request;
};

export const clearResumeRequests = (): void => resumeRequests.clear();
