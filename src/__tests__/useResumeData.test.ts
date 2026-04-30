import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useResumeData } from "../hooks/useResumeData";

const mockResume = {
  basics: {
    name: "Freddy Huaylla",
    email: "fmarcosdev@gmail.com",
    profiles: [
      {
        network: "LinkedIn",
        username: "freddymhs",
        url: "https://www.linkedin.com/in/freddymhs/",
      },
      {
        network: "GitHub",
        username: "Freddymhs",
        url: "https://github.com/Freddymhs",
      },
    ],
  },
  work: [{ name: "Company", position: "Dev" }],
  projects: [
    { name: "Project A", published: true, startDate: "2024-01" },
    { name: "Project B", published: false, startDate: "2024-06" },
  ],
  skills: [{ name: "TypeScript" }],
  education: [],
  studies: [{ name: "Study A", completed: false, startDate: "2024-01" }],
  certificates: [],
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResume),
    }),
  );
});

describe("useResumeData", () => {
  it("empieza en estado de carga", () => {
    const { result } = renderHook(() => useResumeData());
    expect(result.current.isLoading).toBe(true);
  });

  it("devuelve datos del CV tras el fetch", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.name).toBe("Freddy Huaylla");
    expect(result.current.email).toBe("fmarcosdev@gmail.com");
  });

  it("devuelve proyectos como array", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Array.isArray(result.current.projects)).toBe(true);
  });

  it("filtra proyectos publicados", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.projects.every((p) => p.published !== false)).toBe(
      true,
    );
  });

  it("devuelve información de trabajo", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Array.isArray(result.current.work)).toBe(true);
  });

  it("devuelve habilidades", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Array.isArray(result.current.skills)).toBe(true);
  });

  it("devuelve estudios incompletos", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Array.isArray(result.current.incompledteStudies)).toBe(true);
  });

  it("devuelve proyectos incompletos", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Array.isArray(result.current.incompletedProjects)).toBe(true);
  });

  it("devuelve perfiles de contacto", async () => {
    const { result } = renderHook(() => useResumeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Array.isArray(result.current.profiles)).toBe(true);
  });
});
