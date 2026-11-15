import { describe, it, expect } from "vitest";
import {
  DEFAULT_EXPERIENCE_YEARS,
  extractExperienceYearsFromSummary,
} from "../utils/extractExperienceYears";

describe("extractExperienceYearsFromSummary", () => {
  it("lee «más de N años»", () => {
    expect(
      extractExperienceYearsFromSummary("Desarrollador con más de 5 años en JS"),
    ).toBe(5);
  });

  it("sigue leyendo «N+ años»", () => {
    expect(extractExperienceYearsFromSummary("Dev con 7+ años")).toBe(7);
  });

  it("sigue leyendo «+N años»", () => {
    expect(extractExperienceYearsFromSummary("Dev con +6 años")).toBe(6);
  });

  it("cae al default si no hay número de años", () => {
    expect(extractExperienceYearsFromSummary("Dev fullstack")).toBe(
      DEFAULT_EXPERIENCE_YEARS,
    );
    expect(extractExperienceYearsFromSummary(undefined)).toBe(
      DEFAULT_EXPERIENCE_YEARS,
    );
  });
});
