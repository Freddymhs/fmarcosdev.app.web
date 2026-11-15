import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  clearResumeRequests,
  fetchResumeOnce,
} from "../utils/fetchResumeOnce";
import { formatCvUpdated } from "../utils/formatCvUpdated";

const RESUME_URL = "https://example.test/api/resume";

const stubFetch = (impl: () => Promise<unknown>) => {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const okResponse = (body: unknown) => () =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(body) });

beforeEach(() => {
  clearResumeRequests();
});

describe("fetchResumeOnce", () => {
  it("hace un solo request aunque lo pidan 11 consumidores a la vez", async () => {
    const fetchMock = stubFetch(okResponse({ basics: { name: "A" } }));

    const results = await Promise.all(
      Array.from({ length: 11 }, () => fetchResumeOnce(RESUME_URL)),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(results.every((r) => r === results[0])).toBe(true);
  });

  it("reutiliza el resultado en pedidos posteriores", async () => {
    const fetchMock = stubFetch(okResponse({ basics: { name: "A" } }));

    await fetchResumeOnce(RESUME_URL);
    await fetchResumeOnce(RESUME_URL);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("si falla, no cachea el error y el siguiente pedido reintenta", async () => {
    const failing = stubFetch(() => Promise.resolve({ ok: false, status: 500 }));
    await expect(fetchResumeOnce(RESUME_URL)).rejects.toThrow(
      "Resume API error: 500",
    );

    const working = stubFetch(okResponse({ basics: { name: "A" } }));
    await expect(fetchResumeOnce(RESUME_URL)).resolves.toBeDefined();

    expect(failing).toHaveBeenCalledTimes(1);
    expect(working).toHaveBeenCalledTimes(1);
  });
});

describe("formatCvUpdated", () => {
  it("devuelve null mientras no hay fecha, para no pintar «CV Actualizado ()»", () => {
    expect(formatCvUpdated(undefined)).toBeNull();
    expect(formatCvUpdated("")).toBeNull();
  });

  it("devuelve null con una fecha inválida", () => {
    expect(formatCvUpdated("no-es-fecha")).toBeNull();
  });

  it("formatea mes y año en es-ES", () => {
    expect(formatCvUpdated("2026-11-15T12:00:00Z")).toMatch(/2026/);
  });
});
